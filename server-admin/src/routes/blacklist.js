import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

function stats() {
  const active = get("SELECT COUNT(*) AS n FROM blacklist WHERE status = 'listed'")?.n ?? 0
  const reinstated = get("SELECT COUNT(*) AS n FROM blacklist WHERE status = 'reinstated'")?.n ?? 0
  return {
    total: get('SELECT COUNT(*) AS n FROM blacklist')?.n ?? 0,
    active,
    reinstated,
    addedThisMonth: get("SELECT COUNT(*) AS n FROM blacklist WHERE listed_at >= date('now', 'start of month')")?.n ?? 0,
    severe: get("SELECT COUNT(*) AS n FROM blacklist WHERE severity = 'High' AND status = 'listed'")?.n ?? 0,
  }
}

router.get(
  '/blacklist',
  asyncHandler(async (req, res) => {
    const filter = cleanText(req.query.status) || 'all'
    const search = cleanText(req.query.q) || ''
    const clauses = []
    const params = []
    if (filter && filter !== 'all') {
      clauses.push('status = ?')
      params.push(filter)
    }
    if (search) {
      clauses.push('(company LIKE ? OR reason LIKE ? OR code LIKE ?)')
      const like = `%${search}%`
      params.push(like, like, like)
    }

    const rows = all(
      `SELECT * FROM blacklist ${clauses.length ? 'WHERE ' + clauses.join(' AND ') : ''} ORDER BY listed_at DESC`,
      params,
    )

    res.json({
      stats: stats(),
      tabs: [
        { key: 'all', label: 'All', count: get('SELECT COUNT(*) AS n FROM blacklist')?.n ?? 0 },
        { key: 'listed', label: 'Listed', count: get("SELECT COUNT(*) AS n FROM blacklist WHERE status = 'listed'")?.n ?? 0 },
        { key: 'reinstated', label: 'Reinstated', count: get("SELECT COUNT(*) AS n FROM blacklist WHERE status = 'reinstated'")?.n ?? 0 },
      ],
      data: rows.map((r) => ({
        id: r.id,
        company: r.company,
        code: r.code || '—',
        reason: r.reason || '—',
        severity: r.severity || 'Medium',
        listedBy: r.listed_by || '—',
        listedAt: r.listed_at,
        reapply: r.reapply || 'Never',
        contact: r.contact || '—',
        status: r.status || 'listed',
      })),
    })
  }),
)

router.post(
  '/blacklist',
  asyncHandler(async (req, res) => {
    const company = cleanText(req.body.company)
    const reason = cleanText(req.body.reason)
    if (!company || !reason) return res.status(400).json({ error: 'Company and reason are required' })

    const existing = get('SELECT id FROM companies WHERE legal_name = ?', [company])
    const code = get('SELECT code FROM companies WHERE legal_name = ?', [company])?.code || `BL-${String(Date.now()).slice(-6)}`

    run(
      `INSERT INTO blacklist (company, code, reason, severity, listed_by, reapply, contact, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'listed')`,
      [company, code, reason, cleanText(req.body.severity) || 'Medium', req.admin.full_name, cleanText(req.body.reapply) || 'Never', cleanText(req.body.contact) || '—'],
    )

    if (existing) {
      run("UPDATE companies SET status = 'blacklisted' WHERE id = ?", [existing.id])
      run("UPDATE applications SET status = 'blacklisted' WHERE company_id = ?", [existing.id])
    }

    run(
      `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [req.admin.email, req.admin.role, 'add', 'blacklist', company, req.ip, `Listed: ${reason}`],
    )

    res.json({ message: 'Supplier added to blacklist' })
  }),
)

router.patch(
  '/blacklist/:id/reinstate',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const entry = get('SELECT * FROM blacklist WHERE id = ?', [id])
    if (!entry) return res.status(404).json({ error: 'Blacklist entry not found' })

    const type = cleanText(req.body.type) || 'full'
    run("UPDATE blacklist SET status = 'reinstated' WHERE id = ?", [id])

    const company = get('SELECT id FROM companies WHERE legal_name = ?', [entry.company])
    if (company && type === 'full') {
      run("UPDATE companies SET status = 'approved' WHERE id = ?", [company.id])
    }

    run(
      `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [req.admin.email, req.admin.role, 'reinstate', 'blacklist', entry.company, req.ip, `Reinstated (${type})`],
    )

    res.json({ message: 'Supplier reinstated' })
  }),
)

export default router
