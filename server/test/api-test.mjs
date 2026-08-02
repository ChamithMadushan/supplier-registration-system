const BASE = 'http://localhost:4000/api'

async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  let json = {}
  try { json = text ? JSON.parse(text) : {} } catch { json = { raw: text } }
  return { status: res.status, json }
}

const results = []
function check(label, cond, extra = '') {
  results.push(`${cond ? 'PASS' : 'FAIL'} ${label}${extra ? ' | ' + extra : ''}`)
}

// 1. Login
const login = await api('POST', '/auth/login', { email: 'demo@company.lk', password: 'Demo@1234' })
check('login demo user', login.status === 200, JSON.stringify({ status: login.status, user: login.json.user?.email }))
const token = login.json.token

// 2. Bad login
const badLogin = await api('POST', '/auth/login', { email: 'demo@company.lk', password: 'wrong' })
check('reject bad password', badLogin.status === 401)

// 3. Me
const me = await api('GET', '/auth/me', null, token)
check('auth/me', me.status === 200 && me.json.user.fullName === 'Kamal Perera')

// 4. Unauthorized access
const noAuth = await api('GET', '/application')
check('reject no token', noAuth.status === 401)

// 5. Application
const appRes = await api('GET', '/application', null, token)
check('get application', appRes.status === 200 && appRes.json.application.referenceNo.startsWith('SRF-'))
check('application has 6 steps', appRes.json.application.steps.length === 6)
check('application submitted status', appRes.json.application.status === 'submitted')

// 6. Register a fresh user
const email = `newuser${Date.now()}@supplier.lk`
const reg = await api('POST', '/auth/register', {
  email, password: 'Strong@123', fullName: 'New User', designation: 'CEO', mobile: '770001122', language: 'English',
})
check('register new user', reg.status === 201, reg.json.error || '')
const regToken = reg.json.token

// 7. Duplicate register
const dup = await api('POST', '/auth/register', { email, password: 'Strong@123', fullName: 'X', designation: 'Y' })
check('reject duplicate email', dup.status === 409)

// 8. Save step 2 data
const step2 = await api('PUT', '/application/step/2', { data: { legalName: 'Test Trading Ltd', brn: 'PV/1111', regCity: 'Colombo 04', regDistrict: 'Colombo' } }, regToken)
check('save step 2', step2.status === 200, step2.json.error || '')

// 9. Company created from step 2
const comp = await api('GET', '/company', null, regToken)
check('company created from step', comp.status === 200 && comp.json.company?.legalName === 'Test Trading Ltd')

// 10. Save steps 1,3,4,5,6
for (const n of [1, 3, 4, 5, 6]) {
  const payloads = {
    1: { data: { fullName: 'New User', email } },
    3: { data: { about: 'About text' } },
    4: { data: { turnover: 'LKR 10M - 50M', bankName: 'HNB', branch: 'Colombo', acctName: 'Test Trading', acctNumber: '1234', vatVerified: true } },
    5: { data: {} },
    6: { data: { signatories: [{ name: 'New User', designation: 'CEO', nic: '900000000V' }] } },
  }
  const r = await api('PUT', `/application/step/${n}`, payloads[n], regToken)
  if (r.status !== 200) check(`save step ${n}`, false, r.json.error || '')
}
check('all steps saved', true)

// 11. Submit
const submit = await api('POST', '/application/submit', {}, regToken)
check('submit application', submit.status === 200 && submit.json.application.status === 'submitted', submit.json.error || '')

// 12. Notifications
const notifs = await api('GET', '/notifications', null, regToken)
check('list notifications', notifs.status === 200 && Array.isArray(notifs.json.notifications))
const firstNotif = notifs.json.notifications[0]
const markRead = await api('PATCH', `/notifications/${firstNotif.id}/read`, {}, regToken)
check('mark notification read', markRead.status === 200)

// 13. Documents upload (multipart)
const FormData = globalThis.FormData
const fd = new FormData()
fd.append('category', 'legal')
fd.append('label', 'Certificate of Incorporation')
fd.append('file', new Blob(['%PDF-1.4 fake content'], { type: 'application/pdf' }), 'Cert.pdf')
const upRes = await fetch(BASE + '/documents/upload', { method: 'POST', headers: { Authorization: `Bearer ${regToken}` }, body: fd })
const upJson = await upRes.json()
check('upload document', upRes.status === 201 && upJson.document?.label === 'Certificate of Incorporation', upRes.status + ' ' + (upJson.error || ''))

// 14. Documents list
const docs = await api('GET', '/documents', null, regToken)
check('list documents', docs.status === 200 && docs.json.documents.length >= 1)

// 15. Reject bad file type
const fdBad = new FormData()
fdBad.append('file', new Blob(['x'], { type: 'text/html' }), 'evil.html')
const badUp = await fetch(BASE + '/documents/upload', { method: 'POST', headers: { Authorization: `Bearer ${regToken}` }, body: fdBad })
check('reject bad file type', badUp.status === 400)

// 16. Create ticket + reply
const ticket = await api('POST', '/tickets', { subject: 'Test ticket', category: 'General', priority: 'low', message: 'Hello support' }, regToken)
check('create ticket', ticket.status === 201, ticket.json.error || '')
const ticketId = ticket.json.ticket.id
const reply = await api('POST', `/tickets/${ticketId}/messages`, { body: 'Following up' }, regToken)
check('reply to ticket', reply.status === 201 && reply.json.messages.length === 2)
const ticketList = await api('GET', '/tickets', null, regToken)
check('list tickets', ticketList.status === 200 && ticketList.json.tickets.length >= 1)

// 17. Not-found route
const nf = await api('GET', '/nope')
check('404 for unknown route', nf.status === 404)

console.log(results.join('\n'))
const fails = results.filter((r) => r.startsWith('FAIL'))
console.log(`\n${results.length - fails.length}/${results.length} passed`)
process.exit(fails.length ? 1 : 0)

