import { Router } from 'express'
import { all, get } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText, formatDate } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const STATUSES = ['all', 'strategic', 'preferred', 'approved', 'conditional', 'probationary', 'suspended']

function countByStatus() {
  const rows = all(
    "SELECT c.status, COUNT(*) AS n FROM companies c JOIN applications a ON a.company_id = c.id WHERE a.status = 'approved' GROUP BY c.status",
  )
  const by = Object.fromEntries(rows.map((r) => [r.status || 'approved', r.n]))
  return STATUSES.map((key) => ({ key, count: key === 'all' ? 0 : by[key] || 0 }))
}

router.get(
  '/suppliers',
  asyncHandler(async (req, res) => {
    const filter = cleanText(req.query.status) || 'all'
    const search = cleanText(req.query.q) || ''
    const params = []
    const clauses = ["a.status = 'approved'"]
    if (filter && filter !== 'all') {
      clauses.push('c.status = ?')
      params.push(filter)
    }
    if (search) {
      clauses.push('(c.legal_name LIKE ? OR c.code LIKE ? OR c.contact_person LIKE ?)')
      const like = `%${search}%`
      params.push(like, like, like)
    }

    const rows = all(
      `SELECT c.id, c.code, c.legal_name, c.contact_person, c.specializations, c.reg_district,
              c.email, c.score, c.status AS company_status,
              (SELECT COUNT(*) FROM documents d WHERE d.user_id = c.user_id) AS docs,
              (SELECT COUNT(*) FROM documents d WHERE d.user_id = c.user_id AND d.status IN ('accepted','verified')) AS docs_ok,
              (SELECT MAX(review_date) FROM performance_reviews pr WHERE pr.supplier_id = c.id) AS renewed
       FROM companies c
       JOIN applications a ON a.company_id = c.id
       WHERE ${clauses.join(' AND ')}
       ORDER BY c.legal_name`,
      params,
    )

    const data = rows.map((r) => ({
      id: r.id,
      code: r.code || 'SRS-APR-' + String(r.id).padStart(3, '0'),
      company: r.legal_name || '—',
      contact: r.contact_person || '—',
      cat: r.specializations || 'Uncategorised',
      district: r.reg_district || '—',
      score: r.score ?? 0,
      status: r.company_status || 'approved',
      docs: `${r.docs_ok ?? 0}/${r.docs ?? 0}`,
      renewed: formatDate(r.renewed),
      email: r.email || '—',
    }))

    res.json({ statusTabs: countByStatus(), data })
  }),
)

router.get(
  '/suppliers/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const company = get(
      `SELECT c.*, u.full_name, u.mobile, u.email AS user_email, u.language,
              a.reference_no, a.created_at AS applied_at, a.status AS application_status
       FROM companies c
       LEFT JOIN users u ON u.id = c.user_id
       LEFT JOIN applications a ON a.company_id = c.id
       WHERE c.id = ?`,
      [id],
    )
    if (!company) return res.status(404).json({ error: 'Supplier not found' })

    const documents = all(
      `SELECT * FROM documents WHERE user_id = ? ORDER BY category, label`,
      [company.user_id],
    )
    const certifications = all('SELECT * FROM company_certifications WHERE user_id = ?', [company.user_id])
    const orders = all('SELECT * FROM orders WHERE supplier_id = ? ORDER BY order_date DESC', [id])
    const reviews = all('SELECT * FROM performance_reviews WHERE supplier_id = ? ORDER BY review_date', [id])
    const scores = all(
      'SELECT es.* FROM evaluation_scores es JOIN applications a ON a.id = es.application_id WHERE a.company_id = ?',
      [id],
    )
    const activity = all(
      "SELECT * FROM audit_logs WHERE (module = 'supplier' AND entity = ?) OR (module = 'blacklist' AND entity = ?) ORDER BY created_at DESC LIMIT 6",
      [company.code || company.legal_name, company.code || company.legal_name],
    )
    const comms = all(
      "SELECT * FROM mail_messages WHERE sender_email = ? ORDER BY created_at DESC LIMIT 6",
      [company.email || ''],
    )

    const docsList = documents.map((d) => ({
      id: d.id,
      name: d.label,
      type: d.category,
      exp: formatDate(d.expires_on),
      status: d.status === 'verified' ? 'accepted' : d.status || 'pending',
    }))

    const certList = certifications.map((c) => ({
      name: c.name || '—',
      issuer: c.issuer || '—',
      number: c.cert_number || '—',
      expiry: formatDate(c.expiry_date),
    }))

    const docOk = docsList.filter((d) => d.status === 'accepted').length
    const registrationValid = certifications.every((c) => !c.expiry_date || new Date(c.expiry_date) >= new Date())

    const perfData = {
      labels: reviews.map((r) => shortCycle(r.cycle)),
      values: reviews.map((r) => Math.round(r.score / 20)),
    }

    const criteriaDefaults = [
      { name: 'Registration', weight: 20 },
      { name: 'Financial', weight: 25 },
      { name: 'Technical', weight: 20 },
      { name: 'Experience', weight: 15 },
      { name: 'Compliance', weight: 20 },
    ]
    const byPillar = Object.fromEntries(scores.map((s) => [s.pillar, s]))
    const criteria = criteriaDefaults.map((c) => {
      const row = byPillar[c.name]
      return {
        name: c.name,
        weight: c.weight,
        score: row ? row.score : 0,
        max: row?.max ?? 100,
        weighted: Math.round((row?.score ?? 0) * (c.weight / 100)),
      }
    })

    const ytdSpend = orders.reduce((sum, o) => sum + parseAmount(o.value), 0)

    res.json({
      supplier: {
        id: company.id,
        code: company.code || 'SRS-APR-' + String(company.id).padStart(3, '0'),
        name: company.legal_name,
        tradingName: company.trading_name,
        contact: company.contact_person,
        designation: company.contact_designation,
        email: company.email || company.user_email,
        phone: company.phone,
        mobile: company.mobile,
        website: company.website,
        cat: company.specializations,
        district: company.reg_district,
        address: [company.reg_address_1, company.reg_address_2, company.reg_city, company.reg_province, company.reg_postal_code]
          .filter(Boolean)
          .join(', '),
        status: company.status || 'approved',
        score: company.score ?? 0,
        brn: company.brn,
        businessType: company.business_type,
        incorporation: formatDate(company.incorporation_date),
        employees: company.employee_count,
        about: company.about,
        applied: formatDate(company.applied_at),
        ref: company.reference_no,
        contactUser: { name: company.full_name, mobile: company.mobile, language: company.language },
      },
      hero: {
        score: company.score ?? 0,
        ytdSpend: 'LKR ' + ytdSpend.toLocaleString('en-US'),
        onTime: '94%',
        quality: '98%',
        docs: `${docOk}/${docsList.length}`,
        registrationValid,
      },
      documents: docsList,
      certifications: certList,
      orders: orders.map((o) => ({
        id: o.id,
        po: o.po || '—',
        item: o.item || '—',
        date: formatDate(o.order_date),
        value: o.value || '—',
        status: o.status || '—',
      })),
      reviews: reviews.map((r) => ({
        cycle: r.cycle,
        date: formatDate(r.review_date),
        score: r.score,
        band: r.band || bandFor(r.score),
        note: r.note || '',
      })),
      perfData,
      criteria,
      comms: comms.map((m) => ({
        subject: m.subject,
        preview: m.preview || '',
        tag: m.tag || '',
        time: formatDate(m.created_at),
        unread: m.unread === 1,
      })),
      activity: activity.map((a) => ({
        type: a.action,
        text: a.detail || a.action,
        time: a.created_at,
        user: a.user,
      })),
    })
  }),
)

function shortCycle(cycle) {
  const parts = String(cycle || '').split(' ')
  return parts.length > 1 ? parts[1] : cycle
}

function parseAmount(value) {
  if (!value) return 0
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function bandFor(score) {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  return 'D'
}

export default router
