import { Router } from 'express'
import { all, get } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const MODULES = ['All', 'auth', 'application', 'document', 'supplier', 'ticket', 'blacklist', 'performance', 'settings', 'communications', 'user']

router.get(
  '/audit-logs',
  asyncHandler(async (req, res) => {
    const module = cleanText(req.query.module) || 'All'
    const user = cleanText(req.query.user) || ''
    const search = cleanText(req.query.q) || ''
    const clauses = []
    const params = []
    if (module && module !== 'All') {
      clauses.push('module = ?')
      params.push(module)
    }
    if (user) {
      clauses.push('user = ?')
      params.push(user)
    }
    if (search) {
      clauses.push('(action LIKE ? OR detail LIKE ? OR entity LIKE ?)')
      const like = `%${search}%`
      params.push(like, like, like)
    }

    const rows = all(
      `SELECT * FROM audit_logs ${clauses.length ? 'WHERE ' + clauses.join(' AND ') : ''} ORDER BY created_at DESC LIMIT 200`,
      params,
    )

    const stats = {
      total30d: get("SELECT COUNT(*) AS n FROM audit_logs WHERE created_at >= date('now', '-30 days')")?.n ?? 0,
      success: get("SELECT COUNT(*) AS n FROM audit_logs WHERE success = 1 AND created_at >= date('now', '-30 days')")?.n ?? 0,
      security: get("SELECT COUNT(*) AS n FROM audit_logs WHERE module = 'auth' AND success = 0 AND created_at >= date('now', '-30 days')")?.n ?? 0,
      dataAccess7d: get("SELECT COUNT(*) AS n FROM audit_logs WHERE module IN ('application','document','supplier') AND created_at >= date('now', '-7 days')")?.n ?? 0,
    }

    const distinctUsers = all('SELECT DISTINCT user FROM audit_logs ORDER BY user').map((r) => r.user)

    res.json({
      modules: MODULES,
      users: distinctUsers,
      stats,
      data: rows.map((r) => ({
        id: r.id,
        user: r.user,
        role: r.role || 'Admin',
        action: r.action,
        module: r.module || '—',
        entity: r.entity || '—',
        ip: r.ip || '—',
        detail: r.detail || '',
        success: r.success === 1,
        time: r.created_at,
      })),
    })
  }),
)

export default router
