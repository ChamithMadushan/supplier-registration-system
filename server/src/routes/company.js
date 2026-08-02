import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'
import { get, run, all, tx } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'
import { config } from '../config.js'

const router = Router()
router.use(requireAuth)

const LOGO_DIR = path.join(config.uploads.dir, 'company')
fs.mkdirSync(LOGO_DIR, { recursive: true })

const ALLOWED_IMG = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const logoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, LOGO_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png'
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`)
  },
})

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMG.has(file.mimetype)) {
      const err = new Error('Unsupported image type. Allowed: JPG, PNG, WEBP, GIF')
      err.status = 400
      return cb(err)
    }
    cb(null, true)
  },
})

function companyPayload(c) {
  if (!c) return null
  return {
    id: c.id,
    legalName: c.legal_name,
    tradingName: c.trading_name,
    brn: c.brn,
    businessType: c.business_type,
    incorporationDate: c.incorporation_date,
    boiNumber: c.boi_number,
    employeeCount: c.employee_count,
    logo: c.logo_path,
    regAddress1: c.reg_address_1,
    regAddress2: c.reg_address_2,
    regCity: c.reg_city,
    regDistrict: c.reg_district,
    regProvince: c.reg_province,
    regPostalCode: c.reg_postal_code,
    mapsLink: c.maps_link,
    busAddress1: c.bus_address_1,
    busAddress2: c.bus_address_2,
    busCity: c.bus_city,
    busDistrict: c.bus_district,
    busProvince: c.bus_province,
    busPostalCode: c.bus_postal_code,
    phone: c.phone,
    fax: c.fax,
    email: c.email,
    website: c.website,
    contactPerson: c.contact_person,
    contactDesignation: c.contact_designation,
    about: c.about,
    specializations: c.specializations,
  }
}

// GET /api/company
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    const company = app && app.company_id ? get('SELECT * FROM companies WHERE id = ?', [app.company_id]) : null
    const financials = get('SELECT * FROM financials WHERE user_id = ?', [req.user.id])
    const insurance = all('SELECT * FROM insurance WHERE user_id = ?', [req.user.id])
    const customers = all('SELECT * FROM references_list WHERE user_id = ? AND kind = \'customer\'', [req.user.id])
    const suppliers = all('SELECT * FROM references_list WHERE user_id = ? AND kind = \'supplier\'', [req.user.id])
    const certifications = all('SELECT * FROM company_certifications WHERE user_id = ?', [req.user.id])
    const signatories = all('SELECT * FROM signatories WHERE user_id = ?', [req.user.id])
    res.json({
      company: companyPayload(company),
      financials,
      insurance,
      customers,
      suppliers,
      certifications,
      signatories,
    })
  }),
)

// PUT /api/company/overview  (about / specializations)
router.put(
  '/overview',
  asyncHandler(async (req, res) => {
    const { about, specializations } = req.body || {}
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app || !app.company_id) return res.status(400).json({ error: 'Save company details first' })
    run(
      'UPDATE companies SET about = ?, specializations = ?, updated_at = datetime(\'now\') WHERE id = ?',
      [about || null, Array.isArray(specializations) ? JSON.stringify(specializations) : specializations || null, app.company_id],
    )
    res.json({ message: 'Company overview updated', company: companyPayload(get('SELECT * FROM companies WHERE id = ?', [app.company_id])) })
  }),
)

// PUT /api/company/basic  (basic + contact information)
router.put(
  '/basic',
  asyncHandler(async (req, res) => {
    const b = req.body || {}
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app || !app.company_id) return res.status(400).json({ error: 'Save company details first' })

    const fields = {
      legal_name: b.legalName || null,
      trading_name: b.tradingName || null,
      brn: b.brn || null,
      business_type: b.businessType || null,
      incorporation_date: b.incorporationDate || null,
      boi_number: b.boiNumber || null,
      employee_count: b.employeeCount || null,
      phone: b.phone || null,
      fax: b.fax || null,
      email: b.email || null,
      website: b.website || null,
      reg_address_1: b.regAddress1 || null,
      reg_address_2: b.regAddress2 || null,
      reg_city: b.regCity || null,
      reg_district: b.regDistrict || null,
      reg_province: b.regProvince || null,
      reg_postal_code: b.regPostalCode || null,
      bus_address_1: b.busAddress1 || null,
      bus_address_2: b.busAddress2 || null,
      bus_city: b.busCity || null,
      bus_district: b.busDistrict || null,
      bus_province: b.busProvince || null,
      bus_postal_code: b.busPostalCode || null,
      maps_link: b.mapsLink || null,
      contact_person: b.contactPerson || null,
      contact_designation: b.contactDesignation || null,
    }
    const sets = Object.keys(fields).map((k) => `${k} = ?`)
    run(
      `UPDATE companies SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`,
      [...Object.values(fields), app.company_id],
    )

    res.json({
      message: 'Company basic information updated',
      company: companyPayload(get('SELECT * FROM companies WHERE id = ?', [app.company_id])),
    })
  }),
)

// PUT /api/company/signatories  (body: { signatories: [{ name, designation, nic, isPrimary }] })
router.put(
  '/signatories',
  asyncHandler(async (req, res) => {
    const { signatories } = req.body || {}
    if (!Array.isArray(signatories)) return res.status(400).json({ error: 'signatories must be an array' })

    const rows = signatories
      .filter((s) => s && s.name)
      .map((s, i) => ({
        name: s.name.trim(),
        designation: s.designation || null,
        nic: s.nic || null,
        isPrimary: !!s.isPrimary || i === 0 ? 1 : 0,
      }))

    tx(() => {
      run('DELETE FROM signatories WHERE user_id = ?', [req.user.id])
      rows.forEach((r) => {
        run(
          `INSERT INTO signatories (user_id, name, designation, nic, is_primary, declared, declared_at)
           VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`,
          [req.user.id, r.name, r.designation, r.nic, r.isPrimary],
        )
      })
    })

    res.json({
      message: 'Directors & signatories updated',
      signatories: all('SELECT * FROM signatories WHERE user_id = ? ORDER BY is_primary DESC, id', [req.user.id]),
    })
  }),
)

// POST /api/company/logo  (multipart: file) — upload company profile picture
router.post(
  '/logo',
  uploadLogo.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    if (!app || !app.company_id) return res.status(400).json({ error: 'Save company details first' })

    const rel = path.join('api', 'uploads', 'company', req.file.filename).split(path.sep).join('/')

    const prev = get('SELECT logo_path FROM companies WHERE id = ?', [app.company_id])
    if (prev && prev.logo_path) {
      const prevFile = path.join(config.uploads.dir, ...prev.logo_path.split('/').slice(2))
      if (fs.existsSync(prevFile)) {
        try {
          fs.unlinkSync(prevFile)
        } catch {
          /* ignore cleanup failure */
        }
      }
    }

    run('UPDATE companies SET logo_path = ?, updated_at = datetime(\'now\') WHERE id = ?', [rel, app.company_id])
    res.json({
      message: 'Profile picture updated',
      company: companyPayload(get('SELECT * FROM companies WHERE id = ?', [app.company_id])),
    })
  }),
)

// PUT /api/company/certifications  (body: { certifications: [...] })
router.put(
  '/certifications',
  asyncHandler(async (req, res) => {
    const { certifications } = req.body || {}
    if (!Array.isArray(certifications)) return res.status(400).json({ error: 'certifications must be an array' })
    run('DELETE FROM company_certifications WHERE user_id = ?', [req.user.id])
    certifications.forEach((c) => {
      if (!c || !c.name) return
      run(
        `INSERT INTO company_certifications (user_id, name, issuer, cert_number, issue_date, expiry_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, c.name, c.issuer || null, c.certNumber || null, c.issueDate || null, c.expiryDate || null],
      )
    })
    res.json({ message: 'Certifications saved' })
  }),
)

export default router
