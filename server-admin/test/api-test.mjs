import assert from 'node:assert/strict'
import app from '../src/app.js'
import { initDb } from '../src/db.js'

const port = 4321
const base = `http://127.0.0.1:${port}/api/admin`

let passed = 0
let failed = 0

function ok(cond, label) {
  if (cond) {
    passed++
    console.log(`  ✓ ${label}`)
  } else {
    failed++
    console.error(`  ✗ ${label}`)
  }
}

async function req(method, path, body, token) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(base + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let json = null
  try {
    json = await res.json()
  } catch {
    /* no body */
  }
  return { status: res.status, json }
}

let server
let token

initDb()

server = await new Promise((resolve) => {
  const s = app.listen(port, () => resolve(s))
})

try {
  console.log('\nAUTH')
  let r = await req('GET', '/auth/me')
  ok(r.status === 401, 'me without token → 401')

  r = await req('POST', '/auth/login', { email: 'admin@company.lk', password: 'wrongpass' })
  ok(r.status === 401 && r.json.attemptsRemaining !== undefined, 'wrong password → 401 with attemptsRemaining')

  r = await req('POST', '/auth/login', { email: 'admin@company.lk', password: 'admin123' })
  ok(r.status === 200 && r.json.requiresOtp === true, 'correct password → requires OTP')

  r = await req('POST', '/auth/verify-otp', { email: 'admin@company.lk', otp: '000000' })
  ok(r.status === 401, 'wrong OTP → 401')

  r = await req('POST', '/auth/verify-otp', { email: 'admin@company.lk', otp: '482000' })
  ok(r.status === 200 && r.json.token && r.json.admin.fullName === 'Kamal Perera', 'correct OTP → token + admin')
  token = r.json.token

  r = await req('GET', '/auth/me', undefined, token)
  ok(r.status === 200 && r.json.admin.role === 'Procurement Manager', 'me with token → admin profile')

  console.log('\nDASHBOARD')
  r = await req('GET', '/dashboard/stats', undefined, token)
  ok(r.status === 200 && typeof r.json.stats.registered === 'number', 'dashboard stats')
  ok(r.json.stats.pending > 0, 'dashboard has pending applications')
  r = await req('GET', '/dashboard/registration-trend', undefined, token)
  ok(r.status === 200 && r.json.data.length === 12, 'registration trend has 12 months')
  r = await req('GET', '/dashboard/category-distribution', undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.data), 'category distribution')
  r = await req('GET', '/dashboard/pending-applications', undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.data), 'pending applications list')
  r = await req('GET', '/dashboard/activity', undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.data), 'activity feed')
  r = await req('GET', '/dashboard/tasks', undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.tasks), 'tasks')

  console.log('\nAPPLICATIONS')
  r = await req('GET', '/applications', undefined, token)
  ok(r.status === 200 && r.json.statusTabs.length === 12, 'applications list + 12 status tabs')
  ok(r.json.data.length > 0, 'applications rows present')
  const appRow = r.json.data.find((a) => a.ref.startsWith('SRS-APP')) || r.json.data[0]
  const appId = appRow.id
  r = await req('GET', `/applications/${appId}`, undefined, token)
  ok(r.status === 200 && r.json.application.ref && Array.isArray(r.json.documents), 'application detail')
  ok(Array.isArray(r.json.criteria) && r.json.criteria.length === 5, 'application has 5 criteria')
  r = await req('PATCH', `/applications/${appId}/status`, { status: 'verification' }, token)
  ok(r.status === 200, 'application status update')
  r = await req('POST', `/applications/${appId}/assign`, { assignee: 'Nimal Fernando' }, token)
  ok(r.status === 200, 'application assign')
  r = await req('GET', '/applications?status=verification', undefined, token)
  ok(r.status === 200 && r.json.data.some((a) => a.id === appId), 'status filter works')

  console.log('\nSUPPLIERS')
  r = await req('GET', '/suppliers', undefined, token)
  ok(r.status === 200 && r.json.data.length > 0, 'suppliers list')
  const supplierId = r.json.data[0].id
  r = await req('GET', `/suppliers/${supplierId}`, undefined, token)
  ok(r.status === 200 && r.json.supplier.code && r.json.hero.score >= 0, 'supplier detail')
  ok(Array.isArray(r.json.orders), 'supplier orders')

  console.log('\nDOCUMENTS')
  r = await req('GET', '/documents', undefined, token)
  ok(r.status === 200 && r.json.tabs.length === 7 && r.json.data.length > 0, 'documents list + 7 tabs')
  const docRow = r.json.data.find((d) => d.fileName.startsWith('demo_')) || r.json.data[0]
  const docId = docRow.id
  r = await req('PATCH', `/documents/${docId}/status`, { status: 'rejected', note: 'Illegible scan' }, token)
  ok(r.status === 200, 'document reject')
  r = await req('PATCH', `/documents/${docId}/status`, { status: 'accepted' }, token)
  ok(r.status === 200, 'document accept')

  console.log('\nTICKETS')
  r = await req('GET', '/tickets', undefined, token)
  ok(r.status === 200 && r.json.tabs.length === 5 && r.json.data.length > 0, 'tickets list + 5 tabs')
  const ticketId = r.json.data[0].id
  r = await req('GET', `/tickets/${ticketId}`, undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.messages) && r.json.ticket.supplier.name, 'ticket detail')
  r = await req('POST', `/tickets/${ticketId}/reply`, { body: 'We are investigating.' }, token)
  ok(r.status === 200, 'ticket reply')

  console.log('\nNOTIFICATIONS')
  r = await req('GET', '/notifications', undefined, token)
  ok(r.status === 200 && r.json.unread > 0, 'admin notifications with unread count')
  const unreadBefore = r.json.unread
  const target = (r.json.data || []).find((n) => !n.isRead)
  if (target) {
    await req('PATCH', `/notifications/${target.id}/read`, {}, token)
  }
  r = await req('GET', '/notifications', undefined, token)
  ok(r.json.unread === Math.max(0, unreadBefore - 1), 'mark one read decrements unread')

  console.log('\nAUDIT')
  r = await req('GET', '/audit-logs', undefined, token)
  ok(r.status === 200 && r.json.data.length > 0 && r.json.stats.total30d >= 0, 'audit logs + stats')

  console.log('\nBLACKLIST')
  r = await req('GET', '/blacklist', undefined, token)
  ok(r.status === 200 && r.json.stats.total > 0, 'blacklist list + stats')
  const blBefore = r.json.data.length
  r = await req('POST', '/blacklist', { company: 'TestDodgy Ltd', reason: 'Fraud', severity: 'High' }, token)
  ok(r.status === 200, 'blacklist add')
  r = await req('GET', '/blacklist', undefined, token)
  ok(r.json.data.length === blBefore + 1, 'blacklist entry persisted')
  const blId = r.json.data.find((b) => b.company === 'TestDodgy Ltd').id
  r = await req('PATCH', `/blacklist/${blId}/reinstate`, { type: 'full' }, token)
  ok(r.status === 200, 'blacklist reinstate')

  console.log('\nPERFORMANCE')
  r = await req('GET', '/performance', undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.bands) && r.json.stats.avgScore >= 0, 'performance overview')

  console.log('\nREPORTS')
  r = await req('GET', '/reports', undefined, token)
  ok(r.status === 200 && Array.isArray(r.json.reportTypes) && r.json.reportTypes.length >= 8, 'reports')

  console.log('\nCOMMUNICATIONS')
  r = await req('GET', '/mail?folder=inbox', undefined, token)
  ok(r.status === 200 && r.json.folders.length === 4 && r.json.data.length > 0, 'mail inbox')
  r = await req('GET', '/templates', undefined, token)
  ok(r.status === 200 && r.json.data.length > 0, 'mail templates')
  r = await req('POST', '/templates', { name: 'Test Template' }, token)
  ok(r.status === 200, 'create template')
  r = await req('GET', '/campaigns', undefined, token)
  ok(r.status === 200 && r.json.data.length > 0, 'mail campaigns')
  r = await req('GET', '/stats', undefined, token)
  ok(r.status === 200 && r.json.unread >= 0, 'communication stats')

  console.log('\nSETTINGS')
  r = await req('GET', '/settings', undefined, token)
  ok(r.status === 200 && r.json.general.systemName && r.json.users.length > 0, 'settings bundle')
  r = await req('PUT', '/settings/general', { companyName: 'Procurement Department' }, token)
  ok(r.status === 200, 'update general settings')
  r = await req('PUT', '/settings/notifications', { email: true, digest: true }, token)
  ok(r.status === 200, 'update notification prefs')

  console.log('\nAUDIT (writes registered)')
  r = await req('GET', '/audit-logs?module=application', undefined, token)
  ok(r.status === 200, 'audit filter by module')

  console.log('\nLOGOUT')
  r = await req('POST', '/auth/logout', {}, token)
  ok(r.status === 200, 'logout')

  r = await req('GET', '/dashboard/stats', undefined, token)
  ok(r.status === 200, 'token still valid after logout (8h expiry)')

  console.log(`\nResult: ${passed} passed, ${failed} failed`)
  if (failed > 0) process.exitCode = 1
} finally {
  server.close()
}
