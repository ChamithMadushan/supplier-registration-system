export function toCamelKey(key) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function camelize(value) {
  if (Array.isArray(value)) return value.map(camelize)
  if (value !== null && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[toCamelKey(k)] = camelize(v)
    }
    return out
  }
  return value
}
