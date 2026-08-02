import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { get, run } from '../db.js'
import { requireAdmin, signToken } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()

const OTP_LOCKOUT_ATTEMPTS = 3
const OTP_LOCKOUT_MS = 30 * 60 * 1000

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1'
}

function auditLog(user, role, action, module, entity, detail, ip, success = 1) {
  run(
    `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user, role, action, module, entity, ip, detail, success],
  )
}

function publicAdmin(admin) {
  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.full_name,
    role: admin.role,
    phoneMasked: admin.phone_masked,
    emailMasked: admin.email_masked,
    status: admin.status,
    lastLogin: admin.last_login,
  }
}

// Step 1: email + password
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const email = cleanText(req.body.email || '').toLowerCase()
    const password = req.body.password || ''
    const ip = clientIp(req)

    const admin = get('SELECT * FROM admin_users WHERE email = ?', [email])

    if (admin && admin.locked_until && new Date(admin.locked_until) > new Date()) {
      auditLog(admin.email, admin.role, 'login', 'auth', 'admin', 'Login blocked (locked)', ip, 0)
      return res.status(423).json({ error: 'Account temporarily locked. Try again later.' })
    }

    const ok = admin && (await bcrypt.compare(password, admin.password_hash))

    if (!ok) {
      const attempts = (admin ? admin.failed_attempts : 0) + 1
      let lockedUntil = null
      if (admin && attempts >= OTP_LOCKOUT_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + OTP_LOCKOUT_MS).toISOString()
      }
      if (admin) {
        run('UPDATE admin_users SET failed_attempts = ?, locked_until = ? WHERE id = ?', [
          attempts,
          lockedUntil,
          admin.id,
        ])
      }
      auditLog(admin ? admin.email : email, admin ? admin.role : 'Admin', 'login', 'auth', 'admin', 'Invalid credentials', ip, 0)
      return res.status(401).json({
        error: 'Invalid email or password',
        attemptsRemaining: admin ? Math.max(0, OTP_LOCKOUT_ATTEMPTS - attempts) : OTP_LOCKOUT_ATTEMPTS,
      })
    }

    run('UPDATE admin_users SET failed_attempts = 0, locked_until = NULL WHERE id = ?', [admin.id])
    auditLog(admin.email, admin.role, 'login', 'auth', 'admin', 'Password verified, awaiting 2FA', ip, 1)
    res.json({ requiresOtp: true, message: 'Password verified. Enter the 6-digit verification code.', admin: publicAdmin(admin) })
  }),
)

// Step 2: 2FA code (OTP)
router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    const email = cleanText(req.body.email || '').toLowerCase()
    const otp = cleanText(req.body.otp || '')
    const ip = clientIp(req)

    const admin = get('SELECT * FROM admin_users WHERE email = ?', [email])
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' })

    if (!admin.otp_code || otp !== admin.otp_code) {
      auditLog(admin.email, admin.role, '2fa', 'auth', 'admin', 'Invalid verification code', ip, 0)
      return res.status(401).json({ error: 'Invalid verification code' })
    }

    run('UPDATE admin_users SET last_login = datetime(\'now\') WHERE id = ?', [admin.id])
    auditLog(admin.email, admin.role, '2fa', 'auth', 'admin', 'Signed in', ip, 1)

    const token = signToken(admin)
    res.json({ token, admin: publicAdmin(admin) })
  }),
)

router.get(
  '/me',
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ admin: publicAdmin(req.admin) })
  }),
)

router.post(
  '/logout',
  requireAdmin,
  asyncHandler(async (req, res) => {
    auditLog(req.admin.email, req.admin.role, 'logout', 'auth', 'admin', 'Signed out', clientIp(req), 1)
    res.json({ message: 'Signed out' })
  }),
)

export default router
