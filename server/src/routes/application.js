import { Router } from 'express'
import { get, run, all, tx } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()
router.use(requireAuth)

const STEP_COMPLETE_HINT = {
  2: 'company',
  4: 'financials',
  6: 'declaration',
}

function stepsFor(appId) {
  return all('SELECT * FROM application_steps WHERE application_id = ? ORDER BY step_number', [appId]).map((s) => ({
    stepNumber: s.step_number,
    completed: !!s.completed,
    data: safeJson(s.data),
    updatedAt: s.updated_at,
  }))
}

function safeJson(str) {
  if (!str) return {}
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}

export function applicationPayload(app) {
  if (!app) return null
  const company = app.company_id ? get('SELECT * FROM companies WHERE id = ?', [app.company_id]) : null
  const docs = all('SELECT * FROM documents WHERE application_id = ?', [app.id]).map((d) => ({
    ...d,
    statusLabel: d.status,
  }))
  return {
    id: app.id,
    referenceNo: app.reference_no,
    currentStep: app.current_step,
    status: app.status,
    submittedAt: app.submitted_at,
    reviewedAt: app.reviewed_at,
    adminNotes: app.admin_notes,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
    company,
    documents: docs,
    steps: stepsFor(app.id),
  }
}

// GET /api/application
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app) return res.status(404).json({ error: 'No application found' })
    res.json({ application: applicationPayload(app) })
  }),
)

// PUT /api/application/step/:stepNumber  (body: { data })
router.put(
  '/step/:stepNumber',
  asyncHandler(async (req, res) => {
    const stepNumber = parseInt(req.params.stepNumber, 10)
    if (stepNumber < 1 || stepNumber > 6) return res.status(400).json({ error: 'Invalid step number' })
    const data = req.body && typeof req.body.data === 'object' ? req.body.data : {}

    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app) return res.status(404).json({ error: 'No application found' })
    if (app.status !== 'in_progress') return res.status(409).json({ error: 'Application is no longer editable' })

    tx(() => {
      run(
        `INSERT INTO application_steps (application_id, step_number, data, completed)
         VALUES (?, ?, ?, 1)
         ON CONFLICT (application_id, step_number)
         DO UPDATE SET data = excluded.data, completed = 1, updated_at = datetime('now')`,
        [app.id, stepNumber, JSON.stringify(data)],
      )
      run('UPDATE applications SET current_step = ?, updated_at = datetime(\'now\') WHERE id = ?', [
        Math.max(app.current_step, stepNumber),
        app.id,
      ])
      if (STEP_COMPLETE_HINT[stepNumber] === 'company') {
        upsertCompanyFromStep(req.user.id, app.id, data)
      }
      if (STEP_COMPLETE_HINT[stepNumber] === 'financials') {
        upsertFinancialsFromStep(req.user.id, data)
      }
      if (STEP_COMPLETE_HINT[stepNumber] === 'declaration') {
        upsertSignatories(req.user.id, data)
      }
    })

    res.json({ message: `Step ${stepNumber} saved`, step: stepNumber, currentStep: Math.max(app.current_step, stepNumber) })
  }),
)

function upsertCompanyFromStep(userId, appId, data) {
  const existing = get('SELECT id FROM companies WHERE user_id = ?', [userId])
  const fields = {
    legal_name: data.legalName || data.companyLegalName || null,
    trading_name: data.tradingName || data.trading_name || null,
    brn: data.brn || null,
    business_type: data.businessType || null,
    incorporation_date: data.incorporationDate || data.incorporation_date || null,
    boi_number: data.boiNumber || null,
    employee_count: data.employeeCount || null,
    reg_address_1: data.regAddr1 || data.regAddress1 || null,
    reg_address_2: data.regAddr2 || data.regAddress2 || null,
    reg_city: data.regCity || null,
    reg_district: data.regDistrict || null,
    reg_province: data.regProvince || null,
    reg_postal_code: data.regPostal || null,
    maps_link: data.mapsLink || null,
    bus_address_1: data.busAddr1 || data.busAddress1 || null,
    bus_address_2: data.busAddr2 || data.busAddress2 || null,
    bus_city: data.busCity || null,
    bus_district: data.busDistrict || null,
    bus_province: data.busProvince || null,
    bus_postal_code: data.busPostal || null,
    phone: data.phone || data.companyPhone || null,
    fax: data.fax || null,
    email: data.companyEmail || data.email || null,
    website: data.website || null,
    contact_person: data.contactPerson || null,
    contact_designation: data.contactDesignation || null,
    specializations: Array.isArray(data.specializations) ? JSON.stringify(data.specializations) : data.specializations || null,
  }

  if (existing) {
    run(
      `UPDATE companies SET
        legal_name=?, trading_name=?, brn=?, business_type=?, incorporation_date=?, boi_number=?, employee_count=?,
        reg_address_1=?, reg_address_2=?, reg_city=?, reg_district=?, reg_province=?, reg_postal_code=?, maps_link=?,
        bus_address_1=?, bus_address_2=?, bus_city=?, bus_district=?, bus_province=?, bus_postal_code=?,
        phone=?, fax=?, email=?, website=?, contact_person=?, contact_designation=?, specializations=?, updated_at=datetime('now')
       WHERE id = ?`,
      [
        fields.legal_name, fields.trading_name, fields.brn, fields.business_type, fields.incorporation_date, fields.boi_number, fields.employee_count,
        fields.reg_address_1, fields.reg_address_2, fields.reg_city, fields.reg_district, fields.reg_province, fields.reg_postal_code, fields.maps_link,
        fields.bus_address_1, fields.bus_address_2, fields.bus_city, fields.bus_district, fields.bus_province, fields.bus_postal_code,
        fields.phone, fields.fax, fields.email, fields.website, fields.contact_person, fields.contact_designation, fields.specializations,
        existing.id,
      ],
    )
  } else {
    const result = run(
      `INSERT INTO companies (
        user_id, legal_name, trading_name, brn, business_type, incorporation_date, boi_number, employee_count,
        reg_address_1, reg_address_2, reg_city, reg_district, reg_province, reg_postal_code, maps_link,
        bus_address_1, bus_address_2, bus_city, bus_district, bus_province, bus_postal_code,
        phone, fax, email, website, contact_person, contact_designation, specializations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, fields.legal_name, fields.trading_name, fields.brn, fields.business_type, fields.incorporation_date, fields.boi_number, fields.employee_count,
        fields.reg_address_1, fields.reg_address_2, fields.reg_city, fields.reg_district, fields.reg_province, fields.reg_postal_code, fields.maps_link,
        fields.bus_address_1, fields.bus_address_2, fields.bus_city, fields.bus_district, fields.bus_province, fields.bus_postal_code,
        fields.phone, fields.fax, fields.email, fields.website, fields.contact_person, fields.contact_designation, fields.specializations,
      ],
    )
    const companyId = result.lastInsertRowid
    run('UPDATE applications SET company_id = ? WHERE id = ?', [companyId, appId])
  }
}

function upsertFinancialsFromStep(userId, data) {
  const existing = get('SELECT id FROM financials WHERE user_id = ?', [userId])
  const fields = {
    turnover_range: data.turnover || data.turnoverRange || null,
    vat_number: data.vatNumber || null,
    vat_verified: data.vatVerified ? 1 : 0,
    epf_number: data.epfNumber || data.epfNo || null,
    epf_verified: data.epfVerified ? 1 : 0,
    etf_number: data.etfNumber || data.etfNo || null,
    etf_verified: data.etfVerified ? 1 : 0,
    bank_name: data.bank || data.bankName || null,
    bank_branch: data.branch || null,
    account_name: data.acctName || data.accountName || null,
    account_number: data.acctNumber || data.accountNumber || null,
    swift: data.swift || null,
  }
  if (existing) {
    run(
      `UPDATE financials SET turnover_range=?, vat_number=?, vat_verified=?, epf_number=?, epf_verified=?, etf_number=?, etf_verified=?,
        bank_name=?, bank_branch=?, account_name=?, account_number=?, swift=?, updated_at=datetime('now')
       WHERE user_id = ?`,
      [
        fields.turnover_range, fields.vat_number, fields.vat_verified, fields.epf_number, fields.epf_verified, fields.etf_number, fields.etf_verified,
        fields.bank_name, fields.bank_branch, fields.account_name, fields.account_number, fields.swift,
        userId,
      ],
    )
  } else {
    run(
      `INSERT INTO financials (user_id, turnover_range, vat_number, vat_verified, epf_number, epf_verified, etf_number, etf_verified,
        bank_name, bank_branch, account_name, account_number, swift)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, fields.turnover_range, fields.vat_number, fields.vat_verified, fields.epf_number, fields.epf_verified, fields.etf_number, fields.etf_verified,
        fields.bank_name, fields.bank_branch, fields.account_name, fields.account_number, fields.swift,
      ],
    )
  }

  if (data.insurance && typeof data.insurance === 'object') {
    const ins = data.insurance
    run(
      `INSERT INTO insurance (user_id, insurer, policy_no, coverage, expiry_date)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, ins.insurer || null, ins.policy || ins.policyNo || null, ins.coverage ? String(ins.coverage) : null, ins.expiry || null],
    )
  }

  if (Array.isArray(data.customer) || Array.isArray(data.customerReference)) {
    const list = data.customerReference || data.customer
    list.forEach((c) => {
      if (!c || !c.company) return
      run(
        `INSERT INTO references_list (user_id, kind, company, person, phone, email, period, annual_value, nature)
         VALUES (?, 'customer', ?, ?, ?, ?, ?, ?, ?)`,
        [userId, c.company, c.person || null, c.phone || null, c.email || null, c.period || null, c.annualValue || c.value || null, c.nature || null],
      )
    })
  }
  if (Array.isArray(data.supplier) || Array.isArray(data.supplierReference)) {
    const list = data.supplierReference || data.supplier
    list.forEach((s) => {
      if (!s || !s.company) return
      run(
        `INSERT INTO references_list (user_id, kind, company, person, phone, email, period, annual_value, nature)
         VALUES (?, 'supplier', ?, ?, ?, ?, ?, ?, ?)`,
        [userId, s.company, s.person || null, s.phone || null, s.email || null, s.period || null, s.annualValue || s.value || null, s.nature || null],
      )
    })
  }
}

function upsertSignatories(userId, data) {
  const items = Array.isArray(data.signatories) ? data.signatories : []
  items.forEach((s, i) => {
    if (!s || !s.name) return
    run(
      `INSERT INTO signatories (user_id, name, designation, nic, is_primary, declared, declared_at)
       VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`,
      [userId, s.name, s.designation || null, s.nic || null, i === 0 ? 1 : 0],
    )
  })
}

// POST /api/application/submit
router.post(
  '/submit',
  asyncHandler(async (req, res) => {
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app) return res.status(404).json({ error: 'No application found' })
    if (app.status !== 'in_progress') return res.status(409).json({ error: 'Application already submitted' })

    const steps = all('SELECT step_number, completed FROM application_steps WHERE application_id = ?', [app.id])
    const incomplete = steps.filter((s) => !s.completed).map((s) => s.step_number)
    if (incomplete.length > 0) {
      return res.status(400).json({ error: `Complete steps ${incomplete.join(', ')} before submitting` })
    }

    tx(() => {
      run('UPDATE applications SET status = \'submitted\', submitted_at = datetime(\'now\'), updated_at = datetime(\'now\') WHERE id = ?', [app.id])
      run(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, 'Application Submitted', ?, 'success')`,
        [req.user.id, `Your application ${app.reference_no} has been submitted for review. You will be notified of the outcome.`],
      )
    })

    res.json({ message: 'Application submitted successfully', application: applicationPayload(get('SELECT * FROM applications WHERE id = ?', [app.id])) })
  }),
)

// PATCH /api/application (reopen / basic updates)
router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app) return res.status(404).json({ error: 'No application found' })
    const { currentStep, status } = req.body || {}
    if (currentStep !== undefined) {
      run('UPDATE applications SET current_step = ?, updated_at = datetime(\'now\') WHERE id = ?', [currentStep, app.id])
    }
    if (status && ['draft', 'in_progress'].includes(status)) {
      run('UPDATE applications SET status = ?, updated_at = datetime(\'now\') WHERE id = ?', [status, app.id])
    }
    res.json({ application: applicationPayload(get('SELECT * FROM applications WHERE id = ?', [app.id])) })
  }),
)

export default router
