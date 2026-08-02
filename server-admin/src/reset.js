import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'
import { initDb } from './db.js'

const backupsDir = path.join(path.dirname(config.dbPath), 'backups')

if (fs.existsSync(config.dbPath)) {
  fs.mkdirSync(backupsDir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
  const backupPath = path.join(backupsDir, `supplier-${stamp}.db`)
  fs.copyFileSync(config.dbPath, backupPath)
  console.log(`[reset] backed up database to ${backupPath}`)
  fs.rmSync(config.dbPath)
  for (const suffix of ['-wal', '-shm']) {
    const wal = config.dbPath + suffix
    if (fs.existsSync(wal)) fs.rmSync(wal)
  }
}

initDb()
console.log('[reset] database recreated')
