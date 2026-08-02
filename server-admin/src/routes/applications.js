import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText, formatDate } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

const STATUSES = [
  'all',
  'new',
  'screening',
  'verification',
  'evaluation',
  'ready',
  'approved',
  'conditional',
  'probationary',
  'suspended',
  'blacklisted',
  'rejected',
]

const STATUS_LABELS = {
  all: 'All',
  new: 'New',
  screening: 'Screening',
  verification: 'Verification',
  evaluation: 'Evaluation',
  ready: 'Ready',
  approved: 'Approved',
  conditional: 'Conditional',
  probationary: 'Probationary',
  suspended: 'Suspended',
  blacklisted: 'Blacklisted',
  rejected: 'Rejected',
}

function auditLog(user, role, action, module, entity, detail, ip) {
  run(
    `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [user, role, action, module, entity, ip, detail],
  )
}

function countByStatus() {
  const rows = all('SELECT status, COUNT(*) AS n FROM applications GROUP BY status')
  const by = Object.fromEntries(rows.map((r) => [r.status, r.n]))
  return STATUSES.map((key) => ({ key, label: STATUS_LABELS[key], count: key === 'all' ? 0 : by[key] || 0 }))
}

function statusSql(filter, search) {
  const clauses = []
  const params = []
  if (filter && filter !== 'all') {
    clauses.push('a.status = ?')
    params.push(filter)
  }
  if (search) {
    clauses.push('(c.legal_name LIKE ? OR a.reference_no LIKE ? OR c.contact_person LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }
  return { where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params }
}

router.get(
  '/applications',
  asyncHandler(async (req, res) => {
    const filter = cleanText(req.query.status) || 'all'
    const search = cleanText(req.query.q) || ''
    const { where, params } = statusSql(filter, search)

    const rows = all(
      `SELECT a.id, a.reference_no, c.legal_name, c.contact_person, c.specializations,
              c.reg_district, a.status, a.assignee, a.priority, date(a.created_at) AS submitted_at,
              CAST(julianday('now') - julianday(a.created_at) AS INTEGER) AS days,
              (SELECT COUNT(*) FROM documents d WHERE d.application_id = a.id) AS docs,
              (SELECT COUNT(*) FROM documents d WHERE d.application_id = a.id AND d.status = 'accepted') AS docs_ok
       FROM applications a
       LEFT JOIN companies c ON c.id = a.company_id
       ${where}
       ORDER BY a.created_at DESC`,
      params,
    )

    const data = rows.map((r) => ({
      id: r.id,
      ref: r.reference_no,
      company: r.legal_name || '—',
      contact: r.contact_person || '—',
      cat: r.specializations || 'Uncategorised',
      district: r.reg_district || '—',
      submitted: formatDate(r.submitted_at),
      days: r.days ?? 0,
      prio: r.priority || (r.days > 10 ? 'high' : r.days > 5 ? 'medium' : 'low'),
      docs: `${r.docs_ok ?? 0}/${r.docs ?? 0}`,
      status: r.status,
      assignee: r.assignee || 'Unassigned',
    }))

    res.json({ statusTabs: countByStatus(), data })
  }),
)

router.get(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const app = get(
      `SELECT a.*, c.legal_name, c.trading_name, c.brn, c.business_type, c.incorporation_date,
              c.employee_count, c.phone, c.email, c.website, c.contact_person, c.contact_designation,
              c.reg_address_1, c.reg_address_2, c.reg_city, c.reg_district, c.reg_province,
              c.reg_postal_code, c.specializations, c.about, c.code, c.tier, c.score, c.status AS company_status,
              u.full_name, u.mobile, u.email AS user_email
       FROM applications a
       LEFT JOIN companies c ON c.id = a.company_id
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.id = ?`,
      [id],
    )
    if (!app) return res.status(404).json({ error: 'Application not found' })

    const documents = all(
      'SELECT * FROM documents WHERE application_id = ? OR user_id = ? ORDER BY category, label',
      [id, app.user_id],
    )
    const steps = all('SELECT * FROM application_steps WHERE application_id = ? ORDER BY step_number', [id])
    const financials = get('SELECT * FROM financials WHERE user_id = ?', [app.user_id])
    const insurance = all('SELECT * FROM insurance WHERE user_id = ?', [app.user_id])
    const references = all('SELECT * FROM references_list WHERE user_id = ?', [app.user_id])
    const certifications = all('SELECT * FROM company_certifications WHERE user_id = ?', [app.user_id])
    const signatories = all('SELECT * FROM signatories WHERE user_id = ?', [app.user_id])
    const timeline = all(
      "SELECT * FROM audit_logs WHERE entity = ? OR module = 'application' ORDER BY created_at DESC LIMIT 8",
      [app.reference_no],
    )
    const reviews = all(
      'SELECT * FROM performance_reviews WHERE supplier_id = ? ORDER BY review_date DESC',
      [app.company_id || 0],
    )
    const scores = all('SELECT * FROM evaluation_scores WHERE application_id = ?', [id])

    const documentsList = documents.map((d) => ({
      id: d.id,
      name: d.label,
      size: formatSize(d.size),
      status: docStatus(d.status),
      note: d.review_note || '',
      uploaded: formatDate(d.uploaded_at),
      exp: formatDate(d.expires_on),
      verifiedBy: d.verified_by || '',
    }))

    const stepsList = steps.map((s) => ({
      step: s.step_number,
      completed: s.completed === 1,
      data: safeJson(s.data),
    }))

    const checklist = buildChecklist(app, documents, financials, references, certifications, signatories)

    const criteria = buildCriteria(app, scores, financials)

    res.json({
      application: {
        id: app.id,
        ref: app.reference_no,
        company: app.legal_name,
        code: app.code,
        tier: app.tier,
        contact: app.contact_person,
        contactDesignation: app.contact_designation,
        phone: app.phone,
        email: app.email || app.user_email,
        cat: app.specializations,
        district: app.reg_district,
        submitted: formatDate(app.created_at),
        days: Math.max(0, Math.round((Date.now() - Date.parse(String(app.created_at).replace(' ', 'T') + 'Z')) / 86400000)),
        status: app.status,
        assignee: app.assignee || 'Unassigned',
        priority: app.priority || (app.days > 10 ? 'high' : 'medium'),
        score: app.score,
        companyStatus: app.company_status,
        user: { name: app.full_name, mobile: app.mobile, email: app.user_email },
        company: {
          legalName: app.legal_name,
          tradingName: app.trading_name,
          brn: app.brn,
          businessType: app.business_type,
          incorporationDate: app.incorporation_date,
          employeeCount: app.employee_count,
          regAddress: [app.reg_address_1, app.reg_address_2, app.reg_city, app.reg_province, app.reg_postal_code]
            .filter(Boolean)
            .join(', '),
        },
      },
      metaCards: {
        submitted: formatDate(app.created_at),
        docs: `${documentsList.filter((d) => d.status === 'accepted').length}/${documentsList.length}`,
      },
      documents: documentsList,
      steps: stepsList,
      financials: {
        turnover: financials?.turnover_range || '—',
        vat: financials?.vat_number || '—',
        vatVerified: financials?.vat_verified === 1,
        epf: financials?.epf_number || '—',
        epfVerified: financials?.epf_verified === 1,
        etf: financials?.etf_number || '—',
        etfVerified: financials?.etf_verified === 1,
        bank: [financials?.bank_name, financials?.bank_branch].filter(Boolean).join(', ') || '—',
        account: financials?.account_name || '—',
        swift: financials?.swift || '—',
      },
      insurance: insurance.map((i) => ({
        insurer: i.insurer || '—',
        policy: i.policy_no || '—',
        coverage: i.coverage || '—',
        expiry: formatDate(i.expiry_date),
      })),
      references: references.map((r) => ({
        kind: r.kind,
        company: r.company || '—',
        person: r.person || '—',
        phone: r.phone || '—',
        email: r.email || '—',
        period: r.period || '—',
        annualValue: r.annual_value || '—',
      })),
      certifications: certifications.map((c) => ({
        name: c.name || '—',
        issuer: c.issuer || '—',
        number: c.cert_number || '—',
        issueDate: formatDate(c.issue_date),
        expiryDate: formatDate(c.expiry_date),
      })),
      signatories: signatories.map((s) => ({
        name: s.name || '—',
        designation: s.designation || '—',
        nic: s.nic || '—',
        primary: s.is_primary === 1,
      })),
      checklist,
      criteria,
      timeline: timeline.map((t) => ({
        id: t.id,
        type: t.action,
        text: t.detail || t.action,
        user: t.user,
        time: t.created_at,
        success: t.success === 1,
      })),
      reviews: reviews.map((r) => ({
        cycle: r.cycle,
        date: formatDate(r.review_date),
        score: r.score,
        band: r.band || bandFor(r.score),
        note: r.note || '',
      })),
    })
  }),
)

const OUTCOME_STATUSES = ['approved', 'conditional', 'probationary', 'suspended', 'blacklisted', 'rejected']
const ASSIGNABLE = new Set([...STATUSES.slice(1), 'in_progress', 'submitted', 'under_review'])

router.patch(
  '/applications/:id/status',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const status = cleanText(req.body.status)
    const note = cleanText(req.body.note || '')
    const app = get('SELECT * FROM applications WHERE id = ?', [id])
    if (!app) return res.status(404).json({ error: 'Application not found' })
    if (!ASSIGNABLE.has(status)) return res.status(400).json({ error: 'Invalid status' })

    run('UPDATE applications SET status = ?, updated_at = datetime(\'now\') WHERE id = ?', [status, id])
    if (note) run('UPDATE applications SET admin_notes = ? WHERE id = ?', [note, id])

    auditLog(req.admin.email, req.admin.role, 'status', 'application', app.reference_no, `Status → ${status}${note ? ' · ' + note : ''}`, req.ip)

    if (OUTCOME_STATUSES.includes(status)) {
      const company = get('SELECT legal_name FROM companies WHERE id = ?', [app.company_id])
      run(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [app.user_id, 'Application status update', `${company?.legal_name || 'Your application'} has been marked as ${status.toUpperCase()}.`, 'application'],
      )
    }

    res.json({ message: 'Application status updated', status })
  }),
)

router.post(
  '/applications/:id/assign',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const assignee = cleanText(req.body.assignee)
    const app = get('SELECT * FROM applications WHERE id = ?', [id])
    if (!app) return res.status(404).json({ error: 'Application not found' })
    if (!assignee) return res.status(400).json({ error: 'Assignee is required' })

    run("UPDATE applications SET assignee = ?, updated_at = datetime('now') WHERE id = ?", [assignee, id])
    auditLog(req.admin.email, req.admin.role, 'assign', 'application', app.reference_no, `Assigned to ${assignee}`, req.ip)
    res.json({ message: 'Application assigned', assignee })
  }),
)

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function docStatus(status) {
  switch (status) {
    case 'verified':
      return 'accepted'
    case 'expired':
      return 'expired'
    case 'reupload':
      return 'reupload'
    default:
      return status || 'pending'
  }
}

function safeJson(value) {
  try {
    return value ? JSON.parse(value) : {}
  } catch {
    return {}
  }
}

function bandFor(score) {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  return 'D'
}

function buildChecklist(app, documents, financials, references, certifications, signatories) {
  const byCategory = {}
  for (const d of documents) {
    if (!byCategory[d.category]) byCategory[d.category] = []
    byCategory[d.category].push(d.status)
  }
  const catCount = Object.keys(byCategory).length
  const okCount = Object.values(byCategory).filter((statuses) => statuses.every((s) => s === 'accepted' || s === 'verified')).length

  return {
    items: [
      { label: 'Company registration', status: okStatus(app.brn) },
      { label: 'Financial records', status: okStatus(financials && (financials.turnover_range || financials.bank_name)) },
      { label: 'References', status: okStatus(references && references.length) },
      { label: 'Certifications', status: okStatus(certifications && certifications.length) },
      { label: 'Signatories', status: okStatus(signatories && signatories.some((s) => s.declared)) },
    ],
    ratio: `${okCount}/${catCount || 0}`,
  }
}

function okStatus(cond) {
  return cond ? 'done' : 'pending'
}

function buildCriteria(app, scores, financials) {
  const defaults = [
    { name: 'Registration', weight: 20 },
    { name: 'Financial', weight: 25 },
    { name: 'Technical', weight: 20 },
    { name: 'Experience', weight: 15 },
    { name: 'Compliance', weight: 20 },
  ]
  if (!scores.length) {
    return defaults.map((c) => ({
      name: c.name,
      weight: c.weight,
      score: c.name === 'Financial' && financials?.vat_verified ? 78 : 65,
      weighted: Math.round((c.name === 'Financial' && financials?.vat_verified ? 78 : 65) * (c.weight / 100)),
      max: 100,
    }))
  }
  const byPillar = Object.fromEntries(scores.map((s) => [s.pillar, s]))
  return defaults.map((c) => {
    const row = byPillar[c.name] || { score: 0, max: 100 }
    return {
      name: c.name,
      weight: c.weight,
      score: row.score,
      max: row.max,
      weighted: Math.round(row.score * (c.weight / 100)),
    }
  })
}

export default router
