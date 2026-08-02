import bcrypt from 'bcryptjs'
import { initDb, run, get, all, tx } from './db.js'
import { genReferenceNo } from './utils/helpers.js'

initDb()

function wipe() {
  const tables = ['users', 'companies', 'applications', 'application_steps', 'documents', 'financials', 'insurance', 'references_list', 'company_certifications', 'signatories', 'notifications', 'tickets', 'ticket_messages']
  for (const t of tables) {
    run(`DELETE FROM ${t}`)
    run(`DELETE FROM sqlite_sequence WHERE name = '${t}'`)
  }
}

function upsertUser({ email, password, fullName, designation, mobile }) {
  const existing = get('SELECT * FROM users WHERE lower(email) = lower(?)', [email])
  if (existing) {
    run('UPDATE users SET status = \'active\' WHERE id = ?', [existing.id])
    return existing
  }
  const result = run(
    `INSERT INTO users (email, password_hash, full_name, designation, mobile, email_verified, status)
     VALUES (?, ?, ?, ?, ?, 1, 'active')`,
    [email, bcrypt.hashSync(password, 10), fullName, designation, mobile],
  )
  return get('SELECT * FROM users WHERE id = ?', [result.lastInsertRowid])
}

function seedSupplier(user, { legalName, tradingName, brn, stepData = {}, companyFields = {}, status = 'in_progress' }) {
  const count = get('SELECT COUNT(*) AS total FROM applications').total
  const referenceNo = genReferenceNo(1000 + count)
  const companyResult = run(
    `INSERT INTO companies (user_id, legal_name, trading_name, brn, business_type, incorporation_date, employee_count,
      reg_address_1, reg_address_2, reg_city, reg_district, reg_province, reg_postal_code,
      bus_city, bus_district, bus_province, phone, email, website, contact_person, contact_designation, about, specializations)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id, legalName, tradingName, brn,
      companyFields.businessType || 'Private Limited Company',
      companyFields.incorporationDate || '2018-05-12',
      companyFields.employeeCount || '11 - 50',
      companyFields.regAddress1 || 'No. 120, Galle Road',
      companyFields.regAddress2 || 'Bambalapitiya',
      companyFields.regCity || 'Colombo 04',
      companyFields.regDistrict || 'Colombo',
      companyFields.regProvince || 'Western Province',
      companyFields.regPostalCode || '00400',
      companyFields.busCity || 'Colombo 04',
      companyFields.busDistrict || 'Colombo',
      companyFields.busProvince || 'Western Province',
      companyFields.phone || '+94 11 255 8800',
      companyFields.companyEmail || user.email,
      companyFields.website || 'https://www.example.lk',
      companyFields.contactPerson || user.full_name,
      companyFields.contactDesignation || user.designation,
      companyFields.about || 'Established supplier of office automation, IT hardware and managed services.',
      companyFields.specializations ? JSON.stringify(companyFields.specializations) : '["Office Automation","IT Hardware","Managed Services"]',
    ],
  )

  const appResult = run(
    `INSERT INTO applications (reference_no, user_id, company_id, current_step, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [referenceNo, user.id, companyResult.lastInsertRowid, 6, status, status === 'in_progress' ? null : '2026-01-10 09:30:00'],
  )
  const appId = appResult.lastInsertRowid

  const steps = [
    {
      n: 1,
      data: { fullName: user.full_name, designation: user.designation, email: user.email, mobile: user.mobile, language: 'English' },
    },
    {
      n: 2,
      data: {
        legalName, tradingName, brn,
        businessType: companyFields.businessType || 'Private Limited Company',
        incorporationDate: companyFields.incorporationDate || '2018-05-12',
        employeeCount: companyFields.employeeCount || '11 - 50',
        regAddr1: companyFields.regAddress1 || 'No. 120, Galle Road',
        regAddr2: companyFields.regAddress2 || 'Bambalapitiya',
        regCity: companyFields.regCity || 'Colombo 04',
        regDistrict: companyFields.regDistrict || 'Colombo',
        regProvince: companyFields.regProvince || 'Western Province',
        regPostal: companyFields.regPostalCode || '00400',
        phone: companyFields.phone || '+94 11 255 8800',
        companyEmail: companyFields.companyEmail || user.email,
        website: companyFields.website || 'https://www.example.lk',
        contactPerson: companyFields.contactPerson || user.full_name,
        contactDesignation: companyFields.contactDesignation || user.designation,
      },
    },
    {
      n: 3,
      data: { about: companyFields.about || 'Office automation and IT hardware supplier.', specializations: ['Office Automation', 'IT Hardware', 'Managed Services'] },
    },
    {
      n: 4,
      data: {
        turnover: 'LKR 50M - 100M',
        bankName: 'Commercial Bank',
        branch: 'Colombo Fort',
        acctName: legalName,
        acctNumber: '123456789012',
        swift: 'CCEYLKLX',
        vatNumber: 'VAT/114/2288',
        vatVerified: true,
        epfNumber: 'EPF/2211456',
        etfNumber: '2211456',
        insurance: { insurer: 'Ceylinco General', policy: 'CLG/2026/00412', coverage: '1000000', expiry: '2026-12-31' },
      },
    },
    { n: 5, data: {} },
    {
      n: 6,
      data: { signatories: [{ name: user.full_name, designation: user.designation, nic: '851234567V' }], declaration: true },
    },
  ]

  for (const s of steps) {
    run(
      `INSERT INTO application_steps (application_id, step_number, data, completed) VALUES (?, ?, ?, 1)
       ON CONFLICT (application_id, step_number) DO UPDATE SET data = excluded.data, completed = 1`,
      [appId, s.n, JSON.stringify(s.data)],
    )
  }

  run(
    `INSERT INTO financials (user_id, turnover_range, vat_number, vat_verified, epf_number, etf_number, bank_name, bank_branch, account_name, account_number, swift)
     VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, 'LKR 50M - 100M', 'VAT/114/2288', 'EPF/2211456', '2211456', 'Commercial Bank', 'Colombo Fort', legalName, '123456789012', 'CCEYLKLX'],
  )
  run(
    `INSERT INTO insurance (user_id, insurer, policy_no, coverage, expiry_date) VALUES (?, ?, ?, ?, ?)`,
    [user.id, 'Ceylinco General', 'CLG/2026/00412', '1000000', '2026-12-31'],
  )
  run(
    `INSERT INTO signatories (user_id, name, designation, nic, is_primary, declared, declared_at) VALUES (?, ?, ?, ?, 1, 1, datetime('now'))`,
    [user.id, user.full_name, user.designation, '851234567V'],
  )
  const sampleDocs = [
    { category: 'legal', label: 'Certificate of Incorporation', original: 'Certificate_of_Incorporation.pdf' },
    { category: 'legal', label: 'BRN Registration', original: 'BRN_Registration.pdf' },
    { category: 'financial', label: 'Bank Reference Letter', original: 'Bank_Reference.pdf' },
    { category: 'financial', label: 'Audited Financial Statements 2024', original: 'Audited_FS_2023_2024.pdf' },
  ]
  for (const d of sampleDocs) {
    run(
      `INSERT INTO documents (user_id, application_id, category, label, file_name, original_name, mime_type, size, status, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, 'application/pdf', 1800000, 'verified', '2026-01-05 11:00:00')`,
      [user.id, appId, d.category, d.label, `${Date.now()}-seed-${d.original}`, d.original],
    )
  }

  return { referenceNo, appId }
}

const seed = tx(() => {
  wipe()

  const demo = upsertUser({ email: 'demo@company.lk', password: 'Demo@1234', fullName: 'Kamal Perera', designation: 'Managing Director', mobile: '771234567' })
  seedSupplier(demo, {
    legalName: 'Lanka Office Solutions (Pvt) Ltd',
    tradingName: 'Lanka Office',
    brn: 'PV/8842',
    companyFields: {
      businessType: 'Private Limited Company',
      about: 'Leading supplier of office automation, IT hardware, stationery and managed services to corporate clients across Sri Lanka.',
    },
    status: 'submitted',
  })

  const supplier2 = upsertUser({ email: 'nadeeka@techworks.lk', password: 'Demo@1234', fullName: 'Nadeeka Fernando', designation: 'Director', mobile: '772345678' })
  seedSupplier(supplier2, {
    legalName: 'TechWorks Engineering Ltd',
    tradingName: 'TechWorks',
    brn: 'PV/9901',
    companyFields: {
      businessType: 'Private Limited Company',
      employeeCount: '51 - 200',
      about: 'Industrial engineering, HVAC services and electrical contracting.',
    },
    status: 'in_progress',
  })

  const supplier3 = upsertUser({ email: 'ruwan@greencart.lk', password: 'Demo@1234', fullName: 'Ruwan Silva', designation: 'Proprietor', mobile: '773456789' })
  seedSupplier(supplier3, {
    legalName: 'GreenCart Trading',
    tradingName: 'GreenCart',
    brn: 'BRN 552310',
    companyFields: {
      businessType: 'Sole Proprietorship',
      employeeCount: '1 - 10',
      about: 'Fresh produce, office pantry supplies and cleaning consumables.',
    },
    status: 'submitted',
  })

  const tickets = [
    {
      email: 'demo@company.lk',
      subject: 'Question about document requirements',
      category: 'Registration',
      priority: 'medium',
      thread: [
        { body: 'Hi, do you require audited statements for the last 2 or 3 years?', isAdmin: 0 },
        { body: 'We accept 2 years, but 3 years strengthens your application.', isAdmin: 1 },
      ],
    },
    {
      email: 'ruwan@greencart.lk',
      subject: 'Unable to upload insurance certificate',
      category: 'Technical Issue',
      priority: 'high',
      thread: [
        { body: 'The upload keeps failing for my insurance PDF, it is 11MB. Is there a size limit?', isAdmin: 0 },
        { body: 'Yes, the max is 10MB. Please compress and retry, or email us directly.', isAdmin: 1 },
      ],
    },
  ]

  for (const t of tickets) {
    const u = get('SELECT * FROM users WHERE lower(email) = lower(?)', [t.email])
    const created = run(
      `INSERT INTO tickets (user_id, subject, category, priority, status) VALUES (?, ?, ?, ?, 'open')`,
      [u.id, t.subject, t.category, t.priority],
    )
    for (const m of t.thread) {
      run('INSERT INTO ticket_messages (ticket_id, user_id, body, is_admin) VALUES (?, ?, ?, ?)', [created.lastInsertRowid, u.id, m.body, m.isAdmin ? 1 : 0])
    }
  }

  for (const u of all('SELECT * FROM users')) {
    run(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [u.id, 'Welcome to the Supplier Portal', 'Your supplier account is ready. Complete your registration application to get started.', 'success'],
    )
  }
})

console.log('Seed complete. Demo logins:')
for (const u of all('SELECT email FROM users')) {
  console.log(`  ${u.email} / Demo@1234`)
}
console.log(`Seeded applications: ${get('SELECT COUNT(*) AS total FROM applications').total}`)
console.log(`Seeded documents: ${get('SELECT COUNT(*) AS total FROM documents').total}`)
console.log(`Seeded notifications: ${get('SELECT COUNT(*) AS total FROM notifications').total}`)
console.log(`Seeded tickets: ${get('SELECT COUNT(*) AS total FROM tickets').total}`)
