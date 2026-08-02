import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Download, Search, Filter, X, ChevronDown, ChevronLeft, ChevronRight,
  Eye, CheckCircle2, XCircle, RefreshCw, AlertTriangle, CalendarDays, FileCheck2,
  FileClock, Mail, ShieldCheck, CheckCheck,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { DocStatusBadge } from '../../components/admin/Badges'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const tabs = [
  { key: 'all', label: 'All Documents', count: 48 },
  { key: 'pending', label: 'Pending Review', count: 12 },
  { key: 'review', label: 'Under Review', count: 8 },
  { key: 'reupload', label: 'Re-upload Requested', count: 7 },
  { key: 'expired', label: 'Expired', count: 5 },
  { key: 'expiring', label: 'Expiring Soon', count: 18 },
  { key: 'accepted', label: 'Verified', count: 412 },
]

const docs = [
  { id: 1, name: 'Tax Clearance Certificate.pdf', type: 'Financial', supplier: 'ABC Trading', code: 'SRS-APR-001', uploaded: '08 Jan 2025', exp: '31 Jan 2025', status: 'expired', size: '720 KB' },
  { id: 2, name: 'Bank Statement - HNB.pdf', type: 'Financial', supplier: 'ABC Trading', code: 'SRS-APR-001', uploaded: '08 Jan 2025', exp: '—', status: 'reupload', size: '1.8 MB' },
  { id: 3, name: 'Public Liability Insurance.pdf', type: 'Insurance', supplier: 'XYZ Supplies', code: 'SRS-APR-034', uploaded: '10 Jan 2025', exp: '31 Dec 2025', status: 'pending', size: '940 KB' },
  { id: 4, name: 'ISO 9001 Certificate.pdf', type: 'Certification', supplier: 'XYZ Supplies', code: 'SRS-APR-034', uploaded: '10 Jan 2025', exp: '30 Nov 2026', status: 'review', size: '1.1 MB' },
  { id: 5, name: 'Business Registration.pdf', type: 'Legal', supplier: 'DEF Services', code: 'SRS-APR-067', uploaded: '05 Jan 2025', exp: '—', status: 'pending', size: '1.2 MB' },
  { id: 6, name: 'VAT Registration Certificate.pdf', type: 'Financial', supplier: 'DEF Services', code: 'SRS-APR-067', uploaded: '05 Jan 2025', exp: '—', status: 'accepted', size: '610 KB' },
  { id: 7, name: 'Workmen\'s Compensation.pdf', type: 'Insurance', supplier: 'GHI Constructs', code: 'SRS-APR-102', uploaded: '02 Jan 2025', exp: '30 Jun 2025', status: 'expiring', size: '380 KB' },
  { id: 8, name: 'EPF / ETF Registration.pdf', type: 'Statutory', supplier: 'GHI Constructs', code: 'SRS-APR-102', uploaded: '02 Jan 2025', exp: '—', status: 'review', size: '450 KB' },
  { id: 9, name: 'Director ID Copies.pdf', type: 'Legal', supplier: 'JKL Trading', code: 'SRS-APR-140', uploaded: '28 Dec 2024', exp: '—', status: 'pending', size: '820 KB' },
  { id: 10, name: 'Reference Letters.pdf', type: 'Other', supplier: 'JKL Trading', code: 'SRS-APR-140', uploaded: '28 Dec 2024', exp: '—', status: 'reupload', size: '290 KB' },
]

function ExpiryTag({ exp, status }) {
  if (!exp || exp === '—') return <span className="text-[11px] text-admin-muted">—</span>
  if (status === 'expired') return <span className="text-[11px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full">EXPIRED</span>
  if (status === 'expiring') return <span className="text-[11px] font-bold text-warning-dark bg-warning-light px-2 py-0.5 rounded-full">⚠ {exp}</span>
  return <span className="text-[11px] text-admin-medium">{exp}</span>
}

export default function Documents() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [bulk, setBulk] = useState(false)

  const filtered = tab === 'all' ? docs : docs.filter((d) => d.status === tab)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Document Verification Center"
        subtitle="48 documents awaiting verification · 5 expired · 18 expiring within 30 days"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Performance' }, { label: 'Document Center' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export
            </button>
            <button onClick={() => setToast({ type: 'success', message: 'Reminders sent to 18 suppliers' })} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <Mail size={15} /> Send Expiry Reminders
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={FileText} iconBg="bg-primary/10 text-primary" border="border-primary" label="Total Documents Tracked" value="1,284" sub="Across 487 suppliers" />
        <AdminStatCard icon={FileCheck2} iconBg="bg-success-light text-success-dark" border="border-success" label="Verified Documents" value="1,210" sub="94% verification rate" />
        <AdminStatCard icon={FileClock} iconBg="bg-danger-light text-danger" border="border-danger" label="Expired Documents" value="5" sub="⚠ Requires immediate action" onClick={() => setTab('expired')} />
        <AdminStatCard icon={CalendarDays} iconBg="bg-warning-light text-warning-dark" border="border-warning" label="Expiring Within 30 Days" value="18" sub="3 within 7 days" onClick={() => setTab('expiring')} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-white text-admin-text shadow border-b-2 border-accent' : 'text-admin-light hover:text-admin-text hover:bg-white/70'
            }`}
          >
            {t.key !== 'all' && (
              <span className={`w-2 h-2 rounded-full ${t.key === 'expired' ? 'bg-danger' : t.key === 'expiring' ? 'bg-warning' : t.key === 'pending' ? 'bg-info' : t.key === 'review' ? 'bg-purple' : t.key === 'reupload' ? 'bg-accent' : 'bg-success'}`} />
            )}
            {t.label}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-primary text-white' : 'bg-table-header text-admin-muted'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              placeholder="Search document name, supplier, reference..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Document Type', 'Supplier', 'Upload Date', 'Expiry Date', 'Reviewer'].map((f) => (
              <button key={f} className="inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
                {f} <ChevronDown size={13} className="text-admin-muted" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-admin-border pt-3">
          <button className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
            <Filter size={13} /> Apply Filters
          </button>
          <button className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors">
            <X size={13} /> Clear All
          </button>
        </div>
      </div>

      {/* Bulk verify bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[12px] bg-primary text-white px-5 py-3">
        <FileCheck2 size={16} />
        <span className="text-[13px] font-semibold">Verification queue: 12 documents ready for batch approval</span>
        <button onClick={() => setBulk(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-white/10 hover:bg-white/20 text-[12px] font-semibold transition-colors">
          <CheckCheck size={14} /> Approve All
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-white/10 hover:bg-white/20 text-[12px] font-semibold transition-colors">
          <Mail size={14} /> Request Re-upload
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                <th className="px-6 py-3">Document</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <span className={`w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 ${d.status === 'expired' ? 'bg-danger-light text-danger' : d.status === 'expiring' ? 'bg-warning-light text-warning-dark' : d.status === 'accepted' ? 'bg-success-light text-success-dark' : 'bg-info-light text-info'}`}>
                        <FileText size={16} />
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold text-admin-text">{d.name}</p>
                        <p className="text-[11px] text-admin-muted font-mono">{d.size}</p>
                      </div>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-table-header text-admin-medium">{d.type}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => navigate(`/admin/suppliers/${d.id}`)} className="text-left group">
                      <p className="text-[13px] font-semibold text-admin-text group-hover:text-secondary transition-colors">{d.supplier}</p>
                      <p className="text-[11px] text-admin-muted font-mono">{d.code}</p>
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{d.uploaded}</td>
                  <td className="px-4 py-3.5"><ExpiryTag exp={d.exp} status={d.status} /></td>
                  <td className="px-4 py-3.5"><DocStatusBadge status={d.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewOpen(true)} aria-label="Preview" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Preview">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => setToast({ type: 'success', message: `${d.name} downloaded` })} aria-label="Download" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Download">
                        <Download size={15} />
                      </button>
                      {(d.status === 'pending' || d.status === 'review') && (
                        <>
                          <button onClick={() => setToast({ type: 'success', message: `${d.name} verified` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-success-dark hover:bg-success-light transition-colors" title="Accept">
                            <CheckCircle2 size={15} />
                          </button>
                          <button onClick={() => setToast({ type: 'danger', message: `${d.name} rejected` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-danger hover:bg-danger-light transition-colors" title="Reject">
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                      {d.status === 'reupload' && (
                        <button onClick={() => setToast({ type: 'info', message: 'Re-upload reminder sent' })} className="h-[28px] px-2.5 rounded-[7px] bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover transition-colors">
                          <RefreshCw size={12} className="inline mr-1" />Remind
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-admin-border flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-admin-muted">Showing 1-10 of 1,284 documents</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronLeft size={14} /></button>
            {[1, 2, 3, 4, 5, '...', 129].map((p, i) => (
              <button key={i} className={`w-8 h-8 rounded-[8px] text-[12px] font-semibold ${p === 1 ? 'bg-accent text-white' : 'border border-admin-border text-admin-medium hover:bg-table-hover'}`}>{p}</button>
            ))}
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Alert banner for expired */}
      {tab === 'expired' && (
        <div className="mt-5 rounded-[12px] border border-danger/30 bg-danger-light px-5 py-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-danger shrink-0" />
          <p className="text-[13px] text-danger-dark font-medium">5 suppliers have expired documents. Immediate action required to maintain compliance.</p>
        </div>
      )}

      {/* Preview modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Document Preview" subtitle="Tax Clearance Certificate.pdf" size="lg">
        <div className="rounded-[10px] bg-[#E9ECEF] h-[420px] flex items-center justify-center border border-admin-border">
          <div className="text-center">
            <span className="w-16 h-16 mx-auto rounded-[14px] bg-white text-secondary flex items-center justify-center">
              <FileText size={32} />
            </span>
            <p className="mt-3 text-[13px] font-semibold text-admin-text">Tax Clearance Certificate.pdf</p>
            <p className="text-[11px] text-admin-muted mt-1">720 KB · PDF</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
          <div className="rounded-[8px] bg-table-header border border-admin-border px-3.5 py-2.5">
            <p className="text-admin-muted text-[11px]">Supplier</p>
            <p className="font-semibold text-admin-text mt-0.5">ABC Trading (SRS-APR-001)</p>
          </div>
          <div className="rounded-[8px] bg-table-header border border-admin-border px-3.5 py-2.5">
            <p className="text-admin-muted text-[11px]">Uploaded</p>
            <p className="font-semibold text-admin-text mt-0.5">08 Jan 2025 · by ABC Trading</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-admin-border pt-4">
          <button onClick={() => setToast({ type: 'danger', message: 'Document rejected' })} className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-[8px] border border-danger text-danger text-[13px] font-semibold hover:bg-danger hover:text-white transition-colors">
            <XCircle size={15} /> Reject
          </button>
          <button onClick={() => { setViewOpen(false); setToast({ type: 'success', message: 'Document verified' }) }} className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-[8px] bg-success text-white text-[13px] font-semibold hover:bg-success-dark transition-colors">
            <CheckCircle2 size={15} /> Verify & Accept
          </button>
        </div>
      </Modal>

      {/* Bulk modal */}
      <Modal open={bulk} onClose={() => setBulk(false)} title="Batch Verify Documents" subtitle="12 documents in the verification queue">
        <div className="rounded-[10px] bg-table-header border border-admin-border px-4 py-3 mb-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-admin-text"><ShieldCheck size={16} className="text-success" /> You are about to approve 12 documents from 9 suppliers</p>
        </div>
        <p className="text-[12px] font-semibold text-admin-text mb-2">Documents included</p>
        <div className="space-y-1.5 mb-5 max-h-[180px] overflow-y-auto pr-1">
          {docs.filter((d) => d.status === 'pending' || d.status === 'review').map((d) => (
            <div key={d.id} className="flex items-center gap-2.5 text-[12px] text-admin-medium">
              <FileText size={13} className="text-secondary shrink-0" />
              <span className="flex-1 truncate">{d.name}</span>
              <span className="text-admin-muted font-mono">{d.supplier}</span>
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-primary" /> Send verification confirmation to suppliers
        </label>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-admin-border pt-4">
          <button onClick={() => setBulk(false)} className="h-[38px] px-4 rounded-[8px] text-[13px] font-semibold text-admin-medium hover:bg-table-hover transition-colors">Cancel</button>
          <button onClick={() => { setBulk(false); setToast({ type: 'success', message: '12 documents verified' }) }} className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-[8px] bg-success text-white text-[13px] font-semibold hover:bg-success-dark transition-colors">
            <CheckCheck size={15} /> Approve 12 Documents
          </button>
        </div>
      </Modal>
    </div>
  )
}
