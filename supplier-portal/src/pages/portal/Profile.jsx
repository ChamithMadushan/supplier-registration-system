import React, { useState, useEffect, useRef } from 'react'
import {
  Building2, Wallet, FileText, Users, BarChart3, History, PencilLine, Printer,
  Plus, MapPin, Phone, Mail, Globe, Star, Camera, CheckCircle2, AlertCircle, BadgeCheck, Trash2,
} from 'lucide-react'
import Gauge from '../../components/portal/Gauge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Field from '../../components/ui/Field'
import { Toast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

const tabs = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'financial', label: 'Financial', icon: Wallet },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'directors', label: 'Directors', icon: Users },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
]

const statusMap = {
  in_progress: { label: 'In Progress', cls: 'bg-process text-process-dark' },
  submitted: { label: 'Under Review', cls: 'bg-warning-light text-warning-dark' },
  approved: { label: 'Approved', cls: 'bg-success-light text-success-dark' },
  rejected: { label: 'Rejected', cls: 'bg-danger-light text-danger-dark' },
}

function parseList(v) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      if (Array.isArray(parsed)) return parsed
      return v.split(',').map((s) => s.trim()).filter(Boolean)
    } catch {
      return v.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(String(str).replace(' ', 'T') + 'Z')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(str) {
  if (!str) return '—'
  const d = new Date(String(str).replace(' ', 'T') + 'Z')
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function docStatusLabel(status) {
  const map = { verified: 'Approved', pending: 'Pending', rejected: 'Rejected', expired: 'Expired' }
  return map[status] || status || 'Pending'
}

const businessTypes = [
  'Private Limited Company',
  'Public Limited Company',
  'Sole Proprietorship',
  'Partnership',
  'Government / State',
  'Other',
]

const employeeRanges = ['1 - 10', '11 - 50', '51 - 200', '201 - 500', '500+']

export const SL_DISTRICTS = [
  { name: 'Colombo', province: 'Western Province' },
  { name: 'Gampaha', province: 'Western Province' },
  { name: 'Kalutara', province: 'Western Province' },
  { name: 'Kandy', province: 'Central Province' },
  { name: 'Matale', province: 'Central Province' },
  { name: 'Nuwara Eliya', province: 'Central Province' },
  { name: 'Galle', province: 'Southern Province' },
  { name: 'Matara', province: 'Southern Province' },
  { name: 'Hambantota', province: 'Southern Province' },
  { name: 'Jaffna', province: 'Northern Province' },
  { name: 'Kilinochchi', province: 'Northern Province' },
  { name: 'Mannar', province: 'Northern Province' },
  { name: 'Vavuniya', province: 'Northern Province' },
  { name: 'Mullaitivu', province: 'Northern Province' },
  { name: 'Trincomalee', province: 'Eastern Province' },
  { name: 'Batticaloa', province: 'Eastern Province' },
  { name: 'Ampara', province: 'Eastern Province' },
  { name: 'Kurunegala', province: 'North Western Province' },
  { name: 'Puttalam', province: 'North Western Province' },
  { name: 'Anuradhapura', province: 'North Central Province' },
  { name: 'Polonnaruwa', province: 'North Central Province' },
  { name: 'Ratnapura', province: 'Sabaragamuwa Province' },
  { name: 'Kegalle', province: 'Sabaragamuwa Province' },
  { name: 'Badulla', province: 'Uva Province' },
  { name: 'Monaragala', province: 'Uva Province' },
]

export const SL_PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Sabaragamuwa Province',
  'Uva Province',
]

export default function Profile() {
  const { user, application, refresh } = useAuth()
  const [activeTab, setActiveTab] = useState('company')
  const [toast, setToast] = useState(null)
  const [bundle, setBundle] = useState(null)
  const [editBasic, setEditBasic] = useState(false)
  const [editContact, setEditContact] = useState(false)
  const [editDirectors, setEditDirectors] = useState(false)
  const [saving, setSaving] = useState(false)
  const [basicForm, setBasicForm] = useState(null)
  const [directorsForm, setDirectorsForm] = useState(null)
  const logoInputRef = useRef(null)

  useEffect(() => {
    api.company().then((d) => setBundle(d)).catch(() => {})
  }, [])

  const openBasicEditor = () => {
    setBasicForm({
      legalName: company.legalName || '',
      tradingName: company.tradingName || '',
      brn: company.brn || '',
      businessType: company.businessType || '',
      incorporationDate: company.incorporationDate || '',
      boiNumber: company.boiNumber || '',
      employeeCount: company.employeeCount || '',
    })
    setEditBasic(true)
  }

  const openContactEditor = () => {
    setBasicForm({
      phone: company.phone || '',
      fax: company.fax || '',
      email: company.email || '',
      website: company.website || '',
      regAddress1: company.regAddress1 || '',
      regAddress2: company.regAddress2 || '',
      regCity: company.regCity || '',
      regDistrict: company.regDistrict || '',
      regProvince: company.regProvince || '',
      regPostalCode: company.regPostalCode || '',
    })
    setEditContact(true)
  }

  const setBasicField = (key) => (e) => setBasicForm((f) => ({ ...f, [key]: e.target.value }))

  const setRegDistrict = (e) => {
    const district = e.target.value
    const province = SL_DISTRICTS.find((d) => d.name === district)?.province || ''
    setBasicForm((f) => ({ ...f, regDistrict: district, regProvince: province }))
  }

  const submitCompanyForm = async (close, successMsg) => {
    setSaving(true)
    try {
      const data = await api.companyBasic(basicForm)
      setBundle((prev) => ({ ...prev, company: data.company }))
      await refresh()
      close()
      setToast({ type: 'success', message: successMsg })
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update information' })
    } finally {
      setSaving(false)
    }
  }

  const saveBasic = () => submitCompanyForm(() => setEditBasic(false), 'Basic information updated successfully')
  const saveContact = () => submitCompanyForm(() => setEditContact(false), 'Contact information updated successfully')

  const openDirectorsEditor = () => {
    const current = signatories.length ? signatories : [{}]
    setDirectorsForm(
      current.map((s, i) => ({
        id: s.id || i,
        name: s.name || '',
        designation: s.designation || '',
        nic: s.nic || '',
        isPrimary: i === 0 || !!s.isPrimary,
      })),
    )
    setEditDirectors(true)
  }

  const setDirectorField = (id, key) => (e) =>
    setDirectorsForm((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: e.target.value } : r)))

  const setPrimaryDirector = (id) =>
    setDirectorsForm((rows) => rows.map((r) => ({ ...r, isPrimary: r.id === id })))

  const addDirectorRow = () =>
    setDirectorsForm((rows) => [...rows, { id: Date.now(), name: '', designation: '', nic: '', isPrimary: rows.length === 0 }])

  const removeDirectorRow = (id) => setDirectorsForm((rows) => rows.filter((r) => r.id !== id))

  const saveDirectors = async () => {
    setSaving(true)
    try {
      const data = await api.companySignatories(directorsForm)
      setBundle((prev) => ({ ...prev, signatories: data.signatories }))
      await refresh()
      setEditDirectors(false)
      setToast({ type: 'success', message: 'Directors & signatories updated successfully' })
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update directors' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      setToast({ type: 'error', message: 'Please choose a JPG, PNG, WEBP or GIF image' })
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await api.uploadLogo(fd)
      setBundle((prev) => ({ ...prev, company: data.company }))
      await refresh()
      setToast({ type: 'success', message: 'Profile picture updated successfully' })
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to upload profile picture' })
    } finally {
      setSaving(false)
    }
  }

  const company = bundle?.company || application?.company || {}
  const logoUrl = company.logo ? `/${String(company.logo).replace(/^\/+/, '')}` : null
  const mapQuery = [
    company.regAddress1, company.regAddress2, company.regCity,
    company.regDistrict, company.regProvince, company.regPostalCode,
  ].filter(Boolean).join(', ')
  const mapSrc = mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : null
  const name = company.legalName || user?.fullName || 'Supplier'
  const initials = name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'SP'
  const refNo = application?.referenceNo || '—'
  const status = statusMap[application?.status] || { label: application?.status || '—', cls: 'bg-process text-process-dark' }
  const specializations = parseList(company.specializations)
  const steps = application?.steps || []
  const doneSteps = steps.filter((s) => s.completed).length
  const pct = Math.round((doneSteps / 6) * 100)
  const documents = application?.documents || []
  const docPending = documents.filter((d) => d.status === 'pending').length

  const basicInfo = [
    ['Legal Name', company.legalName || '—'],
    ['Trading Name', company.tradingName || '—'],
    ['Reg. Number', company.brn || '—'],
    ['Business Type', company.businessType || '—'],
    ['Incorporated', formatDate(company.incorporationDate)],
    ['Employees', company.employeeCount || '—'],
    ['BOI', company.boiNumber ? 'Yes' : 'No'],
    ['Annual Turnover', bundle?.financials?.turnoverRange || '—'],
  ]

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: company.phone || '—' },
    { icon: Phone, label: 'Fax', value: company.fax || '—' },
    { icon: Mail, label: 'Email', value: company.email || '—' },
    { icon: Globe, label: 'Website', value: company.website || '—' },
    { icon: MapPin, label: 'Address', value: [company.regAddress1, company.regCity].filter(Boolean).join(', ') || '—' },
  ]

  const completeness = [
    { label: 'Account Information', ok: true },
    { label: 'Company Information', ok: doneSteps >= 2 },
    { label: 'Business Details', ok: doneSteps >= 3 },
    { label: 'Financial Information', ok: doneSteps >= 4 },
    { label: 'Documents', ok: docPending === 0, note: docPending > 0 ? `${docPending} pending` : undefined },
    { label: 'Declaration Signed', ok: doneSteps >= 6 },
  ]

  const financials = bundle?.financials || {}
  const financialRows = [
    ['VAT Status', financials.vatNumber ? `Registered (${financials.vatNumber})` : '—'],
    ['EPF / ETF', financials.epfNumber ? `Registered (${financials.epfNumber})` : '—'],
    ['Bank', [financials.bankName, financials.bankBranch].filter(Boolean).join(' · ') || '—'],
    ['Turnover', financials.turnoverRange || '—'],
    ['Insurance', (bundle?.insurance || []).map((i) => i.insurer).filter(Boolean).join(', ') || '—'],
    ['Account Holder', financials.accountName || '—'],
  ]

  const signatories = bundle?.signatories || []
  const directors = signatories.map((s, i) => ({
    name: s.name || `Signatory ${i + 1}`,
    nic: s.nic || '—',
    role: s.designation || (s.isPrimary ? 'Primary Signatory' : 'Signatory'),
    idStatus: s.declared ? 'Verified' : 'Pending',
  }))

  const historyEntries = []
  if (application?.submittedAt) historyEntries.push({ date: formatDate(application.submittedAt), desc: 'Application submitted', color: 'info' })
  documents.forEach((d) => {
    if (d.status === 'rejected') historyEntries.push({ date: formatDate(d.uploadedAt), desc: `${d.label || d.originalName} rejected — ${d.reviewNote || 'please re-upload'}`, color: 'danger' })
    if (d.status === 'verified') historyEntries.push({ date: formatDate(d.verifiedAt || d.uploadedAt), desc: `${d.label || d.originalName} verified`, color: 'success' })
  })
  historyEntries.push({ date: formatDate(application?.createdAt), desc: 'Application started', color: 'info' })

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Profile header */}
      <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative shrink-0">
            <span className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-heading text-4xl font-bold overflow-hidden ring-4 ring-white shadow-[var(--shadow-card)]">
              {logoUrl ? (
                <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleLogoUpload} />
            <button
              onClick={() => logoInputRef.current && logoInputRef.current.click()}
              disabled={saving}
              aria-label="Upload logo"
              title="Upload profile picture"
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center border-4 border-white hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              <Camera size={15} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold font-heading text-ink">{name}</h1>
              <span className="px-2.5 py-1 rounded-full bg-process text-process-dark text-[11px] font-bold font-mono">
                {refNo}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.cls} text-[11px] font-bold`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> {status.label}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {specializations.slice(0, 5).map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="text-warning" fill="currentColor" /> 4.5 / 5.0 (post-approval)
              </span>
              <span>Last updated: {formatDateTime(company.updatedAt || application?.updatedAt || application?.createdAt)}</span>
            </div>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <Button variant="secondary" size="sm" onClick={openBasicEditor}>
              <PencilLine size={15} /> Edit Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer size={15} /> Print Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Tabs + content */}
        <div className="min-w-0">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-1.5 mb-5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'bg-primary text-white shadow'
                    : 'text-ink-muted hover:text-ink hover:bg-surface'
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'company' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-heading font-semibold text-[15px] text-ink">Basic Information</p>
                  <button onClick={openBasicEditor} className="text-ink-muted hover:text-accent transition-colors" aria-label="Edit basic info">
                    <PencilLine size={16} />
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-y-3.5">
                  {basicInfo.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-line-soft/70 pb-2.5">
                      <dt className="text-[13px] text-ink-muted">{k}</dt>
                      <dd className="text-[13px] font-semibold text-ink text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-heading font-semibold text-[15px] text-ink">Contact Information</p>
                    <button onClick={openContactEditor} className="text-ink-muted hover:text-accent transition-colors" aria-label="Edit contact info">
                      <PencilLine size={16} />
                    </button>
                  </div>
                  <ul className="space-y-3.5">
                    {contactInfo.map((c) => (
                      <li key={c.label} className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center shrink-0">
                          <c.icon size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-ink-muted uppercase tracking-wide">{c.label}</p>
                          <p className="text-[13px] font-medium text-ink truncate">{c.value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[16px] border border-line-soft overflow-hidden h-[180px]">
                  {mapSrc ? (
                    <iframe
                      title="Registered address map"
                      src={mapSrc}
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-secondary/20 to-info/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin size={26} className="mx-auto text-secondary" />
                        <p className="text-xs text-ink-muted mt-1.5">No registered address to map yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="xl:col-span-2 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-heading font-semibold text-[15px] text-ink">Supply Categories</p>
                  <Button size="sm" variant="ghost" onClick={() => setToast({ type: 'success', message: 'Add category opened' })}>
                    <Plus size={15} /> Add Category
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {specializations.length > 0 ? specializations.map((s) => (
                    <span key={s} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-accent/10 text-accent-hover text-[13px] font-semibold">
                      {s}
                    </span>
                  )) : (
                    <p className="text-sm text-ink-muted">No categories added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Wallet size={20} className="text-accent" />
                <p className="font-heading font-semibold text-[16px] text-ink">Financial Snapshot</p>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                {financialRows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line-soft/70 pb-2.5">
                    <dt className="text-[13px] text-ink-muted">{k}</dt>
                    <dd className="text-[13px] font-semibold text-ink text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText size={20} className="text-accent" />
                <p className="font-heading font-semibold text-[16px] text-ink">Document Status</p>
              </div>
              {documents.length === 0 && <p className="text-sm text-ink-muted">No documents uploaded yet.</p>}
              <ul className="space-y-3">
                {documents.slice(0, 8).map((d) => {
                  const st = d.status || 'pending'
                  const stLabel = docStatusLabel(st)
                  return (
                    <li key={d.id} className="flex items-center gap-3 rounded-[10px] border border-line-soft px-4 py-3">
                      <FileText size={17} className="text-ink-muted shrink-0" />
                      <span className="flex-1 text-[14px] font-medium text-ink truncate">{d.label || d.originalName}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        st === 'verified' ? 'bg-success-light text-success-dark'
                          : st === 'rejected' || st === 'expired' ? 'bg-danger-light text-danger-dark'
                            : 'bg-warning-light text-warning-dark'
                      }`}>
                        {stLabel}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <Button variant="ghost" size="sm" className="mt-4" onClick={() => setActiveTab('documents')}>
                Manage all documents
              </Button>
            </div>
          )}

          {activeTab === 'directors' && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="flex items-center gap-2 font-heading font-semibold text-[16px] text-ink">
                  <Users size={20} className="text-accent" /> Directors &amp; Signatories
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={openDirectorsEditor}>
                    <Plus size={15} /> Add Director
                  </Button>
                  <Button size="sm" variant="secondary" onClick={openDirectorsEditor}>
                    <PencilLine size={15} /> Edit
                  </Button>
                </div>
              </div>
              {directors.length === 0 ? (
                <p className="text-sm text-ink-muted">No signatories declared yet. Complete the declaration step to add them.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-ink-muted border-b border-line-soft">
                        <th className="py-3 pr-4 font-bold">Name</th>
                        <th className="py-3 pr-4 font-bold">NIC / Passport</th>
                        <th className="py-3 pr-4 font-bold">Role</th>
                        <th className="py-3 font-bold">ID Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directors.map((d) => (
                        <tr key={d.nic + d.name} className="border-b border-line-soft/60 last:border-0 hover:bg-surface/60 transition-colors">
                          <td className="py-3.5 pr-4 text-[13px] font-semibold text-ink">{d.name}</td>
                          <td className="py-3.5 pr-4 text-[13px] text-ink-muted font-mono">{d.nic}</td>
                          <td className="py-3.5 pr-4 text-[13px] text-ink-muted">{d.role}</td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              d.idStatus === 'Verified' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'
                            }`}>
                              {d.idStatus === 'Verified' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />} {d.idStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 text-center">
              <p className="font-heading font-semibold text-[16px] text-ink mb-2">Performance</p>
              <p className="text-sm text-ink-muted">Performance reports become available after your application is approved.</p>
              <Button size="sm" className="mt-4" onClick={() => setToast({ type: 'info', message: 'Performance unlocks after approval' })}>
                <BarChart3 size={15} /> View Performance
              </Button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center gap-2 mb-5">
                <History size={20} className="text-accent" />
                <p className="font-heading font-semibold text-[16px] text-ink">Activity History</p>
              </div>
              {historyEntries.length === 0 && <p className="text-sm text-ink-muted">No activity yet.</p>}
              {historyEntries.map((h, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-line-soft/60 last:border-0">
                  <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${h.color === 'danger' ? 'bg-danger' : h.color === 'success' ? 'bg-success' : 'bg-info'}`} />
                  <div>
                    <p className="text-[13px] font-medium text-ink">{h.desc}</p>
                    <p className="text-[11px] text-ink-muted">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completeness widget */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
          <p className="font-heading font-semibold text-[15px] text-ink mb-2">Profile Completeness</p>
          <div className="flex justify-center py-2">
            <Gauge value={pct / 100} max={1} size={150} display={`${pct}%`} />
          </div>
          <ul className="mt-3 space-y-2.5">
            {completeness.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5">
                {c.ok ? (
                  <CheckCircle2 size={17} className="text-success shrink-0" />
                ) : (
                  <AlertCircle size={17} className="text-warning-dark shrink-0" />
                )}
                <span className={`text-[13px] ${c.ok ? 'text-ink' : 'text-warning-dark'}`}>
                  {c.label}
                  {c.note && <span className="text-[11px] text-ink-muted block">{c.note}</span>}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setToast({ type: 'info', message: 'Opening completeness wizard' })}
            className="mt-5 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[8px] bg-accent/10 text-accent-hover text-[13px] font-semibold hover:bg-accent hover:text-white transition-colors"
          >
            <BadgeCheck size={15} /> Complete Now
          </button>
        </div>
      </div>

      {/* Edit Basic Information modal */}
      <Modal
        open={editBasic && !!basicForm}
        onClose={() => setEditBasic(false)}
        title="Edit Basic Information"
        subtitle="Update your registered company details"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditBasic(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveBasic} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Legal Name" required value={basicForm?.legalName} onChange={setBasicField('legalName')} placeholder="e.g. Lanka Office Solutions (Pvt) Ltd" />
          <Field label="Trading Name" value={basicForm?.tradingName} onChange={setBasicField('tradingName')} placeholder="e.g. Lanka Office" />
          <Field label="Registration / BRN" value={basicForm?.brn} onChange={setBasicField('brn')} placeholder="e.g. PV/8842" />
          <Field
            label="Business Type"
            as="select"
            value={basicForm?.businessType}
            onChange={setBasicField('businessType')}
          >
            <option value="">Select business type</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Field>
          <Field label="Incorporation Date" type="date" value={basicForm?.incorporationDate} onChange={setBasicField('incorporationDate')} />
          <Field
            label="Employees"
            as="select"
            value={basicForm?.employeeCount}
            onChange={setBasicField('employeeCount')}
          >
            <option value="">Select range</option>
            {employeeRanges.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Field>
          <Field label="BOI Number" value={basicForm?.boiNumber} onChange={setBasicField('boiNumber')} placeholder="e.g. BOI/122" />
        </div>
      </Modal>

      {/* Edit Contact Information modal */}
      <Modal
        open={editContact && !!basicForm}
        onClose={() => setEditContact(false)}
        title="Edit Contact Information"
        subtitle="Update your contact and registered address details"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditContact(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveContact} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" value={basicForm?.phone} onChange={setBasicField('phone')} placeholder="+94 ..." />
          <Field label="Fax" value={basicForm?.fax} onChange={setBasicField('fax')} placeholder="+94 ..." />
          <Field label="Email" type="email" value={basicForm?.email} onChange={setBasicField('email')} placeholder="company@example.com" />
          <Field label="Website" value={basicForm?.website} onChange={setBasicField('website')} placeholder="https://..." />
          <div className="sm:col-span-2">
            <Field label="Registered Address (Line 1)" value={basicForm?.regAddress1} onChange={setBasicField('regAddress1')} />
          </div>
          <Field label="Address Line 2" value={basicForm?.regAddress2} onChange={setBasicField('regAddress2')} />
          <Field label="City" value={basicForm?.regCity} onChange={setBasicField('regCity')} />
          <Field label="District" as="select" value={basicForm?.regDistrict || ''} onChange={setRegDistrict}>
            <option value="">Select district</option>
            {SL_DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </Field>
          <Field label="Province" as="select" value={basicForm?.regProvince || ''} onChange={setBasicField('regProvince')}>
            <option value="">Select province</option>
            {SL_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </Field>
          <Field label="Postal Code" value={basicForm?.regPostalCode} onChange={setBasicField('regPostalCode')} />
        </div>
      </Modal>

      {/* Edit Directors & Signatories modal */}
      <Modal
        open={editDirectors && !!directorsForm}
        onClose={() => setEditDirectors(false)}
        title="Edit Directors & Signatories"
        subtitle="Add or update the people authorized to sign on behalf of the company"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditDirectors(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveDirectors} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {directorsForm?.map((row, idx) => (
            <div key={row.id} className="rounded-[12px] border border-line-soft p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-bold text-ink">Director / Signatory {idx + 1}</p>
                <button
                  onClick={() => removeDirectorRow(row.id)}
                  disabled={directorsForm.length <= 1}
                  aria-label="Remove director"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-danger hover:bg-danger-light/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Full Name" required value={row.name} onChange={setDirectorField(row.id, 'name')} placeholder="Full name" />
                <Field label="Designation" value={row.designation} onChange={setDirectorField(row.id, 'designation')} placeholder="e.g. Director" />
                <Field label="NIC / Passport" value={row.nic} onChange={setDirectorField(row.id, 'nic')} placeholder="e.g. 882345678V" />
              </div>
              <label className="flex items-center gap-2 mt-3 text-[13px] font-medium text-ink cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!row.isPrimary}
                  onChange={() => setPrimaryDirector(row.id)}
                  className="w-4 h-4 rounded accent-[var(--color-accent)]"
                />
                Primary Signatory (signs on behalf of the company)
              </label>
            </div>
          ))}
        </div>
        <Button size="sm" variant="ghost" className="mt-4" onClick={addDirectorRow}>
          <Plus size={15} /> Add Another Director
        </Button>
      </Modal>
    </div>
  )
}
