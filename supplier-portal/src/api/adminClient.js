const ADMIN_API_BASE = '/api/admin'
const ADMIN_TOKEN_KEY = 'srs_admin_token'
const ADMIN_USER_KEY = 'srs_admin_user'

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token)
  else localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_KEY))
  } catch {
    return null
  }
}

export function setAdminUser(user) {
  if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(ADMIN_USER_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (auth) {
    const token = getAdminToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  let payload
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(ADMIN_API_BASE + path, { method, headers, body: payload })
  } catch {
    throw new Error('Unable to reach the admin server. Is the backend running?')
  }

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const adminApi = {
  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: { email, otp }, auth: false }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // dashboard
  stats: () => request('/dashboard/stats'),
  registrationTrend: () => request('/dashboard/registration-trend'),
  categoryDistribution: () => request('/dashboard/category-distribution'),
  pendingApplications: () => request('/dashboard/pending-applications'),
  activity: () => request('/dashboard/activity'),
  expirySummary: () => request('/dashboard/expiry-summary'),
  tasks: () => request('/dashboard/tasks'),

  // applications
  applications: (params = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/applications${qs ? '?' + qs : ''}`)
  },
  application: (id) => request(`/applications/${id}`),
  setApplicationStatus: (id, status, note) => request(`/applications/${id}/status`, { method: 'PATCH', body: { status, note } }),
  assignApplication: (id, assignee) => request(`/applications/${id}/assign`, { method: 'POST', body: { assignee } }),

  // suppliers
  suppliers: (params = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/suppliers${qs ? '?' + qs : ''}`)
  },
  supplier: (id) => request(`/suppliers/${id}`),

  // documents
  documents: (params = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/documents${qs ? '?' + qs : ''}`)
  },
  setDocumentStatus: (id, status, note) => request(`/documents/${id}/status`, { method: 'PATCH', body: { status, note } }),

  // tickets
  tickets: (params = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/tickets${qs ? '?' + qs : ''}`)
  },
  ticket: (id) => request(`/tickets/${id}`),
  replyTicket: (id, body) => request(`/tickets/${id}/reply`, { method: 'POST', body }),
  updateTicketStatus: (id, status) => request(`/tickets/${id}/status`, { method: 'PATCH', body: { status } }),

  // notifications
  notifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  readAllNotifications: () => request('/notifications/read-all', { method: 'PATCH' }),

  // audit / blacklist / performance / reports / communications / settings
  auditLogs: (params = {}) => {
    const q = new URLSearchParams()
    if (params.module) q.set('module', params.module)
    if (params.user) q.set('user', params.user)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/audit-logs${qs ? '?' + qs : ''}`)
  },
  blacklist: (params = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/blacklist${qs ? '?' + qs : ''}`)
  },
  addBlacklist: (body) => request('/blacklist', { method: 'POST', body }),
  reinstateBlacklist: (id, type) => request(`/blacklist/${id}/reinstate`, { method: 'PATCH', body: { type } }),
  performance: () => request('/performance'),
  reports: () => request('/reports'),
  mail: (params = {}) => {
    const q = new URLSearchParams()
    if (params.folder) q.set('folder', params.folder)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return request(`/mail${qs ? '?' + qs : ''}`)
  },
  templates: () => request('/templates'),
  campaigns: () => request('/campaigns'),
  commStats: () => request('/stats'),
  settings: () => request('/settings'),
  updateGeneralSettings: (body) => request('/settings/general', { method: 'PUT', body }),
  updateNotificationPrefs: (body) => request('/settings/notifications', { method: 'PUT', body }),
  updateSecurityPolicy: (body) => request('/settings/security', { method: 'PUT', body }),
  updateBackupPrefs: (body) => request('/settings/backup', { method: 'PUT', body }),
  createCategory: (name) => request('/settings/categories', { method: 'POST', body: { name } }),
  updateCategory: (id, body) => request(`/settings/categories/${id}`, { method: 'PUT', body }),
  updateWorkflow: (id, body) => request(`/settings/workflow/${id}`, { method: 'PUT', body }),
  updateManagedUserStatus: (id, status) => request(`/settings/users/${id}/status`, { method: 'PUT', body: { status } }),
}

export default adminApi
