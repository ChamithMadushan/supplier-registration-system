import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Download, Upload, Plus, X, ChevronDown, ChevronRight, Eye, PencilLine,
  MoreHorizontal, Mail, Phone, RefreshCw, ScrollText, Flag, Archive, Ban, CheckCircle2,
  Table2, LayoutGrid, Trello, Filter, Save, ChevronLeft, ChevronRight as Next,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import { AppStatusBadge, PriorityBadge } from '../../components/admin/Badges'
import Button from '../../components/ui/Button'

const statusTabs = [
  { key: 'all', label: 'All', count: 75 },
  { key: 'new', label: 'New', count: 23 },
  { key: 'screening', label: 'Screening', count: 8 },
  { key: 'verification', label: 'Verification', count: 12 },
  { key: 'evaluation', label: 'Evaluation', count: 9 },
  { key: 'ready', label: 'Ready to Approve', count: 5 },
  { key: 'approved', label: 'Approved', count: 412 },
  { key: 'conditional', label: 'Conditional', count: 15 },
  { key: 'rejected', label: 'Rejected', count: 45 },
  { key: 'probationary', label: 'Probationary', count: 8 },
]

const apps = [
  { id: 1, ref: 'SRS-2024-001234', company: 'ABC Trading (Pvt) Ltd', contact: 'John Perera', cat: 'Raw Materials', district: 'Colombo', submitted: '08 Jan 2025', days: 7, status: 'verification', prio: 'medium', assigned: 'K. Perera', extra: 2 },
  { id: 2, ref: 'SRS-2024-001235', company: 'XYZ Supplies (Pvt) Ltd', contact: 'Nimali Silva', cat: 'IT & Technology', district: 'Gampaha', submitted: '09 Jan 2025', days: 6, status: 'new', prio: 'high', assigned: 'Unassigned', extra: 1 },
  { id: 3, ref: 'SRS-2024-001236', company: 'DEF Services', contact: 'Ruwan Dias', cat: 'Services', district: 'Kandy', submitted: '05 Jan 2025', days: 10, status: 'screening', prio: 'medium', assigned: 'A. Dias', extra: 0 },
  { id: 4, ref: 'SRS-2024-001237', company: 'GHI Constructs', contact: 'Mala Fernando', cat: 'Construction', district: 'Colombo', submitted: '03 Jan 2025', days: 12, status: 'evaluation', prio: 'high', assigned: 'K. Perera', extra: 3 },
  { id: 5, ref: 'SRS-2024-001238', company: 'JKL Trading', contact: 'Saman Perera', cat: 'Logistics', district: 'Negombo', submitted: '12 Jan 2025', days: 3, status: 'new', prio: 'low', assigned: 'Unassigned', extra: 0 },
  { id: 6, ref: 'SRS-2024-001239', company: 'MNO Services (Pvt) Ltd', contact: 'Anura Jay', cat: 'Services', district: 'Matara', submitted: '02 Jan 2025', days: 13, status: 'verification', prio: 'critical', assigned: 'S. Fernando', extra: 2 },
  { id: 7, ref: 'SRS-2024-001240', company: 'PQR Manufacturing', contact: 'Kumari De', cat: 'Raw Materials', district: 'Colombo', submitted: '10 Jan 2025', days: 5, status: 'screening', prio: 'low', assigned: 'A. Dias', extra: 1 },
  { id: 8, ref: 'SRS-2024-001241', company: 'STU Engineering', contact: 'Nuwan Silva', cat: 'IT & Technology', district: 'Kurunegala', submitted: '06 Jan 2025', days: 9, status: 'evaluation', prio: 'medium', assigned: 'K. Perera', extra: 0 },
  { id: 9, ref: 'SRS-2024-001242', company: 'VWX Food Products', contact: 'Chandima', cat: 'Others', district: 'Galle', submitted: '14 Jan 2025', days: 1, status: 'new', prio: 'low', assigned: 'Unassigned', extra: 2 },
  { id: 10, ref: 'SRS-2024-001243', company: 'YZA Chemicals', contact: 'Roshan P', cat: 'Raw Materials', district: 'Colombo', submitted: '04 Jan 2025', days: 11, status: 'ready', prio: 'high', assigned: 'S. Fernando', extra: 1 },
]

const kanbanCols = [
  { status: 'new', title: 'NEW', count: 23, color: 'bg-info' },
  { status: 'screening', title: 'SCREENING', count: 8, color: 'bg-purple' },
  { status: 'verification', title: 'VERIFY', count: 12, color: 'bg-warning' },
  { status: 'evaluation', title: 'EVALUATE', count: 9, color: 'bg-accent' },
]

function Initials({ name }) {
  return (
    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[11px] font-bold shrink-0">
      {name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
    </span>
  )
}

function Avatar({ name }) {
  const init = name.split(' ').map((n) => n[0]).join('')
  return <span className="w-7 h-7 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-[10px] font-bold">{init}</span>
}

export default function Applications() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [view, setView] = useState('table')
  const [selected, setSelected] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const filtered = tab === 'all' ? apps : apps.filter((a) => a.status === tab)

  const toggleAll = (checked) => setSelected(checked ? filtered.map((a) => a.id) : [])
  const toggleOne = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const app = apps[0]

  return (
    <div>
      <PageHeader
        title="Applications Management"
        subtitle="75 total applications"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Applications' }, { label: 'All Applications' }]}
        actions={
          <>
            <Button variant="ghost" size="sm"><Upload size={15} /> Import</Button>
            <Button variant="ghost" size="sm"><Download size={15} /> Export <ChevronDown size={13} /></Button>
            <Button size="sm"><Plus size={15} /> Manual Entry</Button>
          </>
        }
      />

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {statusTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-white text-admin-text shadow border-b-2 border-accent' : 'text-admin-light hover:text-admin-text hover:bg-white/70'
            }`}
          >
            {t.key !== 'all' && <span className={`w-2 h-2 rounded-full ${t.key === 'new' ? 'bg-info' : t.key === 'screening' ? 'bg-purple' : t.key === 'verification' ? 'bg-warning' : t.key === 'evaluation' ? 'bg-accent' : t.key === 'ready' ? 'bg-info' : t.key === 'approved' ? 'bg-success' : t.key === 'conditional' ? 'bg-teal' : t.key === 'rejected' ? 'bg-danger' : 'bg-[#6C757D]'}`} />}
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
              placeholder="Search by company name, ref number, email, NIC..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Category', 'District', 'Supplier Type', 'Date From', 'Date To', 'Assigned To', 'Priority', 'Days Open'].map((f) => (
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
          <button className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors">
            <Save size={13} /> Save Filter
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[12px] bg-primary text-white px-5 py-3 anim-fade-up">
          <span className="text-[13px] font-semibold">{selected.length} application(s) selected</span>
          <span className="w-px h-5 bg-white/25" />
          {['Assign To', 'Change Status', 'Send Email'].map((a) => (
            <button key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-white/10 hover:bg-white/20 text-[12px] font-semibold transition-colors">
              {a} <ChevronDown size={12} />
            </button>
          ))}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-white/10 hover:bg-white/20 text-[12px] font-semibold transition-colors">
            Export Selected
          </button>
          <button onClick={() => setSelected([])} className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-[7px] text-[12px] font-semibold hover:bg-white/20 transition-colors">
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-[13px] text-admin-light">
          {tab === 'all' ? '75' : statusTabs.find((t) => t.key === tab)?.count} applications found
        </span>
        <div className="flex items-center gap-1 bg-white rounded-[9px] border border-admin-border p-1">
          {[
            { key: 'table', icon: Table2, label: 'Table View' },
            { key: 'card', icon: LayoutGrid, label: 'Card View' },
            { key: 'kanban', icon: Trello, label: 'Kanban View' },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-colors ${view === v.key ? 'bg-primary text-white' : 'text-admin-light hover:text-admin-text'}`}
            >
              <v.icon size={14} /> {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" className="w-4 h-4 accent-primary" checked={selected.length === filtered.length && filtered.length > 0} onChange={(e) => toggleAll(e.target.checked)} />
                  </th>
                  <th className="px-3 py-3">Ref #</th>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">District</th>
                  <th className="px-3 py-3">Submitted</th>
                  <th className="px-3 py-3">Days Open</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Assigned</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <React.Fragment key={a.id}>
                    <tr className={`border-t border-[#F0F0F0] hover:bg-table-header transition-colors ${expanded === a.id ? 'bg-table-header' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" className="w-4 h-4 accent-primary" checked={selected.includes(a.id)} onChange={() => toggleOne(a.id)} />
                      </td>
                      <td className="px-3 py-3">
                        <button onClick={() => setExpanded(expanded === a.id ? null : a.id)} className="inline-flex items-center gap-1 text-[12px] font-mono font-semibold text-secondary hover:underline">
                          {a.ref}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Initials name={a.company} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-admin-text truncate">{a.company}</p>
                            <p className="text-[11px] text-admin-muted">{a.contact}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-admin-medium">
                        {a.cat}
                        {a.extra > 0 && <span className="ml-1.5 text-[10px] font-bold text-admin-muted bg-table-header px-1.5 py-0.5 rounded-full">+{a.extra} more</span>}
                      </td>
                      <td className="px-3 py-3 text-[12px] text-admin-medium">{a.district}</td>
                      <td className="px-3 py-3 text-[12px] text-admin-medium">{a.submitted}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[12px] font-semibold font-mono ${a.days > 10 ? 'text-danger' : a.days > 5 ? 'text-accent-hover' : 'text-admin-medium'}`}>
                          {a.days > 10 ? '⚠️ ' : ''}{a.days} days
                        </span>
                      </td>
                      <td className="px-3 py-3"><AppStatusBadge status={a.status} /></td>
                      <td className="px-3 py-3"><PriorityBadge priority={a.prio} /></td>
                      <td className="px-3 py-3">
                        {a.assigned === 'Unassigned' ? (
                          <button className="text-[11px] font-semibold text-secondary hover:underline">— Assign</button>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[12px] text-admin-medium"><Avatar name={a.assigned} /> {a.assigned}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate('/admin/applications/review')} aria-label="View" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => navigate('/admin/applications/review')} className="h-[28px] px-2.5 rounded-[7px] bg-primary text-white text-[11px] font-semibold hover:bg-primary-light transition-colors">
                            Review
                          </button>
                          <div className="relative">
                            <button onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)} aria-label="More" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-table-hover transition-colors">
                              <MoreHorizontal size={15} />
                            </button>
                            {openMenu === a.id && (
                              <div className="absolute right-0 top-8 w-[180px] bg-white rounded-[10px] border border-admin-border shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-20 anim-modal-in">
                                {[
                                  { icon: Mail, label: 'Send Email' },
                                  { icon: Phone, label: 'Call Supplier' },
                                  { icon: RefreshCw, label: 'Reassign' },
                                  { icon: ScrollText, label: 'View History' },
                                  { icon: Flag, label: 'Flag Application' },
                                  { icon: Archive, label: 'Archive' },
                                ].map((m) => (
                                  <button key={m.label} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-admin-medium hover:bg-table-hover transition-colors">
                                    <m.icon size={14} className="text-admin-muted" /> {m.label}
                                  </button>
                                ))}
                                <div className="my-1.5 h-px bg-admin-border" />
                                {[
                                  { icon: CheckCircle2, label: 'Approve', color: 'text-success-dark' },
                                  { icon: Ban, label: 'Reject', color: 'text-danger' },
                                ].map((m) => (
                                  <button key={m.label} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] hover:bg-table-hover transition-colors ${m.color}`}>
                                    <m.icon size={14} /> {m.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expanded === a.id && (
                      <tr className="bg-table-header">
                        <td colSpan={11} className="px-6 py-5 anim-fade-up">
                          <div className="rounded-[10px] border border-admin-border bg-white p-5">
                            <p className="text-[14px] font-bold text-admin-text mb-4">Quick Summary — {a.company}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
                              <div><p className="text-admin-muted mb-1">Reg / Type</p><p className="font-medium text-admin-text">PV/00123456 · Pvt Ltd</p></div>
                              <div><p className="text-admin-muted mb-1">Tax</p><p className="font-medium text-success-dark">VAT Verified ✅ · EPF Registered ✅</p></div>
                              <div><p className="text-admin-muted mb-1">Documents</p><p className="font-medium text-admin-text">10/12 uploaded</p></div>
                              <div><p className="text-admin-muted mb-1">Missing</p><p className="font-medium text-danger">Tax Clearance, Bank Statement</p></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-admin-border flex flex-wrap items-center gap-2">
                              <Button size="sm" onClick={() => navigate('/admin/applications/review')}><Eye size={14} /> Full Review</Button>
                              <Button size="sm" variant="secondary"><Mail size={14} /> Email Supplier</Button>
                              <button onClick={() => setExpanded(null)} className="ml-auto text-[12px] font-semibold text-admin-muted hover:text-admin-text">Close <X size={12} className="inline" /></button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-admin-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] text-admin-muted">Showing 1-10 of 75 applications</span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronLeft size={14} /></button>
              {[1, 2, 3, 4, 5, '...', 8].map((p, i) => (
                <button key={i} className={`w-8 h-8 rounded-[8px] text-[12px] font-semibold ${p === 1 ? 'bg-accent text-white' : 'border border-admin-border text-admin-medium hover:bg-table-hover'}`}>{p}</button>
              ))}
              <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><Next size={14} /></button>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-admin-muted">
              Per page:
              {[10, 25, 50, 100].map((n) => (
                <button key={n} className={`px-2 py-1 rounded-[6px] ${n === 10 ? 'bg-primary text-white' : 'hover:bg-table-hover'}`}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CARD VIEW */}
      {view === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow">
              <div className="flex items-start justify-between">
                <AppStatusBadge status={a.status} />
                <PriorityBadge priority={a.prio} />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Initials name={a.company} />
                <div>
                  <p className="text-[14px] font-bold text-admin-text">{a.company}</p>
                  <p className="text-[11px] text-admin-muted font-mono">{a.ref}</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-admin-medium">{a.cat} · {a.district}</p>
              <div className="mt-3 flex items-center gap-4 text-[12px] text-admin-medium">
                <span>Submitted {a.submitted}</span>
                <span className={a.days > 10 ? 'text-danger font-bold' : ''}>{a.days} days open</span>
              </div>
              <div className="mt-4 pt-3 border-t border-admin-border flex items-center justify-between">
                <span className="text-[12px] text-admin-muted">{a.assigned}</span>
                <button onClick={() => navigate('/admin/applications/review')} className="inline-flex items-center gap-1 text-[12px] font-bold text-secondary hover:text-primary">
                  Review <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KANBAN VIEW */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {kanbanCols.map((col) => (
            <div key={col.status} className="bg-table-header rounded-[12px] border border-admin-border p-3">
              <div className="flex items-center gap-2 px-1.5 py-1.5 mb-3">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                <p className="text-[12px] font-bold uppercase tracking-wide text-admin-text">{col.title}</p>
                <span className="ml-auto text-[11px] font-bold bg-white text-admin-light px-2 py-0.5 rounded-full">{col.count}</span>
              </div>
              <div className="space-y-2.5">
                {filtered.filter((a) => a.status === col.status).map((a) => (
                  <div key={a.id} className="bg-white rounded-[10px] border border-admin-border p-4 shadow-sm cursor-grab hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-secondary">{a.ref}</span>
                      <PriorityBadge priority={a.prio} pill={false} />
                    </div>
                    <p className="mt-1.5 text-[13px] font-bold text-admin-text">{a.company}</p>
                    <p className="text-[11px] text-admin-muted">{a.cat}</p>
                    <p className="mt-1 text-[11px] text-admin-medium">{a.days} days open</p>
                    <div className="mt-3 pt-2.5 border-t border-admin-border flex items-center justify-between">
                      <span className="text-[11px] text-admin-muted">👤 {a.assigned}</span>
                      <button onClick={() => navigate('/admin/applications/review')} className="text-[11px] font-bold text-secondary hover:text-primary">Review →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
