import React, { useEffect, useRef, useState } from 'react'
import { Check, RefreshCw, Trash2, Loader2, Plus, Eye, Download, Info, CloudUpload } from 'lucide-react'

export default function DropZone({ label, multiple = false, required = false, note, onPreview }) {
  const [dragOver, setDragOver] = useState(false)
  const [state, setState] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (state !== 'uploading') return
    const start = Date.now()
    const dur = 1600
    const t = setInterval(() => {
      const p = Math.min(((Date.now() - start) / dur) * 100, 100)
      setProgress(p)
      if (p >= 100) {
        clearInterval(t)
        setState('done')
      }
    }, 60)
    return () => clearInterval(t)
  }, [state])

  const handleFiles = (list) => {
    const accepted = Array.from(list)
    if (!accepted.length) return
    if (!multiple && accepted.length > 1) accepted.length = 1
    setError('')
    setFiles((prev) => (multiple ? [...prev, ...accepted] : accepted))
    setState('uploading')
    setProgress(0)
  }

  const removeFile = (i) => {
    const next = files.filter((_, j) => j !== i)
    setFiles(next)
    if (next.length === 0) setState('idle')
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const uploading = state === 'uploading'

  return (
    <div>
      {label && (
        <p className="text-[13px] font-semibold text-ink mb-2">
          {label} {required && <span className="text-danger">*</span>}
        </p>
      )}
      {note && (
        <p className="text-xs text-ink-muted mb-2 flex items-start gap-1">
          <Info size={13} className="shrink-0 mt-0.5" /> {note}
        </p>
      )}

      {files.length > 0 && !uploading && (
        <div className="space-y-2 mb-3">
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="rounded-[12px] border-2 border-success/40 bg-success-light/40 p-3.5 anim-fade-in"
            >
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                  <Check size={18} strokeWidth={3} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{f.name}</p>
                  <p className="text-xs text-ink-muted">
                    {(f.size / 1024 / 1024).toFixed(1)} MB • Uploaded just now
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onPreview?.(f)}
                    aria-label="Preview file"
                    className="p-2 rounded-[8px] text-ink-muted hover:text-secondary hover:bg-white transition-colors"
                    title="Preview"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => removeFile(i)}
                    aria-label="Remove file"
                    className="p-2 rounded-[8px] text-danger hover:bg-danger-light transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {multiple && (
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors"
            >
              <Plus size={13} /> Add another file
            </button>
          )}
        </div>
      )}

      {!uploading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-[12px] border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-secondary bg-secondary/10 scale-[1.01] shadow-input'
              : error
                ? 'border-danger bg-danger-light/40'
                : 'border-line bg-surface hover:border-secondary/60 hover:bg-secondary/5'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <CloudUpload
            size={40}
            className={`mx-auto transition-colors ${dragOver ? 'text-secondary' : 'text-ink-faint'}`}
          />
          <p className={`mt-3 text-sm font-semibold ${dragOver ? 'text-secondary' : 'text-ink'}`}>
            {dragOver ? 'Drop file here to upload' : 'Drag & Drop file here'}
          </p>
          <p className="mt-1 text-xs text-ink-muted">or</p>
          <span className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors">
            Browse Files
          </span>
          <p className="mt-3 text-[11px] text-ink-faint">PDF, JPG, PNG, DOC, XLSX • Max 10MB</p>
          {error && <p className="mt-2 text-xs font-medium text-danger">{error}</p>}
        </div>
      )}

      {uploading && (
        <div className="rounded-[12px] border-2 border-secondary/40 bg-white p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Loader2 size={16} className="animate-spin text-secondary" /> Uploading...
          </p>
          <div className="mt-3 h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary to-info transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-muted">{Math.round(progress)}% complete</p>
          <button
            onClick={() => { setState('idle'); setFiles([]) }}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-danger hover:text-danger/70 transition-colors"
          >
            Cancel Upload
          </button>
        </div>
      )}
    </div>
  )
}

export function UploadedRow({ name, size, uploadedAt, onPreview }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-line-soft bg-surface/50 p-4">
      <span className="w-10 h-10 rounded-[8px] bg-danger-light text-danger-dark flex items-center justify-center shrink-0">
        <FileIcon name={name} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{name}</p>
        <p className="text-xs text-ink-muted">{size} • Uploaded: {uploadedAt}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {[Eye, Download, RefreshCw, Trash2].map((Icon, i) => (
          <button
            key={i}
            onClick={() => i === 0 && onPreview?.()}
            aria-label={['Preview', 'Download', 'Replace', 'Delete'][i]}
            className={`p-2 rounded-[8px] transition-colors ${
              i === 3 ? 'text-danger hover:bg-danger-light' : 'text-ink-muted hover:text-ink hover:bg-white'
            }`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
    </div>
  )
}

function FileIcon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor" opacity="0.15" />
      <path d="M14 2v6h6M9 15h6M9 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
