import { Router } from 'express'
import { get, run, all, tx } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()
router.use(requireAuth)

const REF = (id) => 'TS-' + String(id).padStart(4, '0')

// Notify admins (guarded so ticket creation never fails if the admin
// backend hasn't initialized the admin_notifications table yet).
function notifyAdmin(title, description, priority = 'normal') {
  try {
    const table = get("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'admin_notifications'")
    if (!table) return
    run('INSERT INTO admin_notifications (title, description, type, priority) VALUES (?, ?, ?, ?)', [
      title,
      description,
      'support',
      priority,
    ])
  } catch {
    // ignore — admin notifications are best-effort
  }
}

function adminPriority(priority) {
  return priority === 'high' || priority === 'critical' ? 'high' : 'normal'
}

// GET /api/tickets
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tickets = all('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC, id DESC', [req.user.id]).map((t) => ({
      ...t,
      ref: REF(t.id),
      messageCount: get('SELECT COUNT(*) AS total FROM ticket_messages WHERE ticket_id = ?', [t.id]).total,
      lastMessage: get('SELECT body, is_admin, created_at FROM ticket_messages WHERE ticket_id = ? ORDER BY id DESC LIMIT 1', [t.id]),
    }))
    res.json({ tickets })
  }),
)

// POST /api/tickets
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { subject, category, priority, message } = req.body || {}
    if (!cleanText(subject)) return res.status(400).json({ error: 'Subject is required' })
    if (!cleanText(message)) return res.status(400).json({ error: 'Message is required' })

    const result = tx(() => {
      const created = run(
        `INSERT INTO tickets (user_id, subject, category, priority, status)
         VALUES (?, ?, ?, ?, 'open')`,
        [req.user.id, cleanText(subject), cleanText(category) || 'General', cleanText(priority) || 'medium'],
      )
      run('INSERT INTO ticket_messages (ticket_id, user_id, body, is_admin) VALUES (?, ?, ?, 0)', [
        created.lastInsertRowid,
        req.user.id,
        cleanText(message),
      ])
      return created.lastInsertRowid
    })

    const company = get('SELECT legal_name FROM companies WHERE user_id = ?', [req.user.id])
    notifyAdmin(
      'New support ticket',
      `${company?.legal_name || req.user.full_name || 'A supplier'} opened "${cleanText(subject)}" (${REF(result)})`,
      adminPriority(cleanText(priority)),
    )

    const ticket = get('SELECT * FROM tickets WHERE id = ?', [result])
    res.status(201).json({ message: 'Ticket created', ticket })
  }),
)

// GET /api/tickets/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const ticket = get('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    const messages = all('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY id ASC', [ticket.id])
    res.json({ ticket: { ...ticket, ref: REF(ticket.id) }, messages })
  }),
)

// POST /api/tickets/:id/messages
router.post(
  '/:id/messages',
  asyncHandler(async (req, res) => {
    const ticket = get('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    const { body } = req.body || {}
    if (!cleanText(body)) return res.status(400).json({ error: 'Message is required' })

    run('INSERT INTO ticket_messages (ticket_id, user_id, body, is_admin) VALUES (?, ?, ?, 0)', [ticket.id, req.user.id, cleanText(body)])
    run('UPDATE tickets SET status = CASE WHEN status = \'resolved\' THEN \'open\' ELSE status END, updated_at = datetime(\'now\') WHERE id = ?', [ticket.id])

    notifyAdmin(
      'Supplier replied to ticket',
      `${REF(ticket.id)} — "${ticket.subject}"`,
      adminPriority(ticket.priority),
    )

    const messages = all('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY id ASC', [ticket.id])
    res.status(201).json({ message: 'Reply sent', messages })
  }),
)

// PATCH /api/tickets/:id/status
router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const ticket = get('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    const status = cleanText(req.body?.status)
    if (!['open', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    run("UPDATE tickets SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, ticket.id])
    notifyAdmin(
      'Ticket status updated',
      `${REF(ticket.id)} — "${ticket.subject}" marked ${status}`,
      status === 'closed' ? 'normal' : 'high',
    )
    res.json({ message: 'Ticket updated', status })
  }),
)

export default router
