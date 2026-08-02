const API_BASE = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'srs_token'
const USER_KEY = 'srs_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  let payload
  if (body instanceof FormData) {
    payload = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(API_BASE + path, { method, headers, body: payload })
  } catch {
    throw new Error('Unable to reach the server. Is the backend running?')
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
    throw err
  }
  return data
}

export const api = {
  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

  // application
  application: () => request('/application'),
  saveStep: (stepNumber, data) => request(`/application/step/${stepNumber}`, { method: 'PUT', body: { data } }),
  submitApplication: () => request('/application/submit', { method: 'POST' }),
  patchApplication: (body) => request('/application', { method: 'PATCH', body }),

  // company
  company: () => request('/company'),
  companyOverview: (body) => request('/company/overview', { method: 'PUT', body }),
  companyBasic: (body) => request('/company/basic', { method: 'PUT', body }),
  companyCertifications: (certifications) => request('/company/certifications', { method: 'PUT', body: { certifications } }),
  companySignatories: (signatories) => request('/company/signatories', { method: 'PUT', body: { signatories } }),
  uploadLogo: (formData) => request('/company/logo', { method: 'POST', body: formData }),

  // documents
  documents: () => request('/documents'),
  uploadDocument: (formData) => request('/documents/upload', { method: 'POST', body: formData }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: 'DELETE' }),
  downloadUrl: (id) => `${API_BASE}/documents/${id}/download`,

  // notifications
  notifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  readAllNotifications: () => request('/notifications/read-all', { method: 'PATCH' }),

  // tickets
  tickets: () => request('/tickets'),
  createTicket: (body) => request('/tickets', { method: 'POST', body }),
  ticket: (id) => request(`/tickets/${id}`),
  replyTicket: (id, body) => request(`/tickets/${id}/messages`, { method: 'POST', body }),

  // search
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
}

export default api
