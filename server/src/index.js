import app from './app.js'
import { config } from './config.js'

app.listen(config.port, () => {
  console.log(`[supplier-backend] running on http://localhost:${config.port}`)
  console.log(`[supplier-backend] health check: http://localhost:${config.port}/api/health`)
})
