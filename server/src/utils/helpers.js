export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

export function genReferenceNo(seed) {
  const date = new Date()
  const y = date.getFullYear()
  const yy = String(y).slice(2)
  const n = String(seed % 10000).padStart(4, '0')
  return `SRF-${yy}-${n}`
}

export function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function passwordValid(pw) {
  return typeof pw === 'string' && pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)
}

export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value
}
