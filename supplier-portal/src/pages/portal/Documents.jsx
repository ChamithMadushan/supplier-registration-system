import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Upload, Eye, Download, Plus, ShieldCheck, Clock3, XCircle,
  CheckCircle2, AlertCircle, Filter, Search, UploadCloud, Lock, History, ChevronRight, Trash2,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Field from '../../components/ui/Field'
import { Toast } from '../../components/ui/Toast'
import { api, getToken } from '../../api/client'

const categoryOptions = ['Company Registration', 'Financial', 'Compliance', 'Technical', 'Quality']

const checklist = [
  { label: 'Business Registration Certificate', done: true },
  { label: 'Certificate of Incorporation', done: true },
  { label: 'VAT Registration', done: true },
  { label: 'TIN Certificate', done: true },
  { label: 'Tax Clearance Certificate', done: false, note: 'Expired' },
  { label: 'Bank Statement (3 months)', done: false, note: 'Rejected' },
  { label: 'EPF / ETF Registration', done: true },
  { label: 'Insurance Certificates', done: true },
  { label: 'Quality Certifications (ISO)', done: true },
  { label: 'Technical Specifications', done: true },
  { label: 'Environmental Compliance', done: true },
  { label: 'Declaration & Undertaking', done: true },
]

const statusStyle = {
  verified: 'bg-success-light text-success-dark',
  pending: 'bg-warning-light text-warning-dark',
  expired: 'bg-danger-light text-danger-dark',
  rejected: 'bg-danger-light text-danger-dark',
}

const statusLabel = {
  verified: 'Verified',
  pending: 'Pending',
  expired: 'Expired',
  rejected: 'Rejected',
}

function StatusBadge({ status }) {
  const key = (status || 'pending').toLowerCase()
  const label = statusLabel[key] || status
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusStyle[key] || statusStyle.pending}`}>
      {(key === 'verified') && <CheckCircle2 size={11} />}
      {(key === 'pending') && <Clock3 size={11} />}
      {(key === 'expired' || key === 'rejected') && <XCircle size={11} />}
      {label}
    </span>
  )
}

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str.replace(' ', 'T') + 'Z')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Documents() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('All')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState('Company Registration')
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploadFile, setUploadFile] = useState(null)

  const load = () =>
    api.documents().then((d) => setDocs(d.documents || [])).catch((e) => setToast({ type: 'error', message: e.message })).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const categories = ['All'].concat(Array.from(new Set(docs.map((d) => d.category).filter(Boolean))).sort())

  const filtered = docs.filter((d) => {
    if (activeCat !== 'All' && d.category !== activeCat) return false
    if (query && !`${d.label} ${d.originalName} ${d.category}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const stats = [
    { icon: ShieldCheck, label: 'Verified', value: docs.filter((d) => d.status === 'verified').length, color: 'bg-success-light text-success', bar: 'bg-success' },
    { icon: Clock3, label: 'Pending Review', value: docs.filter((d) => d.status === 'pending').length, color: 'bg-warning-light text-warning-dark', bar: 'bg-warning' },
    { icon: XCircle, label: 'Needs Attention', value: docs.filter((d) => d.status === 'rejected' || d.status === 'expired').length, color: 'bg-danger-light text-danger', bar: 'bg-danger' },
  ]
  const maxStat = Math.max(1, ...stats.map((s) => s.value))
  const shown = docs.length

  const downloadDoc = async (doc) => {
    try {
      const res = await fetch(api.downloadUrl(doc.id), { headers: { Authorization: `Bearer ${getToken()}` } })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.originalName || doc.fileName || 'document'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    }
  }

  const deleteDoc = async (doc) => {
    try {
      await api.deleteDocument(doc.id)
      setDocs((prev) => prev.filter((d) => d.id !== doc.id))
      setToast({ type: 'success', message: `Deleted ${doc.label || doc.originalName}` })
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    }
  }

  const submitUpload = async () => {
    if (!uploadFile) {
      setToast({ type: 'error', message: 'Please choose a file to upload' })
      return
    }
    setUploading(true)
    const form = new FormData()
    form.append('file', uploadFile)
    form.append('category', uploadCategory)
    form.append('label', uploadLabel.trim() || uploadFile.name)
    try {
      await api.uploadDocument(form)
      setToast({ type: 'success', message: `${uploadFile.name} uploaded` })
      setUploadOpen(false)
      setUploadFile(null)
      setUploadLabel('')
      load()
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document" subtitle="Supported: PDF, JPG, PNG, DOC, XLS (max 10 MB each)">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (e.dataTransfer.files.length) {
              const f = e.dataTransfer.files[0]
              setUploadFile(f)
              if (!uploadLabel) setUploadLabel(f.name)
            }
          }}
          className={`rounded-[12px] border-2 border-dashed ${uploadFile ? 'border-success/50 bg-success/5' : 'border-secondary/40 bg-secondary/5 hover:border-accent hover:bg-accent/5'} transition-colors p-8 text-center cursor-pointer`}
        >
          {uploadFile ? (
            <div className="flex flex-col items-center gap-2">
              <span className="w-14 h-14 rounded-full bg-success-light text-success flex items-center justify-center">
                <FileText size={26} />
              </span>
              <p className="text-[14px] font-semibold text-ink break-all max-w-full">{uploadFile.name}</p>
              <p className="text-xs text-ink-muted">{formatBytes(uploadFile.size)}</p>
              <label className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-bold text-secondary hover:text-primary transition-colors cursor-pointer">
                <input type="file" className="hidden" onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) {
                    setUploadFile(f)
                    if (!uploadLabel) setUploadLabel(f.name)
                  }
                }} />
                Choose a different file
              </label>
            </div>
          ) : (
            <>
              <span className="mx-auto w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                <UploadCloud size={30} />
              </span>
              <p className="mt-4 text-[15px] font-semibold text-ink">Drag &amp; drop file here</p>
              <p className="mt-1 text-xs text-ink-muted">or</p>
              <label className="inline-block mt-3">
                <input type="file" className="hidden" onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) {
                    setUploadFile(f)
                    setUploadLabel(f.name)
                  }
                }} />
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors cursor-pointer">
                  <Plus size={15} /> Browse Files
                </span>
              </label>
            </>
          )}
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-1.5">Document Category</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full rounded-[8px] border border-line-soft bg-white px-3.5 py-2.5 text-sm focus:border-secondary focus:outline-none transition-colors"
            >
              {categoryOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Label (optional)" placeholder="e.g. Tax Clearance Certificate" value={uploadLabel} onChange={(e) => setUploadLabel(e.target.value)} />
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setUploadOpen(false)}>Cancel</Button>
          <Button onClick={submitUpload} disabled={uploading}>
            <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.label || previewDoc?.originalName} subtitle={`Uploaded ${formatDate(previewDoc?.uploadedAt)} · ${formatBytes(previewDoc?.size)}`} size="lg">
        <div className="h-[380px] rounded-[10px] bg-gradient-to-br from-[#EEF2F6] to-[#E2E8F0] flex flex-col items-center justify-center gap-3 border border-line-soft">
          <FileText size={52} className="text-secondary/50" />
          <p className="text-sm text-ink-muted">Preview not available in this environment — use Download to view the file.</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-[10px] border border-line-soft p-4 text-center">
            <p className="text-sm font-bold font-heading text-ink">{previewDoc?.category}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">Category</p>
          </div>
          <div className="rounded-[10px] border border-line-soft p-4 text-center">
            <div className="flex justify-center">
              <StatusBadge status={previewDoc?.status} />
            </div>
            <p className="text-[11px] text-ink-muted mt-1.5">Status</p>
          </div>
          <div className="rounded-[10px] border border-line-soft p-4 text-center">
            <p className="text-sm font-bold font-heading text-ink">{formatBytes(previewDoc?.size)}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">Size</p>
          </div>
        </div>
        {previewDoc?.reviewNote && (
          <div className="mt-4 rounded-[10px] bg-warning-light/60 border border-warning/30 p-4">
            <p className="text-[12px] font-bold text-warning-dark uppercase tracking-wide">Review note</p>
            <p className="text-[13px] text-ink mt-1">{previewDoc.reviewNote}</p>
          </div>
        )}
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setPreviewDoc(null)}>Close</Button>
          <Button onClick={() => { downloadDoc(previewDoc); setPreviewDoc(null) }}>
            <Download size={15} /> Download
          </Button>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold font-heading text-ink">Document Management</h1>
          <p className="text-sm text-ink-muted mt-1">Upload and track the documents required for your application</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" onClick={() => setToast({ type: 'info', message: 'Version history is not applicable to new uploads' })}>
            <History size={15} /> History
          </Button>
          <Button onClick={() => setUploadOpen(true)}>
            <Upload size={15} /> Upload Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-5">
            <div className="flex items-center gap-3">
              <span className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${s.color}`}>
                <s.icon size={22} />
              </span>
              <div>
                <p className="text-2xl font-bold font-heading text-ink leading-none">{s.value}</p>
                <p className="text-[13px] text-ink-muted mt-1">{s.label}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-[#E9ECEF] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${Math.max(8, (s.value / maxStat) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Documents table */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden">
          {/* Filters */}
          <div className="p-5 border-b border-line-soft">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                    activeCat === c ? 'bg-primary text-white' : 'bg-surface text-ink-muted hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full rounded-[8px] border border-line-soft bg-surface px-9 py-2.5 text-sm placeholder:text-ink-faint focus:border-secondary focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={() => setToast({ type: 'info', message: 'Filters are applied from the category tabs above' })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-line-soft bg-white text-[13px] font-semibold text-ink-muted hover:text-ink hover:border-ink-faint transition-colors"
              >
                <Filter size={15} /> Filters
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-line-soft/70">
            {loading && <div className="px-5 py-10 text-center text-sm text-ink-muted">Loading documents...</div>}
            {!loading && filtered.map((d) => (
              <div key={d.id} className="px-5 py-4 flex items-center gap-4 hover:bg-surface/60 transition-colors group">
                <span className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                  d.status === 'rejected' || d.status === 'expired' ? 'bg-danger-light text-danger' : 'bg-secondary/10 text-secondary'
                }`}>
                  <FileText size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink truncate">{d.label || d.originalName}</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {d.category || 'General'} · {formatDate(d.uploadedAt)} · {formatBytes(d.size)}
                  </p>
                </div>
                <div className="hidden md:block shrink-0">
                  <StatusBadge status={d.status} />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setPreviewDoc(d)} aria-label="Preview" title="Preview" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-ink-muted hover:text-secondary hover:bg-secondary/10 transition-colors">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => downloadDoc(d)} aria-label="Download" title="Download" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-ink-muted hover:text-secondary hover:bg-secondary/10 transition-colors">
                    <Download size={16} />
                  </button>
                  <button onClick={() => deleteDoc(d)} aria-label="Delete" title="Delete" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-ink-muted hover:text-danger hover:bg-danger/10 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-ink-muted">No documents match your filters.</div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-line-soft flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
            <span>Showing {filtered.length} of {shown} document{shown !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-5">
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold text-[15px] text-ink">Upload Requirements</p>
              <span className="text-[13px] font-bold text-accent-hover font-mono">{shown} / 12</span>
            </div>
            <div className="mt-3 h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-success to-info" style={{ width: `${Math.min(100, (shown / 12) * 100)}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-ink-muted">{Math.min(100, Math.round((shown / 12) * 100))}% uploaded</p>
            <ul className="mt-4 space-y-1">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-start gap-2.5 rounded-[8px] px-2 py-1.5 hover:bg-surface transition-colors">
                  {c.done ? (
                    <CheckCircle2 size={17} className="text-success shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={17} className="text-danger shrink-0 mt-0.5" />
                  )}
                  <span className="text-[13px] flex-1">
                    {c.label}
                    {c.note && <span className="ml-1.5 text-[10px] font-bold text-danger uppercase">({c.note})</span>}
                  </span>
                </li>
              ))}
            </ul>
            <Button size="sm" className="w-full mt-4" onClick={() => setUploadOpen(true)}>
              <Upload size={15} /> Upload Missing
            </Button>
          </div>

          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
              <Lock size={16} className="text-secondary" /> Security &amp; Guidelines
            </p>
            <ul className="mt-3 space-y-2.5 text-[13px] text-ink-muted leading-relaxed">
              <li className="flex gap-2"><ChevronRight size={15} className="text-ink-faint shrink-0 mt-0.5" /> Documents are encrypted in transit and at rest.</li>
              <li className="flex gap-2"><ChevronRight size={15} className="text-ink-faint shrink-0 mt-0.5" /> Only personnel involved in evaluation can view your files.</li>
              <li className="flex gap-2"><ChevronRight size={15} className="text-ink-faint shrink-0 mt-0.5" /> Scan with OCR so text is selectable and readable.</li>
            </ul>
            <button
              onClick={() => navigate('/portal/support')}
              className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors"
            >
              Need help uploading? <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
