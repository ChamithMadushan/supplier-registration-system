export function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'MulterError') {
    const msg =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large. Max size is 10MB.'
        : `Upload error: ${err.message}`
    return res.status(400).json({ error: msg })
  }
  const status = err.status || err.statusCode || 500
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}]`, err)
  }
  const message = status < 500 || err.expose ? err.message : 'Internal server error'
  res.status(status).json({ error: message })
}
