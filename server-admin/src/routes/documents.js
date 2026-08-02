import { Router } from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { all, get, run } from '../db.js'
import { config } from '../config.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText, formatDate } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'review', label: 'Review' },
  { key: 'reupload', label: 'Reupload' },
  { key: 'expired', label: 'Expired' },
  { key: 'expiring', label: 'Expiring' },
  { key: 'accepted', label: 'Accepted' },
]

function tabCounts() {
  const total = all('SELECT COUNT(*) AS n FROM documents').reduce((s, r) => s + r.n, 0)
  const pending = all("SELECT COUNT(*) AS n FROM documents WHERE status = 'pending'").reduce((s, r) => s + r.n, 0)
  const review = all("SELECT COUNT(*) AS n FROM documents WHERE status = 'review'").reduce((s, r) => s + r.n, 0)
  const reupload = all("SELECT COUNT(*) AS n FROM documents WHERE status = 'reupload'").reduce((s, r) => s + r.n, 0)
  const expired =
    all("SELECT COUNT(*) AS n FROM documents WHERE status = 'expired' OR (expires_on IS NOT NULL AND expires_on < date('now'))").reduce(
      (s, r) => s + r.n,
      0,
    )
  const expiring =
    all("SELECT COUNT(*) AS n FROM documents WHERE expires_on IS NOT NULL AND expires_on BETWEEN date('now') AND date('now', '+30 days')").reduce(
      (s, r) => s + r.n,
      0,
    )
  const accepted = all("SELECT COUNT(*) AS n FROM documents WHERE status IN ('accepted','verified')").reduce((s, r) => s + r.n, 0)

  return TABS.map((t) => ({
    ...t,
    count: t.key === 'all' ? total : t.key === 'pending' ? pending : t.key === 'review' ? review : t.key === 'reupload' ? reupload : t.key === 'expired' ? expired : t.key === 'expiring' ? expiring : accepted,
  }))
}

function filterSql(filter, search) {
  const clauses = []
  const params = []
  switch (filter) {
    case 'pending':
      clauses.push("d.status = 'pending'")
      break
    case 'review':
      clauses.push("d.status = 'review'")
      break
    case 'reupload':
      clauses.push("d.status = 'reupload'")
      break
    case 'expired':
      clauses.push("(d.status = 'expired' OR (d.expires_on IS NOT NULL AND d.expires_on < date('now')))")
      break
    case 'expiring':
      clauses.push("d.expires_on IS NOT NULL AND d.expires_on BETWEEN date('now') AND date('now', '+30 days')")
      break
    case 'accepted':
      clauses.push("d.status IN ('accepted','verified')")
      break
    default:
      break
  }
  if (search) {
    clauses.push('(d.label LIKE ? OR c.legal_name LIKE ? OR c.code LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }
  return { where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params }
}

router.get(
  '/documents',
  asyncHandler(async (req, res) => {
    const filter = cleanText(req.query.status) || 'all'
    const search = cleanText(req.query.q) || ''
    const { where, params } = filterSql(filter, search)

    const rows = all(
      `SELECT d.id, d.label, d.category, d.status, d.size, d.uploaded_at, d.expires_on, d.original_name,
              c.legal_name, c.code
       FROM documents d
       LEFT JOIN users u ON u.id = d.user_id
       LEFT JOIN companies c ON c.user_id = u.id
       ${where}
       ORDER BY d.uploaded_at DESC`,
      params,
    )

    const data = rows.map((r) => ({
      id: r.id,
      name: r.label,
      type: r.category,
      supplier: r.legal_name || '—',
      code: r.code || '—',
      uploaded: formatDate(r.uploaded_at),
      exp: formatDate(r.expires_on),
      status: r.status === 'verified' ? 'accepted' : r.status || 'pending',
      size: formatSize(r.size),
      fileName: r.original_name || '',
    }))

    res.json({ tabs: tabCounts(), data })
  }),
)

const ALLOWED = ['pending', 'review', 'accepted', 'rejected', 'reupload', 'expired']

router.patch(
  '/documents/:id/status',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const status = cleanText(req.body.status)
    const note = cleanText(req.body.note || '')
    const doc = get('SELECT * FROM documents WHERE id = ?', [id])
    if (!doc) return res.status(404).json({ error: 'Document not found' })
    if (!ALLOWED.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    if (status === 'accepted') {
      run("UPDATE documents SET status = 'accepted', verified_by = ?, verified_at = datetime('now') WHERE id = ?", [
        req.admin.full_name,
        id,
      ])
    } else {
      run('UPDATE documents SET status = ?, review_note = ? WHERE id = ?', [status, note || null, id])
    }

    run(
      `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [req.admin.email, req.admin.role, 'document', 'document', doc.label, req.ip, `Document ${status}${note ? ' · ' + note : ''}`],
    )

    if (status === 'rejected' || status === 'reupload') {
      run('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)', [
        doc.user_id,
        'Document requires action',
        `"${doc.label}" needs to be re-uploaded. ${note ? 'Reason: ' + note : ''}`,
        'document',
      ])
    }

    res.json({ message: 'Document status updated', status })
  }),
)

router.get(
  '/documents/:id/download',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const doc = get('SELECT * FROM documents WHERE id = ?', [id])
    if (!doc) return res.status(404).json({ error: 'Document not found' })

    const filePath = path.join(config.uploadDir, doc.file_name)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not available on disk' })
    }
    res.download(filePath, doc.original_name || doc.label)
  }),
)

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default router
