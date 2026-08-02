import express from 'express'
import { camelize } from './utils/serialize.js'
import { notFound, errorHandler } from './middleware/error.js'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import applicationRoutes from './routes/applications.js'
import supplierRoutes from './routes/suppliers.js'
import documentRoutes from './routes/documents.js'
import ticketRoutes from './routes/tickets.js'
import notificationRoutes from './routes/notifications.js'
import auditRoutes from './routes/audit.js'
import blacklistRoutes from './routes/blacklist.js'
import performanceRoutes from './routes/performance.js'
import reportRoutes from './routes/reports.js'
import communicationRoutes from './routes/communications.js'
import settingRoutes from './routes/settings.js'

const app = express()

app.use(express.json({ limit: '2mb' }))

// Camel-case every API response (same convention as the supplier backend)
const originalJson = express.response.json
express.response.json = function (body) {
  return originalJson.call(this, camelize(body))
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'admin-api', timestamp: new Date().toISOString() })
})

app.use('/api/admin/auth', authRoutes)
app.use('/api/admin/dashboard', dashboardRoutes)
app.use('/api/admin', applicationRoutes)
app.use('/api/admin', supplierRoutes)
app.use('/api/admin', documentRoutes)
app.use('/api/admin', ticketRoutes)
app.use('/api/admin', notificationRoutes)
app.use('/api/admin', auditRoutes)
app.use('/api/admin', blacklistRoutes)
app.use('/api/admin', performanceRoutes)
app.use('/api/admin', reportRoutes)
app.use('/api/admin', communicationRoutes)
app.use('/api/admin', settingRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
