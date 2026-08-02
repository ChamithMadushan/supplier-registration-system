import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const TABS = ['all', 'open', 'pending', 'replied', 'closed']

function countTabs() {
  return TABS.map((key) => ({
    key,
    count: key === 'all'
      ? all('SELECT COUNT(*) AS n FROM tickets').reduce((s, r) => s + r.n, 0)
      : all('SELECT COUNT(*) AS n FROM tickets WHERE status = ?', [key]).reduce((s, r) => s + r.n, 0),
  }))
}

function slaFor(ticket) {
  const days = Math.max(0, Math.round((Date.now() - Date.parse(ticket.updated_at + 'Z')) / 86400000))
  if (ticket.status === 'closed') return 'Resolved'
  if (ticket.priority === 'high' && days >= 1) return 'Overdue'
  if (days >= 3) return 'Overdue'
  if (days >= 1) return 'Due soon'
  return 'On track'
}

router.get(
  '/tickets',
  asyncHandler(async (req, res) => {
    const filter = cleanText(req.query.status) || 'all'
    const search = cleanText(req.query.q) || ''
    const params = []
    const clauses = []
    if (filter && filter !== 'all') {
      clauses.push('t.status = ?')
      params.push(filter)
    }
    if (search) {
      clauses.push('(t.subject LIKE ? OR c.legal_name LIKE ?)')
      const like = `%${search}%`
      params.push(like, like)
    }

    const rows = all(
      `SELECT t.id, t.subject, t.category, t.priority, t.status, t.assignee, t.created_at, t.updated_at,
              c.legal_name, c.contact_person,
              (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = t.id) AS replies,
              (SELECT tm.created_at FROM ticket_messages tm WHERE tm.ticket_id = t.id ORDER BY tm.created_at DESC LIMIT 1) AS last_reply
       FROM tickets t
       LEFT JOIN companies c ON c.user_id = t.user_id
       ${clauses.length ? 'WHERE ' + clauses.join(' AND ') : ''}
       ORDER BY t.updated_at DESC`,
      params,
    )

    const data = rows.map((r) => ({
      id: r.id,
      ref: 'TS-' + String(r.id).padStart(4, '0'),
      subject: r.subject,
      supplier: r.legal_name || '—',
      contact: r.contact_person || '—',
      category: r.category || 'General',
      priority: r.priority || 'medium',
      status: r.status,
      assignee: r.assignee || 'Unassigned',
      created: r.created_at,
      updated: r.updated_at,
      replies: r.replies ?? 0,
      sla: slaFor(r),
    }))

    res.json({ tabs: countTabs(), data })
  }),
)

router.get(
  '/tickets/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const ticket = get(
      `SELECT t.*, c.legal_name, c.contact_person, c.email, u.full_name, u.mobile
       FROM tickets t
       LEFT JOIN companies c ON c.user_id = t.user_id
       LEFT JOIN users u ON u.id = t.user_id
       WHERE t.id = ?`,
      [id],
    )
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })

    const messages = all(
      `SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC`,
      [id],
    )

    res.json({
      ticket: {
        id: ticket.id,
        ref: 'TS-' + String(ticket.id).padStart(4, '0'),
        subject: ticket.subject,
        category: ticket.category || 'General',
        priority: ticket.priority || 'medium',
        status: ticket.status,
        assignee: ticket.assignee || 'Unassigned',
        created: ticket.created_at,
        updated: ticket.updated_at,
        sla: slaFor(ticket),
        supplier: {
          name: ticket.legal_name || '—',
          contact: ticket.contact_person || '—',
          email: ticket.email || '—',
          phone: ticket.mobile || '—',
          contactName: ticket.full_name || '—',
        },
      },
      messages: messages.map((m) => ({
        id: m.id,
        body: m.body,
        admin: m.is_admin === 1,
        author: m.is_admin === 1 ? 'Support Team' : ticket.full_name || 'Supplier',
        time: m.created_at,
      })),
    })
  }),
)

router.post(
  '/tickets/:id/reply',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const body = cleanText(req.body.body)
    const ticket = get('SELECT * FROM tickets WHERE id = ?', [id])
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    if (!body) return res.status(400).json({ error: 'Message body is required' })

    run("INSERT INTO ticket_messages (ticket_id, body, is_admin) VALUES (?, ?, 1)", [id, body])
    run("UPDATE tickets SET status = 'replied', updated_at = datetime('now') WHERE id = ?", [id])

    run(
      `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [req.admin.email, req.admin.role, 'reply', 'ticket', 'TS-' + String(id).padStart(4, '0'), req.ip, 'Replied to ticket'],
    )

    res.json({ message: 'Reply sent' })
  }),
)

export default router
