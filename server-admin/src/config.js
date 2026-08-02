import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const config = {
  port: parseInt(process.env.PORT || '4001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'admin-dev-only-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  dbPath: path.resolve(__dirname, '..', process.env.DB_PATH || '../server/data/supplier.db'),
  uploadDir: path.resolve(__dirname, '..', process.env.UPLOAD_DIR || '../server/uploads'),
}
