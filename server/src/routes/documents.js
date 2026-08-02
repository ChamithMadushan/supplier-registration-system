import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'
import { config } from '../config.js'
import { get, run, all } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/helpers.js'

const router = Router()
router.use(requireAuth)

fs.mkdirSync(config.uploads.dir, { recursive: true })

const ALLOWED = new Set(['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploads.dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: config.uploads.maxSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      const err = new Error('Unsupported file type. Allowed: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX')
      err.status = 400
      return cb(err)
    }
    cb(null, true)
  },
})

// GET /api/documents
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const docs = all(
      `SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC`,
      [req.user.id],
    )
    res.json({ documents: docs })
  }),
)

// POST /api/documents/upload  (multipart: file, category, label)
router.post(
  '/upload',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const category = String(req.body.category || 'general').trim()
    const label = String(req.body.label || req.file.originalname).trim()
    const app = get('SELECT id FROM applications WHERE user_id = ?', [req.user.id])

    const result = run(
      `INSERT INTO documents (user_id, application_id, category, label, file_name, original_name, mime_type, size, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, app ? app.id : null, category, label, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size],
    )
    const doc = get('SELECT * FROM documents WHERE id = ?', [result.lastInsertRowid])
    res.status(201).json({ message: 'Document uploaded', document: doc })
  }),
)

// GET /api/documents/:id/download
router.get(
  '/:id/download',
  asyncHandler(async (req, res) => {
    const doc = get('SELECT * FROM documents WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!doc) return res.status(404).json({ error: 'Document not found' })
    const filePath = path.join(config.uploads.dir, doc.file_name)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on server' })
    res.download(filePath, doc.original_name)
  }),
)

// DELETE /api/documents/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = get('SELECT * FROM documents WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!doc) return res.status(404).json({ error: 'Document not found' })
    const filePath = path.join(config.uploads.dir, doc.file_name)
    run('DELETE FROM documents WHERE id = ?', [doc.id])
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch {
        /* ignore cleanup failure */
      }
    }
    res.json({ message: 'Document deleted' })
  }),
)

export default router
