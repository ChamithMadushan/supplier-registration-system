import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })

const db = new DatabaseSync(config.dbPath)

db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name)
  if (!columns.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

export function initDb() {
  const supplierSchema = fs.readFileSync(new URL('./schema-supplier.sql', import.meta.url), 'utf8')
  const adminSchema = fs.readFileSync(new URL('./schema-admin.sql', import.meta.url), 'utf8')
  db.exec(supplierSchema)
  db.exec(adminSchema)
  // Admin-only attributes layered on top of supplier tables (safe, idempotent migrations)
  ensureColumn('companies', 'status', 'TEXT')
  ensureColumn('companies', 'code', 'TEXT')
  ensureColumn('companies', 'tier', 'TEXT')
  ensureColumn('companies', 'score', 'INTEGER')
  ensureColumn('applications', 'assignee', 'TEXT')
  ensureColumn('applications', 'priority', 'TEXT')
  ensureColumn('documents', 'expires_on', 'TEXT')
  ensureColumn('documents', 'verified_by', 'TEXT')
  ensureColumn('tickets', 'assignee', 'TEXT')
}

function bindable(value) {
  return value === undefined ? null : value
}

export function run(sql, params = []) {
  const stmt = db.prepare(sql)
  return stmt.run(...params.map(bindable))
}

export function get(sql, params = []) {
  return db.prepare(sql).get(...params.map(bindable))
}

export function all(sql, params = []) {
  return db.prepare(sql).all(...params.map(bindable))
}

export function tx(fn) {
  db.exec('BEGIN')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

export default db
