import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { get } from '../db.js'

export function signToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email, role: 'admin' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret)
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    const admin = get('SELECT * FROM admin_users WHERE id = ?', [payload.sub])
    if (!admin || admin.status !== 'active') {
      return res.status(401).json({ error: 'Account is disabled or does not exist' })
    }
    req.admin = admin
    req.token = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
