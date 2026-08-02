import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  dbPath: path.resolve(__dirname, '..', process.env.DB_PATH || './data/supplier.db'),
  uploads: {
    dir: path.resolve(__dirname, '..', process.env.UPLOAD_DIR || './uploads'),
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  },
}

export function isProd() {
  return config.nodeEnv === 'production'
}
