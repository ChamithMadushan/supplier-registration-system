import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import { camelize } from './utils/serialize.js'
import { notFound, errorHandler } from './middleware/error.js'
import { config } from './config.js'

import authRoutes from './routes/auth.js'
import applicationRoutes from './routes/application.js'
import companyRoutes from './routes/company.js'
import documentRoutes from './routes/documents.js'
import notificationRoutes from './routes/notifications.js'
import ticketRoutes from './routes/tickets.js'
import searchRoutes from './routes/search.js'

initDb()

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Standardize all JSON responses to camelCase keys
app.use((req, res, next) => {
  const original = res.json.bind(res)
  res.json = (body) => original(camelize(body))
  next()
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.use('/api/uploads', express.static(config.uploads.dir))

app.use('/api/auth', authRoutes)
app.use('/api/application', applicationRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/search', searchRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
