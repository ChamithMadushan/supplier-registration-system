import fs from 'node:fs'
import { config } from './config.js'

for (const p of [config.dbPath, `${config.dbPath}-wal`, `${config.dbPath}-shm`]) {
  if (fs.existsSync(p)) {
    fs.unlinkSync(p)
    console.log(`removed ${p}`)
  }
}
console.log('Database reset. Run `npm run seed` to load demo data, or start the server to recreate an empty schema.')
