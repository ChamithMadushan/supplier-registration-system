import bcrypt from 'bcryptjs'
import db, { initDb } from './db.js'

initDb()

function dateStr(daysAgo, hoursAgo = 0) {
  const d = new Date(Date.now() - daysAgo * 86400000 - hoursAgo * 3600000)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

function run(sql, params = []) {
  return db.prepare(sql).run(...params.map((v) => (v === undefined ? null : v)))
}

function get(sql, params = []) {
  return db.prepare(sql).get(...params)
}

function insert(sql, params = []) {
  const res = db.prepare(sql).run(...params.map((v) => (v === undefined ? null : v)))
  return Number(res.lastInsertRowid)
}

const adminCount = get('SELECT COUNT(*) AS n FROM admin_users').n
if (adminCount === 0) {
  const hash = bcrypt.hashSync('admin123', 10)
  run(
    `INSERT INTO admin_users (email, password_hash, full_name, role, otp_code, phone_masked, email_masked, status, last_login)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'active', datetime('now', '-1 day'))`,
    ['admin@company.lk', hash, 'Kamal Perera', 'Procurement Manager', '482000', '+94 77••• 1234', 'ka•••@company.lk'],
  )
  console.log('[seed] created admin user admin@company.lk / admin123 (OTP 482000)')
}

const hasAdminDemo = get('SELECT COUNT(*) AS n FROM categories').n > 0

if (!hasAdminDemo) {
  db.exec('BEGIN')
  try {
    seedDemo()
    db.exec('COMMIT')
    console.log('[seed] seeded admin demo dataset')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
} else {
  console.log('[seed] demo data already present, skipping')
}

console.log('[seed] done')

function seedDemo() {
  const HASH = bcrypt.hashSync('Vendor@1234', 10)

  const CATEGORIES = [
    'Office Supplies', 'IT Hardware', 'Cleaning Services', 'Furniture', 'Electrical & Electronics',
    'Industrial Equipment', 'Construction Materials', 'Food & Beverage', 'Printing Services',
    'Safety Equipment', 'Logistics', 'Packaging', 'Security Services', 'Medical Equipment',
    'Telecommunications', 'Agriculture',
  ]

  for (const name of CATEGORIES) {
    run('INSERT INTO categories (name, active, suppliers, products) VALUES (?, 1, 0, ?)', [name, '—'])
  }

  const workflow = [
    { stage: 'New', assignee: 'Front Desk', sla: '2 days' },
    { stage: 'Screening', assignee: 'Procurement Officer', sla: '5 days' },
    { stage: 'Verification', assignee: 'Verification Team', sla: '7 days' },
    { stage: 'Evaluation', assignee: 'Evaluation Committee', sla: '14 days' },
    { stage: 'Ready', assignee: 'Head of Procurement', sla: '3 days' },
  ]
  for (const w of workflow) {
    run('INSERT INTO workflow_stages (stage, assignee, sla, active) VALUES (?, ?, ?, 1)', [w.stage, w.assignee, w.sla])
  }

  const templates = [
    ['Acknowledgement', 'Automatic acknowledgement of a new supplier registration'],
    ['Documents Required', 'Template requesting additional supporting documents'],
    ['Approval Notification', 'Notification template for approved suppliers'],
    ['Expiry Reminder', 'Reminder for expiring certificates and documents'],
    ['Onboarding Welcome', 'Welcome email for newly approved suppliers'],
  ]
  for (const [name, desc] of templates) {
    run('INSERT INTO mail_templates (name, description, used) VALUES (?, ?, ?)', [name, desc, Math.floor(Math.random() * 80)])
  }

  const campaigns = [
    ['Q2 Supplier Onboarding Drive', 'Email', 42, '2026-04-15', '2026-05-20', 'completed'],
    ['Annual Compliance Reminder', 'Email', 96, '2026-06-01', '2026-07-01', 'active'],
    ['Category Expansion Notice', 'Email', 28, null, null, 'scheduled'],
    ['Vendor Feedback Survey', 'Email', 64, '2026-05-10', '2026-06-10', 'completed'],
  ]
  for (const [name, type, recipients, sent, opened, status] of campaigns) {
    run('INSERT INTO mail_campaigns (name, type, recipients, sent, opened, status) VALUES (?, ?, ?, ?, ?, ?)', [
      name, type, recipients, sent, opened, status,
    ])
  }

  const reportDefs = [
    ['Monthly Supplier Report', 'Monthly', '1st of month', '2026-06-30', '2026-07-01', 5],
    ['Quarterly Performance Report', 'Quarterly', 'Quarter end', '2026-03-31', '2026-07-01', 8],
    ['Compliance Audit Report', 'Weekly', 'Every Monday', '2026-06-27', '2026-07-06', 3],
  ]
  for (const [name, type, schedule, lastRun, nextRun, recipients] of reportDefs) {
    run('INSERT INTO report_definitions (name, type, schedule, last_run, next_run, recipients, active) VALUES (?, ?, ?, ?, ?, ?, 1)', [
      name, type, schedule, lastRun, nextRun, recipients,
    ])
  }

  const genReports = [
    ['Supplier Registration Summary - June 2026', 'Registration', 'Kamal Perera', '2026-06-30', '2.4 MB'],
    ['Approved Vendors List - June 2026', 'Supplier', 'Kamal Perera', '2026-06-28', '1.1 MB'],
    ['Document Compliance Status - June 2026', 'Compliance', 'Nimal Fernando', '2026-06-26', '3.8 MB'],
    ['Spend Analysis - Q2 2026', 'Spend', 'Kamal Perera', '2026-06-24', '1.6 MB'],
    ['Quarterly Performance - Q2 2026', 'Performance', 'Nimal Fernando', '2026-06-22', '2.1 MB'],
    ['Risk Assessment - June 2026', 'Risk', 'Priya Silva', '2026-06-20', '4.2 MB'],
  ]
  for (const [name, type, by, at, size] of genReports) {
    run('INSERT INTO generated_reports (name, type, generated_by, generated_at, size) VALUES (?, ?, ?, ?, ?)', [name, type, by, at, size])
  }

  const managedUsers = [
    ['Kamal Perera', 'kamal@procurement.gov.lk', 'Procurement Manager', 'active', '2026-07-01 09:15'],
    ['Nimal Fernando', 'nimal@procurement.gov.lk', 'Procurement Officer', 'active', '2026-07-01 08:40'],
    ['Priya Silva', 'priya@procurement.gov.lk', 'Compliance Officer', 'active', '2026-06-30 16:22'],
    ['Dinesh Jayasuriya', 'dinesh@procurement.gov.lk', 'Verification Officer', 'inactive', '2026-06-20 11:05'],
    ['Saman Kumara', 'saman@procurement.gov.lk', 'Data Analyst', 'active', '2026-06-29 14:30'],
  ]
  for (const [name, email, role, status, lastLogin] of managedUsers) {
    run('INSERT INTO admin_users_managed (name, email, role, status, last_login) VALUES (?, ?, ?, ?, ?)', [name, email, role, status, lastLogin])
  }

  const companies = [
    ['Vista Office Supplies (Pvt) Ltd', 'Office Supplies', 'Colombo', 'Sanjaya Perera', 'approved', 88, 'preferred'],
    ['TechNova Solutions (Pvt) Ltd', 'IT Hardware', 'Kandy', 'Ashen Karunaratne', 'approved', 92, 'strategic'],
    ['PureClean Services', 'Cleaning Services', 'Gampaha', 'Dilani Wijesinghe', 'approved', 76, 'approved'],
    ['Craftwood Furniture', 'Furniture', 'Colombo', 'Roshan Fernando', 'approved', 81, 'preferred'],
    ['Lanka Volt Electricals', 'Electrical & Electronics', 'Kurunegala', 'Chamara Silva', 'approved', 73, 'approved'],
    ['Meridian Industrial Equipment', 'Industrial Equipment', 'Colombo', 'Thilina Rajapakse', 'approved', 85, 'preferred'],
    ['SolidBuild Materials', 'Construction Materials', 'Galle', 'Sujeewa Bandara', 'approved', 79, 'approved'],
    ['FreshFields Agro', 'Agriculture', 'Matale', 'Nuwan Jayasinghe', 'approved', 70, 'approved'],
    ['Arctic Press & Print', 'Printing Services', 'Colombo', 'Hasini Perera', 'approved', 74, 'approved'],
    ['SafeGuard Equipment (Pvt) Ltd', 'Safety Equipment', 'Colombo', 'Lahiru Gunasekara', 'approved', 68, 'conditional'],
    ['SwiftCargo Logistics', 'Logistics', 'Katunayake', 'Mohamed Rizwan', 'approved', 90, 'strategic'],
    ['WrapRight Packaging', 'Packaging', 'Negombo', 'Chandana Wickramasinghe', 'approved', 71, 'approved'],
    ['SecureTrust Security Services', 'Security Services', 'Colombo', 'Mahesh Weerasinghe', 'approved', 64, 'conditional'],
    ['MediPlus Supplies', 'Medical Equipment', 'Colombo', 'Dr. Nadeesha Gunasekara', 'approved', 83, 'preferred'],
    ['CommLink Telecom', 'Telecommunications', 'Colombo', 'Ishara Jayasena', 'approved', 87, 'preferred'],
    ['BluePeak Foods', 'Food & Beverage', 'Gampaha', 'Sandun Perera', 'approved', 66, 'approved'],
    ['EcoWash Solutions', 'Cleaning Services', 'Kandy', 'Amali Rathnayake', 'new', 0, null],
    ['NextWave IT Services', 'IT Hardware', 'Colombo', 'Kasun Abeysekara', 'screening', 0, null],
    ['GreenGuard Eco Products', 'Packaging', 'Colombo', 'Nadeesha Kumari', 'verification', 0, null],
    ['UrbanEdge Furniture', 'Furniture', 'Colombo', 'Ravindu Silva', 'evaluation', 0, null],
    ['PrecisionTools Engineering', 'Industrial Equipment', 'Batticaloa', 'Suresh Kumar', 'ready', 0, null],
    ['CityLight Electricals', 'Electrical & Electronics', 'Matara', 'Gayan Perera', 'screening', 0, null],
    ['FreshLeaf Produce', 'Agriculture', 'Nuwara Eliya', 'Kasuni Weerasinghe', 'new', 0, null],
    ['MedServe Lanka', 'Medical Equipment', 'Colombo', 'Dr. Nuwan Silva', 'verification', 0, null],
    ['SkyLine Telecom', 'Telecommunications', 'Kandy', 'Harsha Wijesuriya', 'evaluation', 0, null],
    ['PrintHub Lanka', 'Printing Services', 'Colombo', 'Iresha Fernando', 'new', 0, null],
    ['SteelFrame Industries', 'Construction Materials', 'Colombo', 'Ajith Rathnayake', 'rejected', 0, null],
    ['BudgetMove Logistics', 'Logistics', 'Colombo', 'Faizal Mohideen', 'rejected', 0, null],
    ['TrueValue Office Supplies', 'Office Supplies', 'Galle', 'Isuru Dias', 'suspended', 55, null],
    ['FastClean Services', 'Cleaning Services', 'Negombo', 'Malinda Jayawardena', 'probationary', 58, null],
    ['NorthStar Foods', 'Food & Beverage', 'Jaffna', 'Vijay Kumar', 'conditional', 60, null],
    ['BrightEdge Packaging', 'Packaging', 'Kandy', 'Sachini Herath', 'probationary', 62, null],
    ['PrimeBuild Materials', 'Construction Materials', 'Colombo', 'Prasanna Perera', 'suspended', 50, null],
    ['GlobalTrade Imports', 'Office Supplies', 'Colombo', 'Shanaka Jayasuriya', 'blacklisted', 0, null],
    ['QuickFix Services', 'Cleaning Services', 'Kandy', 'Rohana Gamage', 'blacklisted', 0, null],
    ['SignalLink Telecom', 'Telecommunications', 'Gampaha', 'Chathurika Silva', 'in_progress', 0, null],
    ['EcoFoods Lanka', 'Food & Beverage', 'Colombo', 'Anura Bandara', 'submitted', 0, null],
  ]

  const docSet = [
    { category: 'Company Registration', label: 'Certificate of Incorporation', expiring: true },
    { category: 'Company Registration', label: 'Company Business Registration', expiring: true },
    { category: 'Company Registration', label: 'NBT / Tax Registration', expiring: true },
    { category: 'Financial', label: 'Audited Financials', expiring: false },
    { category: 'Financial', label: 'Bank Statements (6 months)', expiring: false },
    { category: 'Certifications', label: 'ISO 9001 Certificate', expiring: true },
    { category: 'Certifications', label: 'ISO 14001 Certificate', expiring: true },
    { category: 'Certifications', label: 'Safety Certificate', expiring: true },
    { category: 'Insurance', label: 'Public Liability Insurance', expiring: true },
    { category: 'References', label: 'Customer Reference', expiring: false },
    { category: 'References', label: 'Trade References', expiring: false },
  ]

  let appCounter = 0
  let refCounter = 1000

  function addCompany(company, isDemo = false) {
    const [name, cat, district, contact, status, score, tier] = company
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const email = `${slug}@vendor.lk`
    const userId = insert(
      `INSERT INTO users (email, password_hash, full_name, designation, mobile, language, email_verified, status)
       VALUES (?, ?, ?, ?, ?, 'English', 1, 'active')`,
      [email, HASH, contact, 'Procurement Contact', `+94 77 ${String(700000000 + Math.floor(Math.random() * 90000000))}`],
    )

    const companyId = insert(
      `INSERT INTO companies (user_id, legal_name, trading_name, brn, business_type, incorporation_date, employee_count,
        reg_address_1, reg_city, reg_district, reg_province, reg_postal_code, phone, email, website,
        contact_person, contact_designation, about, specializations, status, code, tier, score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, name, name, 'BR-' + (100000 + Math.floor(Math.random() * 899999)),
        'Private Limited', dateStr(900 + Math.floor(Math.random() * 3000)), String(20 + Math.floor(Math.random() * 400)),
        'No. ' + (10 + Math.floor(Math.random() * 990)), 'Street ' + (1 + Math.floor(Math.random() * 9)),
        district, provinceFor(district), String(10000 + Math.floor(Math.random() * 89999)),
        `+94 11 ${String(2000000 + Math.floor(Math.random() * 7000000))}`, email, `www.${slug}.lk`,
        contact, 'Procurement Contact', `Registered supplier in ${cat}.`, cat,
        status, null, tier ?? null, score ?? 0,
      ],
    )
    const code = ['approved', 'preferred', 'strategic', 'suspended', 'probationary', 'conditional'].includes(status)
      ? 'SRS-APR-' + String(companyId).padStart(3, '0')
      : null
    run('UPDATE companies SET code = ? WHERE id = ?', [code, companyId])

    appCounter += 1
    refCounter += 1
    const referenceNo = 'SRS-APP-' + refCounter
    const daysAgo = 5 + Math.floor(Math.random() * 330)
    const appId = insert(
      `INSERT INTO applications (reference_no, user_id, company_id, current_step, status, submitted_at, reviewed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [referenceNo, userId, companyId, 5, status, dateStr(daysAgo), status === 'approved' ? dateStr(Math.max(0, daysAgo - 40)) : null, dateStr(daysAgo), dateStr(Math.floor(Math.random() * 5))],
    )

    for (const step of [1, 2, 3, 4, 5]) {
      run('INSERT INTO application_steps (application_id, step_number, data, completed) VALUES (?, ?, ?, 1)', [
        appId, step, JSON.stringify({ saved: true }),
      ])
    }

    const acceptedStatuses = ['approved', 'preferred', 'strategic', 'suspended', 'probationary', 'conditional']
    const isAccepted = acceptedStatuses.includes(status)
    for (const doc of docSet) {
      let docStatus
      let expiresOn = null
      if (isAccepted) {
        const r = Math.random()
        docStatus = r < 0.8 ? 'accepted' : r < 0.9 ? 'review' : 'pending'
      } else if (status === 'rejected') {
        docStatus = 'rejected'
      } else {
        const r = Math.random()
        docStatus = r < 0.5 ? 'pending' : r < 0.8 ? 'accepted' : 'rejected'
      }
      if (doc.expiring && (isAccepted || docStatus === 'accepted')) {
        const r = Math.random()
        expiresOn = r < 0.75 ? dateStr(-(30 + Math.floor(Math.random() * 330))) : r < 0.85 ? dateStr(-(10 + Math.floor(Math.random() * 20))) : dateStr(Math.floor(Math.random() * 29))
      }
      run(
        `INSERT INTO documents (user_id, application_id, category, label, file_name, original_name, mime_type, size, status, review_note, uploaded_at, verified_at, expires_on, verified_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, appId, doc.category, doc.label,
          `demo_${slug}_${doc.label.replace(/[^a-z0-9]+/gi, '_')}.pdf`,
          doc.label + '.pdf', 'application/pdf', 120000 + Math.floor(Math.random() * 800000),
          docStatus, docStatus === 'rejected' ? 'Document illegible, please re-upload.' : null,
          dateStr(daysAgo + Math.floor(Math.random() * 20)),
          docStatus === 'accepted' ? dateStr(daysAgo + 21) : null,
          expiresOn, docStatus === 'accepted' ? 'Nimal Fernando' : null,
        ],
      )
    }

    if (isAccepted) {
      const turnover = ['LKR 10M - 50M', 'LKR 50M - 100M', 'LKR 100M - 500M', 'LKR 500M+'][Math.floor(Math.random() * 4)]
      run(
        `INSERT INTO financials (user_id, turnover_range, vat_number, vat_verified, epf_number, epf_verified, etf_number, etf_verified, bank_name, bank_branch, account_name, account_number, swift)
         VALUES (?, ?, ?, 1, ?, 1, ?, 1, ?, ?, ?, ?, ?)`,
        [userId, turnover, 'VAT-' + (10000000 + Math.floor(Math.random() * 89999999)), 'EPF-' + (100000 + Math.floor(Math.random() * 899999)), 'ETF-' + (100000 + Math.floor(Math.random() * 899999)), ['Commercial Bank', 'HNB', 'NDB', 'Sampath', 'DFCC'][Math.floor(Math.random() * 5)], 'Colombo', company[0], '10' + (100000000 + Math.floor(Math.random() * 899999999)), 'SWIFT' + Math.floor(Math.random() * 9999)],
      )
    }

    if (isAccepted) {
      run('INSERT INTO insurance (user_id, insurer, policy_no, coverage, expiry_date) VALUES (?, ?, ?, ?, ?)', [
        userId, ['Ceylinco Insurance', 'Sri Lanka Insurance', 'Union Assurance'][Math.floor(Math.random() * 3)], 'POL-' + Math.floor(Math.random() * 999999), 'LKR 10,000,000', dateStr(-(60 + Math.floor(Math.random() * 300))),
      ])
      for (let i = 0; i < 2; i++) {
        run('INSERT INTO references_list (user_id, kind, company, person, phone, email, period, annual_value, nature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
          userId, i === 0 ? 'customer' : 'supplier', 'Reference Co ' + (i + 1), 'Ref Person ' + (i + 1), '+94 11 2' + Math.floor(Math.random() * 9999999), 'ref' + (i + 1) + '@example.lk', '2023-2025', 'LKR ' + (1000000 + Math.floor(Math.random() * 8000000)), 'Regular orders',
        ])
      }
      run('INSERT INTO company_certifications (user_id, name, issuer, cert_number, issue_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?)', [
        userId, 'ISO 9001:2015', 'SGS', 'ISO-' + Math.floor(Math.random() * 99999), dateStr(-360), dateStr(-(1 + Math.floor(Math.random() * 330))),
      ])
      run('INSERT INTO signatories (user_id, name, designation, nic, is_primary, declared, declared_at) VALUES (?, ?, ?, ?, 1, 1, ?)', [
        userId, contact, 'Managing Director', '8' + String(600000000 + Math.floor(Math.random() * 399999999)), dateStr(30),
      ])
    }

    return { userId, companyId, appId }
  }

  function provinceFor(district) {
    const map = {
      Colombo: 'Western', Gampaha: 'Western', Kalutara: 'Western',
      Kandy: 'Central', Matale: 'Central', 'Nuwara Eliya': 'Central',
      Galle: 'Southern', Matara: 'Southern',
      Kurunegala: 'North Western',
      Batticaloa: 'Eastern', Jaffna: 'Northern', Katunayake: 'Western', Negombo: 'Western',
    }
    return map[district] || 'Western'
  }

  // Keep the 3 existing demo suppliers on board without touching their application status
  const demoEmails = ['demo@company.lk', 'nadeeka@techworks.lk', 'ruwan@greencart.lk']
  const demoCompanies = db.prepare(
    `SELECT c.id, c.user_id FROM companies c JOIN users u ON u.id = c.user_id WHERE u.email IN (${demoEmails.map(() => '?').join(',')})`,
  ).all(...demoEmails)
  for (const [i, row] of demoCompanies.entries()) {
    run("UPDATE companies SET status = 'approved', tier = 'preferred', score = ?, code = ? WHERE id = ?", [
      86 - i, 'SRS-APR-' + String(row.id).padStart(3, '0'), row.id,
    ])
  }

  const results = []
  for (const company of companies) {
    results.push(addCompany(company))
  }

  // Performance reviews for approved vendors
  const approved = db.prepare(
    `SELECT c.id, c.user_id, c.score FROM companies c JOIN applications a ON a.company_id = c.id
     WHERE a.status = 'approved'`,
  ).all()
  const cycles = [
    ['Q3 2025', 60], ['Q4 2025', 90], ['Q1 2026', 120], ['Q2 2026', 150],
  ]
  for (const row of approved) {
    const base = row.score || 75
    for (const [cycle, ago] of cycles) {
      const variance = Math.floor(Math.random() * 9) - 4
      const score = Math.min(100, Math.max(40, base + variance))
      run(
        'INSERT INTO performance_reviews (supplier_id, cycle, review_date, score, reviewed_by, note, band) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [row.id, cycle, dateStr(ago + Math.floor(Math.random() * 15)), score, Math.random() < 0.7 ? 'Nimal Fernando' : 'Kamal Perera', 'Annual performance evaluation.', score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D'],
      )
    }
  }

  // Evaluation scores for a few in-flight applications
  const inFlight = db.prepare(
    `SELECT a.id, a.company_id FROM applications a WHERE a.status IN ('evaluation','ready','verification') LIMIT 5`,
  ).all()
  const pillars = ['Registration', 'Financial', 'Technical', 'Experience', 'Compliance']
  for (const row of inFlight) {
    for (const pillar of pillars) {
      run('INSERT INTO evaluation_scores (application_id, pillar, score, max) VALUES (?, ?, ?, 100)', [
        row.id, pillar, 60 + Math.floor(Math.random() * 38),
      ])
    }
  }

  // Orders for approved vendors
  const vendors = db.prepare(
    `SELECT c.id, c.code FROM companies c JOIN applications a ON a.company_id = c.id WHERE a.status = 'approved'`,
  ).all()
  const items = ['Stationery pack', 'Laptop batch', 'Cleaning consumables', 'Office furniture', 'Cables & adapters', 'Safety helmets', 'Medical consumables', 'Food provisions', 'Printing jobs', 'Packaging boxes']
  for (const v of vendors) {
    const n = 2 + Math.floor(Math.random() * 6)
    for (let i = 0; i < n; i++) {
      run(
        'INSERT INTO orders (supplier_id, po, item, order_date, value, status) VALUES (?, ?, ?, ?, ?, ?)',
        [v.id, 'PO-' + (20260000 + Math.floor(Math.random() * 8999)), items[Math.floor(Math.random() * items.length)], dateStr(20 + Math.floor(Math.random() * 160)), 'LKR ' + (250000 + Math.floor(Math.random() * 2400000)).toLocaleString('en-US').replace(/,/g, ','), ['Delivered', 'In Progress', 'Pending'][Math.floor(Math.random() * 3)]],
      )
    }
  }

  // Support tickets
  const ticketData = [
    ['Unable to upload audited financials', 'Technical', 'high', 'open', 1],
    ['Question about ISO certification requirement', 'General', 'medium', 'pending', 2],
    ['Update contact details for new branch', 'Account', 'low', 'closed', 3],
    ['Status enquiry after 3 weeks', 'General', 'high', 'open', 4],
    ['Invoice payment delay', 'Billing', 'high', 'pending', 1],
    ['Registration step 4 not saving', 'Technical', 'medium', 'closed', 5],
    ['Request for category expansion', 'General', 'low', 'open', 2],
    ['Document rejected - resubmission', 'Documents', 'high', 'replied', 3],
  ]
  for (const [i, [subject, category, priority, status, vendorIdx]] of ticketData.entries()) {
    const vendor = vendors[vendorIdx % vendors.length]
    const ticketUserId = get('SELECT user_id FROM companies WHERE id = ?', [vendor.id]).user_id
    const ticketId = insert(
      'INSERT INTO tickets (user_id, subject, category, priority, status, assignee, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ticketUserId, subject, category, priority, status, Math.random() < 0.5 ? 'Nimal Fernando' : 'Kamal Perera', dateStr(i * 3 + 2), dateStr(i * 3)],
    )
    run('INSERT INTO ticket_messages (ticket_id, user_id, body, is_admin) VALUES (?, ?, ?, 0)', [ticketId, ticketUserId, `${subject} - please assist.`])
    run('INSERT INTO ticket_messages (ticket_id, body, is_admin) VALUES (?, ?, 1)', [ticketId, 'Thank you for contacting support. Our team is looking into this.'])
    if (status === 'replied' || status === 'closed') {
      run('INSERT INTO ticket_messages (ticket_id, user_id, body, is_admin) VALUES (?, ?, ?, 0)', [ticketId, ticketUserId, 'Understood, thanks.'])
    }
  }

  // Mail messages
  const mails = [
    ['inbox', 'Kamal Perera', 'kamal@procurement.gov.lk', 'New supplier registration received', 'A new supplier application has been submitted and requires review.', 'Review', '5 min'],
    ['inbox', 'Nimal Fernando', 'nimal@procurement.gov.lk', 'Documents pending verification', '8 documents awaiting verification across 3 applications.', 'Verification', '2 hours'],
    ['inbox', 'Vista Office Supplies', 'vistaofficesupplies@vendor.lk', 'Enquiry: status of our application', 'Kindly update us on the progress of our supplier application.', 'General', '4 hours'],
    ['inbox', 'Priya Silva', 'priya@procurement.gov.lk', 'Compliance report ready', 'The June compliance report has been generated and is ready to download.', 'Report', 'Yesterday'],
    ['inbox', 'TechNova Solutions', 'technovasolutions@vendor.lk', 'Re: Invoice payment', 'We have received the payment. Thank you for the swift settlement.', 'Billing', 'Yesterday'],
    ['sent', 'Kamal Perera', 'kamal@procurement.gov.lk', 'Approval notification sent', 'Approval emails dispatched to 6 approved suppliers.', 'Approval', '3 hours'],
    ['sent', 'Kamal Perera', 'kamal@procurement.gov.lk', 'Request for additional documents', 'Requested updated certificates from 4 suppliers.', 'Verification', '1 day'],
    ['drafts', 'Kamal Perera', 'kamal@procurement.gov.lk', 'Re: Category expansion notice', 'Draft announcement for the new packaging category.', 'Announcement', '1 day'],
    ['sent', 'Nimal Fernando', 'nimal@procurement.gov.lk', 'Ticket reply: Resubmission', 'Replied to ticket TS-0008 with re-upload instructions.', 'Support', '2 days'],
    ['inbox', 'Security Alert', 'alerts@system.local', 'New login from new device', 'A new device signed in to the admin console. If this was not you, review recent activity.', 'Security', '30 min'],
  ]
  for (const [folder, sender, senderEmail, subject, preview, tag, time] of mails) {
    run(
      `INSERT INTO mail_messages (folder, sender, sender_email, subject, preview, tag, time, unread, starred, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now', '-1 day'))`,
      [folder, sender, senderEmail, subject, preview, tag, time, folder === 'inbox' && sender !== 'Kamal Perera' && sender !== 'Security Alert' ? 1 : 0],
    )
  }

  // Admin notifications (drive the 12-badge)
  const adminNotifs = [
    ['New application received', 'EcoWash Solutions submitted a new application.', 'application', 'high'],
    ['Application approved', 'TechNova Solutions has been approved as a strategic vendor.', 'approval', 'high'],
    ['Document expiring soon', '3 certificates expiring within the next 30 days.', 'document', 'medium'],
    ['New support ticket', 'A high-priority ticket was raised by Vista Office Supplies.', 'ticket', 'high'],
    ['Pending review', '5 applications awaiting your review.', 'application', 'medium'],
    ['Supplier blacklisted', 'GlobalTrade Imports has been added to the blacklist.', 'alert', 'high'],
    ['Performance review due', 'Q2 2026 performance reviews are due next week.', 'performance', 'medium'],
    ['New user registered', 'A new supplier account was created.', 'account', 'low'],
    ['Report generated', 'Spend Analysis Q2 2026 is ready to download.', 'report', 'low'],
    ['Compliance alert', '2 suppliers have expired certifications.', 'alert', 'high'],
    ['Password change', 'Your password was changed 5 days ago.', 'security', 'low'],
    ['System update', 'Scheduled maintenance on Sunday 2 AM.', 'system', 'low'],
  ]
  for (const [title, description, type, priority] of adminNotifs) {
    run('INSERT INTO admin_notifications (title, description, type, priority, is_read) VALUES (?, ?, ?, ?, 0)', [title, description, type, priority])
  }

  // Blacklist entries
  const blacklist = [
    ['GlobalTrade Imports', 'SRS-BLK-001', 'Misrepresentation of financial documents', 'High', 'Kamal Perera', 'Never', '+94 11 555 2233'],
    ['QuickFix Services', 'SRS-BLK-002', 'Consistent late deliveries', 'Medium', 'Priya Silva', 'After 12 months', '+94 11 555 4477'],
    ['PrimeBuild Materials', 'SRS-BLK-003', 'Quality non-compliance', 'Medium', 'Nimal Fernando', 'After 6 months', '+94 11 555 9911'],
  ]
  for (const [company, code, reason, severity, by, reapply, contact] of blacklist) {
    run('INSERT INTO blacklist (company, code, reason, severity, listed_by, reapply, contact, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      company, code, reason, severity, by, reapply, contact, 'listed',
    ])
  }

  // Audit logs
  const auditRows = [
    ['login', 'auth', 'admin', 'Signed in'],
    ['create', 'application', 'SRS-APP-1031', 'New application received'],
    ['status', 'application', 'SRS-APP-1012', 'Status changed to approved'],
    ['document', 'document', 'ISO 9001 Certificate', 'Document verified'],
    ['reply', 'ticket', 'TS-0008', 'Replied to ticket'],
    ['add', 'blacklist', 'GlobalTrade Imports', 'Listed: Misrepresentation'],
    ['assign', 'application', 'SRS-APP-1022', 'Assigned to Nimal Fernando'],
    ['status', 'application', 'SRS-APP-1004', 'Status changed to rejected'],
    ['document', 'document', 'Audited Financials', 'Document rejected'],
    ['update', 'settings', 'settings', 'Updated notification preferences'],
    ['create', 'application', 'SRS-APP-1032', 'New application received'],
    ['status', 'application', 'SRS-APP-1019', 'Status changed to verification'],
    ['reinstate', 'blacklist', 'PrimeBuild Materials', 'Reinstated (full)'],
    ['reply', 'ticket', 'TS-0003', 'Replied to ticket'],
    ['document', 'document', 'Public Liability Insurance', 'Document verified'],
  ]
  const usersByAction = { login: 'kamal@procurement.gov.lk', create: 'kamal@procurement.gov.lk', status: 'nimal@procurement.gov.lk', document: 'nimal@procurement.gov.lk', reply: 'kamal@procurement.gov.lk', add: 'kamal@procurement.gov.lk', assign: 'nimal@procurement.gov.lk', update: 'kamal@procurement.gov.lk', reinstate: 'priya@procurement.gov.lk' }
  for (const [action, module, entity, detail] of auditRows) {
    run('INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success) VALUES (?, ?, ?, ?, ?, ?, ?, 1)', [
      usersByAction[action], 'Admin', action, module, entity, '192.168.1.' + (2 + Math.floor(Math.random() * 50)), detail,
    ])
  }

  // System settings defaults
  const settings = {
    company_name: 'Procurement Department',
    support_email: 'support@procurement.gov.lk',
    session_timeout: '60',
    data_retention: '7',
    date_format: 'dd/MM/yyyy',
    timezone: 'Asia/Colombo',
    notif_email: 'true', notif_inApp: 'true', notif_digest: 'false',
    notif_applicationUpdates: 'true', notif_documentUpdates: 'true',
    notif_ticketUpdates: 'true', notif_securityAlerts: 'true',
    sec_twoFactor: 'true', sec_passwordPolicy: 'Strong', sec_sessionTimeout: '60',
    sec_ipWhitelist: 'false', sec_auditLogs: 'true',
    backup_autoBackup: 'true', backup_frequency: 'Daily', backup_retention: '30',
  }
  for (const [key, value] of Object.entries(settings)) {
    run('INSERT INTO system_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [key, value])
  }
}

console.log('[seed] done')
