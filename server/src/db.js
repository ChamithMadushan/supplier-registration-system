import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })

const db = new DatabaseSync(config.dbPath)

db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

export function initDb() {
  const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')
  db.exec(schema)
  ensureColumn('companies', 'logo_path', 'TEXT')
}

function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all()
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
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

export function lastInsertId() {
  return db.prepare('SELECT last_insert_rowid() AS id').get().id
}

export default db
