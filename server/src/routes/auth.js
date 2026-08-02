import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { get, run, tx } from '../db.js'
import { requireAuth, signToken } from '../middleware/auth.js'
import { asyncHandler, emailValid, passwordValid, genReferenceNo, cleanText } from '../utils/helpers.js'
import { applicationPayload } from './application.js'

const router = Router()

const REFERENCE_SEED = 1000

function createApplication(userId, companyId = null) {
  const existing = get('SELECT id FROM applications WHERE user_id = ?', [userId])
  if (existing) return existing

  const count = get('SELECT COUNT(*) AS total FROM applications').total
  const referenceNo = genReferenceNo(REFERENCE_SEED + count)
  const result = run('INSERT INTO applications (reference_no, user_id, company_id, status) VALUES (?, ?, ?, ?)', [
    referenceNo,
    userId,
    companyId,
    'in_progress',
  ])
  const appId = result.lastInsertRowid
  for (let step = 1; step <= 6; step += 1) {
    run('INSERT INTO application_steps (application_id, step_number) VALUES (?, ?)', [appId, step])
  }
  return get('SELECT * FROM applications WHERE id = ?', [appId])
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    designation: user.designation,
    mobile: user.mobile,
    altPhone: user.alt_phone,
    language: user.language,
    emailVerified: !!user.email_verified,
    status: user.status,
    createdAt: user.created_at,
  }
}

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, fullName, designation, mobile, altPhone, language } = req.body || {}

    if (!emailValid(email)) return res.status(400).json({ error: 'A valid email is required' })
    if (!passwordValid(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters, with an uppercase letter, a number and a special character',
      })
    }
    if (!cleanText(fullName) || !cleanText(designation)) {
      return res.status(400).json({ error: 'Full name and designation are required' })
    }

    const existing = get('SELECT id FROM users WHERE lower(email) = lower(?)', [email])
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' })

    const hash = bcrypt.hashSync(password, 10)

    const user = tx(() => {
      const result = run(
        `INSERT INTO users (email, password_hash, full_name, designation, mobile, alt_phone, language, email_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [email.trim(), hash, cleanText(fullName), cleanText(designation), cleanText(mobile), cleanText(altPhone), language || 'English'],
      )
      const userId = result.lastInsertRowid
      const app = createApplication(userId)
      run(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, 'Welcome to the Supplier Portal', ?, 'success')`,
        [userId, `Your application ${app.reference_no} has been created. Continue to Step 2 to add your company details.`],
      )
      return userId
    })

    const created = get('SELECT * FROM users WHERE id = ?', [user])
    const app = get('SELECT * FROM applications WHERE user_id = ?', [user])
    res.status(201).json({
      message: 'Account created successfully',
      token: signToken(created),
      user: publicUser(created),
      application: applicationPayload(app),
    })
  }),
)

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

    const user = get('SELECT * FROM users WHERE lower(email) = lower(?)', [email])
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    if (user.status !== 'active') return res.status(403).json({ error: 'This account has been disabled' })

    const app = get('SELECT * FROM applications WHERE user_id = ?', [user.id])
    const company = app && app.company_id ? get('SELECT * FROM companies WHERE id = ?', [app.company_id]) : null
    res.json({
      message: 'Login successful',
      token: signToken(user),
      user: publicUser(user),
      application: applicationPayload(app),
      company,
    })
  }),
)

// GET /api/auth/me
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const app = get('SELECT * FROM applications WHERE user_id = ?', [req.user.id])
    const company = app && app.company_id ? get('SELECT * FROM companies WHERE id = ?', [app.company_id]) : null
    res.json({ user: publicUser(req.user), application: applicationPayload(app), company })
  }),
)

// POST /api/auth/change-password
router.post(
  '/change-password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {}
    if (!bcrypt.compareSync(currentPassword || '', req.user.password_hash)) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }
    if (!passwordValid(newPassword)) {
      return res.status(400).json({ error: 'New password does not meet the requirements' })
    }
    run('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?', [
      bcrypt.hashSync(newPassword, 10),
      req.user.id,
    ])
    res.json({ message: 'Password updated successfully' })
  }),
)

export default router
