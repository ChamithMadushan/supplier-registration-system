import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { get } from '../db.js'

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role || 'supplier' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret)
    const user = get('SELECT * FROM users WHERE id = ?', [payload.sub])
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Account is disabled or does not exist' })
    }
    req.user = user
    req.token = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
