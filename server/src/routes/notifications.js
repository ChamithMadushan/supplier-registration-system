import { Router } from 'express'
import { get, run, all } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()
router.use(requireAuth)

// GET /api/notifications
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const unreadOnly = req.query.unread === 'true'
    const rows = all(
      `SELECT * FROM notifications WHERE user_id = ?${unreadOnly ? ' AND is_read = 0' : ''} ORDER BY created_at DESC, id DESC LIMIT 100`,
      [req.user.id],
    )
    const unread = get('SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0', [req.user.id]).total
    res.json({ notifications: rows, unread })
  }),
)

// PATCH /api/notifications/:id/read
router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const n = get('SELECT id FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!n) return res.status(404).json({ error: 'Notification not found' })
    run('UPDATE notifications SET is_read = 1 WHERE id = ?', [n.id])
    res.json({ message: 'Notification marked as read' })
  }),
)

// PATCH /api/notifications/read-all
router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    run('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [req.user.id])
    res.json({ message: 'All notifications marked as read' })
  }),
)

export default router
