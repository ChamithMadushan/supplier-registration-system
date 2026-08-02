import { Router } from 'express'
import { all } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()
router.use(requireAuth)

// GET /api/search?q=  — search across the user's applications, documents, notifications and tickets
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q || '').trim()
    if (!q) {
      return res.json({ q, results: { applications: [], documents: [], notifications: [], tickets: [] } })
    }
    const like = `%${q}%`
    const userId = req.user.id

    const applications = all(
      `SELECT a.id, a.reference_no, a.status, a.created_at, c.legal_name AS company_name
       FROM applications a
       LEFT JOIN companies c ON c.id = a.company_id
       WHERE a.user_id = ? AND (a.reference_no LIKE ? OR c.legal_name LIKE ? OR c.trading_name LIKE ? OR c.brn LIKE ?)
       ORDER BY a.created_at DESC
       LIMIT 5`,
      [userId, like, like, like, like],
    )

    const documents = all(
      `SELECT id, label, original_name, status
       FROM documents
       WHERE user_id = ? AND (label LIKE ? OR original_name LIKE ?)
       ORDER BY uploaded_at DESC
       LIMIT 5`,
      [userId, like, like],
    )

    const notifications = all(
      `SELECT id, title, message, is_read, created_at
       FROM notifications
       WHERE user_id = ? AND (title LIKE ? OR message LIKE ?)
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId, like, like],
    )

    const tickets = all(
      `SELECT id, subject, status, category
       FROM tickets
       WHERE user_id = ? AND (subject LIKE ? OR category LIKE ?)
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId, like, like],
    )

    res.json({
      q,
      results: { applications, documents, notifications, tickets },
    })
  }),
)

export default router
