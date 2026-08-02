import { Router } from 'express'
import { all, get } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'
import { formatDate } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const PIPELINE = ['new', 'screening', 'verification', 'evaluation', 'ready']
const OUTCOMES = ['approved', 'conditional', 'probationary', 'suspended', 'blacklisted', 'rejected']

function monthKey(offset) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function priorityFor(app) {
  const days = app.days || 0
  if (days > 10) return 'high'
  if (days > 5) return 'medium'
  return 'low'
}

router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const registered = get('SELECT COUNT(*) AS n FROM users')?.n ?? 0
    const approved = get('SELECT COUNT(*) AS n FROM applications WHERE status = ?', ['approved'])?.n ?? 0
    const pending =
      all('SELECT COUNT(*) AS n FROM applications WHERE status IN (' + PIPELINE.map(() => '?').join(',') + ')', PIPELINE)
        .reduce((s, r) => s + (r.n || 0), 0)
    const monthStart = monthKey(0) + '-01'
    const newThisMonth =
      get('SELECT COUNT(*) AS n FROM applications WHERE created_at >= ?', [monthStart])?.n ?? 0
    const rejectedThisMonth =
      get('SELECT COUNT(*) AS n FROM applications WHERE status = ? AND created_at >= ?', ['rejected', monthStart])?.n ?? 0
    const actionRequired =
      all("SELECT COUNT(*) AS n FROM documents WHERE status IN ('rejected','expired','review')").reduce((s, r) => s + (r.n || 0), 0) +
      all("SELECT COUNT(*) AS n FROM tickets WHERE status IN ('open','pending')").reduce((s, r) => s + (r.n || 0), 0)
    const expiring30 =
      all(
        'SELECT COUNT(*) AS n FROM documents WHERE expires_on IS NOT NULL AND expires_on BETWEEN date(\'now\') AND date(\'now\', \'+30 days\')',
      ).reduce((s, r) => s + (r.n || 0), 0)
    const avgPerformance = get('SELECT AVG(score) AS a FROM performance_reviews')?.a
    const avgScore = avgPerformance ? (avgPerformance / 20).toFixed(1) : '0.0'

    res.json({
      stats: {
        registered,
        approved,
        pending,
        newThisMonth,
        rejectedThisMonth,
        actionRequired,
        expiring30,
        avgPerformance: avgScore,
        avgScore: Number(avgScore),
      },
    })
  }),
)

router.get(
  '/registration-trend',
  asyncHandler(async (_req, res) => {
    const rows = all(
      `SELECT substr(created_at, 1, 7) AS month, COUNT(*) AS count
       FROM applications GROUP BY month`,
    )
    const byMonth = Object.fromEntries(rows.map((r) => [r.month, r.count]))
    const data = []
    for (let i = 11; i >= 0; i--) {
      const key = monthKey(i)
      data.push({ month: key, count: byMonth[key] || 0 })
    }
    res.json({ data })
  }),
)

router.get(
  '/category-distribution',
  asyncHandler(async (_req, res) => {
    const rows = all('SELECT name, suppliers FROM categories WHERE active = 1 ORDER BY suppliers DESC')
    res.json({ data: rows })
  }),
)

router.get(
  '/pending-applications',
  asyncHandler(async (_req, res) => {
    const rows = all(
      `SELECT a.id, a.reference_no AS ref, c.legal_name AS company, c.contact_person AS contact,
              c.specializations AS cat, c.reg_district AS district,
              date(a.created_at) AS submitted,
              CAST(julianday('now') - julianday(a.created_at) AS INTEGER) AS days,
              a.status, a.assignee, a.priority
       FROM applications a
       JOIN companies c ON c.id = a.company_id
       WHERE a.status IN (${PIPELINE.map(() => '?').join(',')})
       ORDER BY a.created_at ASC
       LIMIT 6`,
      PIPELINE,
    )
    const data = rows.map((r) => ({
      id: r.id,
      ref: r.ref,
      company: r.company,
      contact: r.contact,
      cat: r.cat || 'Uncategorised',
      district: r.district || '—',
      submitted: formatDate(r.submitted),
      days: r.days ?? 0,
      prio: r.priority || priorityFor(r),
      status: r.status,
      assignee: r.assignee || 'Unassigned',
    }))
    res.json({ data })
  }),
)

router.get(
  '/activity',
  asyncHandler(async (_req, res) => {
    const rows = all(
      `SELECT a.*, c.legal_name AS company FROM audit_logs a
       LEFT JOIN applications app ON app.reference_no = a.entity
       LEFT JOIN companies c ON c.id = app.company_id
       WHERE a.module IN ('application','document','supplier','ticket','blacklist','settings','performance')
       ORDER BY a.created_at DESC LIMIT 12`,
    )
    const data = rows.map((r) => ({
      type: r.action,
      text: r.detail || r.action,
      company: r.company || r.entity,
      time: r.created_at,
      user: r.user,
    }))
    res.json({ data })
  }),
)

router.get(
  '/expiry-summary',
  asyncHandler(async (_req, res) => {
    const expired = get('SELECT COUNT(*) AS n FROM documents WHERE expires_on IS NOT NULL AND expires_on < date(\'now\')')?.n ?? 0
    const expiring =
      all(
        'SELECT COUNT(*) AS n FROM documents WHERE expires_on IS NOT NULL AND expires_on BETWEEN date(\'now\') AND date(\'now\', \'+30 days\')',
      ).reduce((s, r) => s + (r.n || 0), 0)
    res.json({ expired, expiring })
  }),
)

router.get(
  '/tasks',
  asyncHandler(async (_req, res) => {
    const pipeline = all('SELECT status, COUNT(*) AS n FROM applications WHERE status IN (' + PIPELINE.map(() => '?').join(',') + ') GROUP BY status', PIPELINE)
    const byStatus = Object.fromEntries(pipeline.map((r) => [r.status, r.n]))
    const tasks = []
    if (byStatus.new) tasks.push({ title: `Review ${byStatus.new} new application${byStatus.new > 1 ? 's' : ''}`, due: 'Today', type: 'review' })
    if (byStatus.screening) tasks.push({ title: `Screen ${byStatus.screening} application${byStatus.screening > 1 ? 's' : ''}`, due: 'This week', type: 'screening' })
    if (byStatus.verification) tasks.push({ title: `Verify documents for ${byStatus.verification} applicant${byStatus.verification > 1 ? 's' : ''}`, due: 'This week', type: 'verification' })
    if (byStatus.evaluation) tasks.push({ title: `Evaluate ${byStatus.evaluation} application${byStatus.evaluation > 1 ? 's' : ''}`, due: 'Next week', type: 'evaluation' })
    const openTickets = get('SELECT COUNT(*) AS n FROM tickets WHERE status IN (\'open\',\'pending\')')?.n ?? 0
    if (openTickets) tasks.push({ title: `${openTickets} support ticket${openTickets > 1 ? 's' : ''} awaiting response`, due: 'Today', type: 'ticket' })
    const expiring = get('SELECT COUNT(*) AS n FROM documents WHERE expires_on IS NOT NULL AND expires_on BETWEEN date(\'now\') AND date(\'now\', \'+14 days\')')?.n ?? 0
    if (expiring) tasks.push({ title: `${expiring} document${expiring > 1 ? 's' : ''} expiring within 14 days`, due: 'Urgent', type: 'document' })
    res.json({ tasks })
  }),
)

export default router
