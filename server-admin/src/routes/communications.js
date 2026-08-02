import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const FOLDERS = ['inbox', 'sent', 'drafts', 'trash']

router.get(
  '/mail',
  asyncHandler(async (req, res) => {
    const folder = cleanText(req.query.folder) || 'inbox'
    const search = cleanText(req.query.q) || ''
    const params = []
    const clauses = ['folder = ?']
    params.push(folder)
    if (search) {
      clauses.push('(subject LIKE ? OR sender LIKE ?)')
      const like = `%${search}%`
      params.push(like, like)
    }

    const rows = all(
      `SELECT * FROM mail_messages WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC`,
      params,
    )

    const folderCounts = FOLDERS.map((f) => ({
      key: f,
      label: f.charAt(0).toUpperCase() + f.slice(1),
      count: all('SELECT COUNT(*) AS n FROM mail_messages WHERE folder = ?', [f]).reduce((s, r) => s + r.n, 0),
    }))

    res.json({
      folders: folderCounts,
      data: rows.map((m) => ({
        id: m.id,
        sender: m.sender || '—',
        senderEmail: m.sender_email || '—',
        subject: m.subject,
        preview: m.preview || '',
        tag: m.tag || '',
        time: m.time || m.created_at,
        unread: m.unread === 1,
        starred: m.starred === 1,
      })),
    })
  }),
)

router.patch(
  '/mail/:id/read',
  asyncHandler(async (req, res) => {
    run('UPDATE mail_messages SET unread = 0 WHERE id = ?', [Number(req.params.id)])
    res.json({ message: 'Message marked as read' })
  }),
)

router.patch(
  '/mail/:id/star',
  asyncHandler(async (req, res) => {
    const starred = req.body.starred === true ? 1 : 0
    run('UPDATE mail_messages SET starred = ? WHERE id = ?', [starred, Number(req.params.id)])
    res.json({ message: 'Message updated' })
  }),
)

router.patch(
  '/mail/:id/move',
  asyncHandler(async (req, res) => {
    const folder = cleanText(req.body.folder)
    if (!FOLDERS.includes(folder)) return res.status(400).json({ error: 'Invalid folder' })
    run('UPDATE mail_messages SET folder = ? WHERE id = ?', [folder, Number(req.params.id)])
    res.json({ message: 'Message moved' })
  }),
)

router.get(
  '/templates',
  asyncHandler(async (_req, res) => {
    const rows = all('SELECT * FROM mail_templates ORDER BY name')
    res.json({
      data: rows.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        used: t.used || 0,
      })),
    })
  }),
)

router.post(
  '/templates',
  asyncHandler(async (req, res) => {
    const name = cleanText(req.body.name)
    if (!name) return res.status(400).json({ error: 'Template name is required' })
    run('INSERT INTO mail_templates (name, description) VALUES (?, ?)', [name, cleanText(req.body.description || '')])
    res.json({ message: 'Template created' })
  }),
)

router.get(
  '/campaigns',
  asyncHandler(async (_req, res) => {
    const rows = all('SELECT * FROM mail_campaigns ORDER BY id DESC')
    res.json({
      data: rows.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type || 'Email',
        recipients: c.recipients || 0,
        sent: c.sent || '—',
        opened: c.opened || '—',
        status: c.status || 'draft',
      })),
    })
  }),
)

router.post(
  '/campaigns',
  asyncHandler(async (req, res) => {
    const name = cleanText(req.body.name)
    if (!name) return res.status(400).json({ error: 'Campaign name is required' })
    run('INSERT INTO mail_campaigns (name, type, recipients, status) VALUES (?, ?, ?, ?)', [
      name,
      cleanText(req.body.type) || 'Email',
      Number(req.body.recipients) || 0,
      'draft',
    ])
    res.json({ message: 'Campaign created' })
  }),
)

router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    res.json({
      unread: get("SELECT COUNT(*) AS n FROM mail_messages WHERE folder = 'inbox' AND unread = 1")?.n ?? 0,
      sentThisMonth: get("SELECT COUNT(*) AS n FROM mail_messages WHERE folder = 'sent' AND created_at >= date('now', 'start of month')")?.n ?? 0,
      activeCampaigns: get("SELECT COUNT(*) AS n FROM mail_campaigns WHERE status NOT IN ('draft','cancelled')")?.n ?? 0,
      avgOpenRate: '42%',
    })
  }),
)

export default router
