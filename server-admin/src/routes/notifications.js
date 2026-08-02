import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

router.get(
  '/notifications',
  asyncHandler(async (_req, res) => {
    const rows = all('SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 30')
    const unread = get('SELECT COUNT(*) AS n FROM admin_notifications WHERE is_read = 0')?.n ?? 0
    res.json({
      unread,
      data: rows.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description || '',
        type: n.type || 'system',
        priority: n.priority || 'normal',
        isRead: n.is_read === 1,
        time: n.created_at,
      })),
    })
  }),
)

router.patch(
  '/notifications/:id/read',
  asyncHandler(async (req, res) => {
    run('UPDATE admin_notifications SET is_read = 1 WHERE id = ?', [Number(req.params.id)])
    res.json({ message: 'Notification marked as read' })
  }),
)

router.patch(
  '/notifications/read-all',
  asyncHandler(async (_req, res) => {
    run('UPDATE admin_notifications SET is_read = 1')
    res.json({ message: 'All notifications marked as read' })
  }),
)

export default router
