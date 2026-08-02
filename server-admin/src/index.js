import app from './app.js'
import { config } from './config.js'
import { initDb } from './db.js'

initDb()

const server = app.listen(config.port, () => {
  console.log(`[admin-api] listening on http://localhost:${config.port}`)
})

function shutdown(signal) {
  console.log(`[admin-api] ${signal} received, shutting down`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
