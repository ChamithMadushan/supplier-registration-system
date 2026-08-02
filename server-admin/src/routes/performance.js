import { Router } from 'express'
import { all, get } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

function bandFor(score) {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  return 'D'
}

router.get(
  '/performance',
  asyncHandler(async (_req, res) => {
    const activeSuppliers = get("SELECT COUNT(*) AS n FROM companies WHERE status IN ('approved','preferred','strategic')")?.n ?? 0
    const avg = get('SELECT AVG(score) AS a FROM performance_reviews')?.a
    const avgScore = avg ? Math.round(avg) : 0
    const reviewsThisQuarter = get("SELECT COUNT(*) AS n FROM performance_reviews WHERE review_date >= date('now', '-90 days')")?.n ?? 0
    const top = get(
      "SELECT legal_name, score FROM companies WHERE score IS NOT NULL AND status IN ('approved','preferred','strategic') ORDER BY score DESC LIMIT 1",
    )

    const latestReviews = all(
      `SELECT pr.*, c.legal_name FROM performance_reviews pr
       LEFT JOIN companies c ON c.id = pr.supplier_id
       WHERE pr.id IN (SELECT MAX(id) FROM performance_reviews GROUP BY supplier_id)`,
    )
    const bandCounts = { A: 0, B: 0, C: 0, D: 0 }
    for (const r of latestReviews) {
      bandCounts[r.band || bandFor(r.score)]++
    }

    const topSuppliers = all(
      `SELECT c.id, c.code, c.legal_name, c.specializations, c.score,
              (SELECT MAX(pr.score) FROM performance_reviews pr WHERE pr.supplier_id = c.id) AS last_score,
              (SELECT MAX(pr.review_date) FROM performance_reviews pr WHERE pr.supplier_id = c.id) AS last_date
       FROM companies c
       WHERE c.score IS NOT NULL AND c.status IN ('approved','preferred','strategic')
       ORDER BY c.score DESC LIMIT 6`,
    )

    const monthlyRows = all(
      "SELECT substr(review_date, 1, 7) AS month, ROUND(AVG(score)) AS avg FROM performance_reviews WHERE review_date IS NOT NULL GROUP BY month ORDER BY month",
    )
    const monthly = {
      labels: monthlyRows.map((r) => monthLabel(r.month)),
      values: monthlyRows.map((r) => Number(r.avg)),
    }

    const criteriaRows = all('SELECT pillar, AVG(score) AS avg FROM evaluation_scores GROUP BY pillar')
    const criteria = criteriaRows.map((r) => ({ name: r.pillar, avg: Math.round(r.avg) }))

    const cycles = all(
      `SELECT cycle, COUNT(*) AS suppliers, ROUND(AVG(score)) AS avg, MAX(review_date) AS date
       FROM performance_reviews GROUP BY cycle ORDER BY review_date DESC`,
    )

    const awaiting = all(
      `SELECT c.id, c.code, c.legal_name, c.score
       FROM companies c
       LEFT JOIN performance_reviews pr ON pr.supplier_id = c.id AND pr.review_date >= date('now', '-90 days')
       WHERE c.status IN ('approved','preferred','strategic') AND pr.id IS NULL
       ORDER BY c.legal_name`,
    )

    const reviews = latestReviews
      .map((r) => ({
        id: r.id,
        supplier: r.legal_name || '—',
        cycle: r.cycle,
        score: r.score,
        band: r.band || bandFor(r.score),
        status: r.note ? 'Reviewed' : 'Pending',
        date: r.review_date,
        evaluator: r.reviewed_by || '—',
      }))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    res.json({
      stats: {
        activeSuppliers,
        avgScore,
        reviewsThisQuarter,
        topSupplier: top?.legal_name || '—',
      },
      bands: Object.entries(bandCounts).map(([band, count]) => ({ band, count })),
      topSuppliers: topSuppliers.map((s) => ({
        id: s.id,
        name: s.legal_name,
        code: s.code || '—',
        cat: s.specializations || '—',
        score: s.score ?? 0,
        lastScore: s.last_score ?? null,
        lastDate: s.last_date ?? null,
      })),
      monthly,
      criteria,
      cycles: cycles.map((c) => ({
        cycle: c.cycle,
        suppliers: c.suppliers,
        avg: c.avg ? Number(c.avg) : 0,
        date: c.date,
      })),
      awaiting: awaiting.map((a) => ({
        id: a.id,
        name: a.legal_name,
        code: a.code || '—',
        score: a.score ?? 0,
      })),
      reviews,
    })
  }),
)

function monthLabel(month) {
  const [y, m] = String(month).split('-').map(Number)
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[m - 1]} ${String(y).slice(2)}`
}

export default router
