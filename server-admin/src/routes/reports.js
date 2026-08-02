import { Router } from 'express'
import { all, get } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const REPORT_TYPES = [
  { name: 'Supplier Registration Report', desc: 'All registrations, statuses and completion rates', type: 'Registration' },
  { name: 'Approved Supplier Report', desc: 'Approved suppliers by category and region', type: 'Supplier' },
  { name: 'Financial Performance Report', desc: 'Financial data and stability assessment', type: 'Financial' },
  { name: 'Document Compliance Report', desc: 'Document status, expiry and compliance gaps', type: 'Compliance' },
  { name: 'Spend Analysis Report', desc: 'Purchase orders and spend by supplier', type: 'Spend' },
  { name: 'Risk & Blacklist Report', desc: 'Risk ratings, blacklist and sanctions', type: 'Risk' },
  { name: 'Performance Report', desc: 'Supplier performance scores and bands', type: 'Performance' },
  { name: 'Custom Report', desc: 'Build your own report with custom filters', type: 'Custom' },
]

function monthKey(offset) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

router.get(
  '/reports',
  asyncHandler(async (_req, res) => {
    const scheduled = all('SELECT * FROM report_definitions ORDER BY name')
    const recent = all('SELECT * FROM generated_reports ORDER BY generated_at DESC LIMIT 8')

    const regRows = all(
      "SELECT substr(created_at, 1, 7) AS month, COUNT(*) AS count FROM applications GROUP BY month",
    )
    const byMonth = Object.fromEntries(regRows.map((r) => [r.month, r.count]))
    const regTrend = []
    for (let i = 11; i >= 0; i--) {
      const key = monthKey(i)
      regTrend.push({ month: key, count: byMonth[key] || 0 })
    }

    const categories = all('SELECT name, suppliers, products FROM categories WHERE active = 1')

    const orderRows = all('SELECT order_date, value FROM orders')
    const spendByMonth = {}
    for (const o of orderRows) {
      if (!o.order_date) continue
      const month = String(o.order_date).slice(0, 7)
      spendByMonth[month] = (spendByMonth[month] || 0) + parseAmount(o.value)
    }
    const monthlySpend = []
    for (let i = 5; i >= 0; i--) {
      const key = monthKey(i)
      monthlySpend.push({ month: key, value: Math.round(spendByMonth[key] || 0) })
    }

    const districts = all(
      `SELECT reg_district, COUNT(*) AS count FROM companies WHERE reg_district IS NOT NULL GROUP BY reg_district ORDER BY count DESC LIMIT 8`,
    )

    const totalSpend = orderRows.reduce((s, o) => s + parseAmount(o.value), 0)

    res.json({
      reportTypes: REPORT_TYPES,
      scheduled: scheduled.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        schedule: r.schedule || '—',
        lastRun: r.last_run || '—',
        nextRun: r.next_run || '—',
        recipients: r.recipients || 0,
        active: r.active === 1,
      })),
      recent: recent.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        generatedBy: r.generated_by || '—',
        generatedAt: r.generated_at,
        size: r.size || '—',
      })),
      regTrend,
      categories,
      monthlySpend,
      districts: districts.map((d) => ({ district: d.reg_district, count: d.count })),
      stats: {
        totalApplications: get('SELECT COUNT(*) AS n FROM applications')?.n ?? 0,
        approved: get("SELECT COUNT(*) AS n FROM applications WHERE status = 'approved'")?.n ?? 0,
        activeSuppliers: get("SELECT COUNT(*) AS n FROM companies WHERE status IN ('approved','preferred','strategic')")?.n ?? 0,
        totalSpend: Math.round(totalSpend),
      },
    })
  }),
)

function parseAmount(value) {
  if (!value) return 0
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export default router
