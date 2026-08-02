import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler, cleanText } from '../utils/helpers.js'

const router = Router()

router.use(requireAdmin)

function setSetting(key, value) {
  run('INSERT INTO system_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [
    key,
    String(value),
  ])
}

function getSetting(key, fallback = null) {
  return get('SELECT value FROM system_settings WHERE key = ?', [key])?.value ?? fallback
}

function section(prefix, defaults) {
  const out = { ...defaults }
  for (const key of Object.keys(defaults)) {
    const stored = getSetting(prefix + key)
    if (stored !== null) out[key] = stored === 'true' ? true : stored === 'false' ? false : stored
  }
  return out
}

function audit(user, role, action, detail) {
  run(
    `INSERT INTO audit_logs (user, role, action, module, entity, ip, detail, success)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [user, role, action, 'settings', 'settings', '127.0.0.1', detail],
  )
}

router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    const general = section('general_', {
      companyName: getSetting('company_name', 'Procurement Department'),
      systemName: 'Supplier Registration System',
      supportEmail: getSetting('support_email', 'support@procurement.gov.lk'),
      sessionTimeout: getSetting('session_timeout', '60'),
      dataRetention: getSetting('data_retention', '7'),
      dateFormat: getSetting('date_format', 'dd/MM/yyyy'),
      timezone: getSetting('timezone', 'Asia/Colombo'),
    })

    const categories = all('SELECT * FROM categories ORDER BY name')
    const users = all('SELECT * FROM admin_users_managed ORDER BY name')
    const workflow = all('SELECT * FROM workflow_stages ORDER BY id')

    res.json({
      general,
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        active: c.active === 1,
        suppliers: c.suppliers || 0,
        products: c.products || '—',
      })),
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        lastLogin: u.last_login || '—',
      })),
      workflow: workflow.map((w) => ({
        id: w.id,
        stage: w.stage,
        assignee: w.assignee,
        sla: w.sla,
        active: w.active === 1,
      })),
      sla: section('sla_', {
        default: getSetting('sla_default', '7'),
        high: getSetting('sla_high', '3'),
        overdue: getSetting('sla_overdue', '7'),
      }),
      notifications: section('notif_', {
        email: true,
        inApp: true,
        digest: false,
        applicationUpdates: true,
        documentUpdates: true,
        ticketUpdates: true,
        securityAlerts: true,
      }),
      security: section('sec_', {
        twoFactor: true,
        passwordPolicy: getSetting('sec_password_policy', 'Strong'),
        sessionTimeout: getSetting('sec_session_timeout', '60'),
        ipWhitelist: false,
        auditLogs: true,
      }),
      backup: section('backup_', {
        autoBackup: true,
        frequency: getSetting('backup_frequency', 'Daily'),
        retention: getSetting('backup_retention', '30'),
      }),
    })
  }),
)

router.put(
  '/settings/general',
  asyncHandler(async (req, res) => {
    for (const [key, value] of Object.entries(req.body || {})) {
      if (key === 'systemName') continue
      setSetting('general_' + key, value)
      if (key === 'companyName') setSetting('company_name', value)
      if (key === 'supportEmail') setSetting('support_email', value)
      if (key === 'sessionTimeout') setSetting('session_timeout', value)
    }
    audit(req.admin.email, req.admin.role, 'update', 'Updated general settings')
    res.json({ message: 'Settings updated' })
  }),
)

router.post(
  '/settings/categories',
  asyncHandler(async (req, res) => {
    const name = cleanText(req.body.name)
    if (!name) return res.status(400).json({ error: 'Category name is required' })
    run('INSERT INTO categories (name, active, suppliers, products) VALUES (?, 1, 0, ?)', [name, '—'])
    audit(req.admin.email, req.admin.role, 'create', `Created category ${name}`)
    res.json({ message: 'Category created' })
  }),
)

router.put(
  '/settings/categories/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const current = get('SELECT * FROM categories WHERE id = ?', [id])
    if (!current) return res.status(404).json({ error: 'Category not found' })
    run('UPDATE categories SET active = ?, suppliers = ?, products = ? WHERE id = ?', [
      req.body.active === undefined ? current.active : req.body.active ? 1 : 0,
      req.body.suppliers ?? current.suppliers,
      req.body.products ?? current.products,
      id,
    ])
    audit(req.admin.email, req.admin.role, 'update', `Updated category ${current.name}`)
    res.json({ message: 'Category updated' })
  }),
)

router.put(
  '/settings/workflow/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const current = get('SELECT * FROM workflow_stages WHERE id = ?', [id])
    if (!current) return res.status(404).json({ error: 'Stage not found' })
    run('UPDATE workflow_stages SET assignee = ?, sla = ?, active = ? WHERE id = ?', [
      req.body.assignee ?? current.assignee,
      req.body.sla ?? current.sla,
      req.body.active === undefined ? current.active : req.body.active ? 1 : 0,
      id,
    ])
    audit(req.admin.email, req.admin.role, 'update', `Updated workflow stage ${current.stage}`)
    res.json({ message: 'Workflow updated' })
  }),
)

router.put(
  '/settings/users/:id/status',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const current = get('SELECT * FROM admin_users_managed WHERE id = ?', [id])
    if (!current) return res.status(404).json({ error: 'User not found' })
    const status = cleanText(req.body.status)
    if (!['active', 'inactive'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
    run('UPDATE admin_users_managed SET status = ? WHERE id = ?', [status, id])
    audit(req.admin.email, req.admin.role, 'update', `Set ${current.name} status to ${status}`)
    res.json({ message: 'User updated' })
  }),
)

router.put(
  '/settings/notifications',
  asyncHandler(async (req, res) => {
    for (const [key, value] of Object.entries(req.body || {})) setSetting('notif_' + key, value === true || value === 'true' ? 'true' : 'false')
    audit(req.admin.email, req.admin.role, 'update', 'Updated notification preferences')
    res.json({ message: 'Notification preferences updated' })
  }),
)

router.put(
  '/settings/security',
  asyncHandler(async (req, res) => {
    for (const [key, value] of Object.entries(req.body || {})) setSetting('sec_' + key, value === true || value === 'true' ? 'true' : 'false')
    audit(req.admin.email, req.admin.role, 'update', 'Updated security policy')
    res.json({ message: 'Security policy updated' })
  }),
)

router.put(
  '/settings/backup',
  asyncHandler(async (req, res) => {
    for (const [key, value] of Object.entries(req.body || {})) {
      if (key === 'frequency') setSetting('backup_frequency', value)
      else if (key === 'retention') setSetting('backup_retention', value)
      else setSetting('backup_' + key, value === true || value === 'true' ? 'true' : 'false')
    }
    audit(req.admin.email, req.admin.role, 'update', 'Updated backup preferences')
    res.json({ message: 'Backup preferences updated' })
  }),
)

export default router
