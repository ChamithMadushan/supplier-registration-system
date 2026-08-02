import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Download, Plus, ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal,
  Mail, Phone, RefreshCw, Archive, Filter, X, Table2, LayoutGrid, Star, MapPin,
  ShieldCheck, BarChart3, FileClock, BadgeCheck, Ban,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { SupplierStatusBadge } from '../../components/admin/Badges'

const suppliers = [
  { id: 1, code: 'SRS-APR-001', company: 'ABC Trading (Pvt) Ltd', contact: 'John Perera', cat: 'Raw Materials', district: 'Colombo', score: 92, status: 'strategic', docs: '12/12', renewed: '15 Jan 2025', email: 'john@abctrading.lk' },
  { id: 2, code: 'SRS-APR-034', company: 'XYZ Supplies (Pvt) Ltd', contact: 'Nimali Silva', cat: 'IT & Technology', district: 'Gampaha', score: 84, status: 'preferred', docs: '11/12', renewed: '10 Jan 2025', email: 'nimali@xyzsupplies.lk' },
  { id: 3, code: 'SRS-APR-067', company: 'DEF Services', contact: 'Ruwan Dias', cat: 'Services', district: 'Kandy', score: 78, status: 'approved', docs: '12/12', renewed: '05 Jan 2025', email: 'ruwan@defservices.lk' },
  { id: 4, code: 'SRS-APR-102', company: 'GHI Constructs', contact: 'Mala Fernando', cat: 'Construction', district: 'Colombo', score: 71, status: 'conditional', docs: '9/12', renewed: '02 Jan 2025', email: 'mala@ghiconstructs.lk' },
  { id: 5, code: 'SRS-APR-140', company: 'JKL Trading', contact: 'Saman Perera', cat: 'Logistics', district: 'Negombo', score: 88, status: 'preferred', docs: '12/12', renewed: '28 Dec 2024', email: 'saman@jkltrading.lk' },
  { id: 6, code: 'SRS-APR-188', company: 'MNO Services (Pvt) Ltd', contact: 'Anura Jay', cat: 'Services', district: 'Matara', score: 64, status: 'probationary', docs: '10/12', renewed: '22 Dec 2024', email: 'anura@mnoservices.lk' },
  { id: 7, code: 'SRS-APR-231', company: 'PQR Manufacturing', contact: 'Kumari De', cat: 'Raw Materials', district: 'Colombo', score: 90, status: 'strategic', docs: '12/12', renewed: '18 Dec 2024', email: 'kumari@pqrmfg.lk' },
  { id: 8, code: 'SRS-APR-277', company: 'STU Engineering', contact: 'Nuwan Silva', cat: 'IT & Technology', district: 'Kurunegala', score: 82, status: 'approved', docs: '11/12', renewed: '14 Dec 2024', email: 'nuwan@stueng.lk' },
  { id: 9, code: 'SRS-APR-320', company: 'VWX Food Products', contact: 'Chandima R', cat: 'Food & Beverage', district: 'Galle', score: 75, status: 'approved', docs: '12/12', renewed: '10 Dec 2024', email: 'chandima@vwxfood.lk' },
  { id: 10, code: 'SRS-APR-366', company: 'YZA Chemicals', contact: 'Roshan P', cat: 'Raw Materials', district: 'Colombo', score: 69, status: 'conditional', docs: '8/12', renewed: '06 Dec 2024', email: 'roshan@yza.lk' },
]

const statusTabs = [
  { key: 'all', label: 'All Suppliers', count: 487 },
  { key: 'strategic', label: 'Strategic', count: 36 },
  { key: 'preferred', label: 'Preferred', count: 128 },
  { key: 'approved', label: 'Approved', count: 248 },
  { key: 'conditional', label: 'Conditional', count: 15 },
  { key: 'probationary', label: 'Probationary', count: 8 },
  { key: 'suspended', label: 'Suspended', count: 12 },
]

function ScorePill({ score }) {
  const color = score >= 85 ? 'bg-success-light text-success-dark' : score >= 75 ? 'bg-info-light text-info' : score >= 65 ? 'bg-warning-light text-warning-dark' : 'bg-danger-light text-danger'
  return <span className={`inline-flex items-center gap-1 text-[12px] font-bold font-mono px-2.5 py-1 rounded-full ${color}`}>{score}</span>
}

export default function Suppliers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [view, setView] = useState('table')
  const [openMenu, setOpenMenu] = useState(null)

  const filtered = tab === 'all' ? suppliers : suppliers.filter((s) => s.status === tab)

  return (
    <div>
      <PageHeader
        title="Supplier Database"
        subtitle="487 registered suppliers · 412 active on Approved Vendor List"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Suppliers' }, { label: 'Supplier Database' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export <ChevronDown size={13} />
            </button>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <Plus size={15} /> Add Supplier
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={BadgeCheck} iconBg="bg-success-light text-success-dark" border="border-success" label="On Approved Vendor List" value="412" trend="+8" trendUp sub="Strategic 36 · Preferred 128" onClick={() => navigate('/admin/suppliers')} />
        <AdminStatCard icon={ShieldCheck} iconBg="bg-info-light text-info" border="border-info" label="Compliance Verified" value="438" sub="90% of all registered" />
        <AdminStatCard icon={BarChart3} iconBg="bg-accent/15 text-accent-hover" border="border-accent" label="Avg Performance Score" value="4.2 / 5" sub="Based on last review cycle" />
        <AdminStatCard icon={FileClock} iconBg="bg-danger-light text-danger" border="border-danger" label="Expiring This Month" value="18" sub="Renewals due before 31 Jan" onClick={() => navigate('/admin/documents')} />
      </div>

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
            {t.key !== 'all' && <span className="w-2 h-2 rounded-full bg-accent" />}
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
              placeholder="Search by supplier code, company name, email, contact..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Category', 'District', 'Performance Score', 'Certifications', 'Doc Status'].map((f) => (
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

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-[13px] text-admin-light">{filtered.length} suppliers shown · Sorted by performance score</span>
        <div className="flex items-center gap-1 bg-white rounded-[9px] border border-admin-border p-1">
          {[
            { key: 'table', icon: Table2, label: 'Table' },
            { key: 'card', icon: LayoutGrid, label: 'Cards' },
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
                  <th className="px-5 py-3">Supplier</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Docs</th>
                  <th className="px-4 py-3">Last Renewal</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                    <td className="px-5 py-3.5">
                      <button onClick={() => navigate(`/admin/suppliers/${s.id}`)} className="flex items-center gap-3 text-left group">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                          {s.company.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-admin-text group-hover:text-secondary transition-colors truncate">{s.company}</p>
                          <p className="text-[11px] text-admin-muted truncate">{s.contact} · {s.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] font-mono font-semibold text-secondary">{s.code}</td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{s.cat}</td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium"><span className="inline-flex items-center gap-1"><MapPin size={12} className="text-admin-muted" /> {s.district}</span></td>
                    <td className="px-4 py-3.5"><ScorePill score={s.score} /></td>
                    <td className="px-4 py-3.5"><SupplierStatusBadge status={s.status} /></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[12px] font-mono font-semibold ${s.docs === '12/12' ? 'text-success-dark' : 'text-warning-dark'}`}>{s.docs}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{s.renewed}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/suppliers/${s.id}`)} aria-label="View" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => navigate(`/admin/suppliers/${s.id}`)} className="h-[28px] px-2.5 rounded-[7px] bg-primary text-white text-[11px] font-semibold hover:bg-primary-light transition-colors">
                          View
                        </button>
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)} aria-label="More" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-table-hover transition-colors">
                            <MoreHorizontal size={15} />
                          </button>
                          {openMenu === s.id && (
                            <div className="absolute right-0 top-8 w-[180px] bg-white rounded-[10px] border border-admin-border shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-20 anim-modal-in">
                              {[
                                { icon: Mail, label: 'Send Email' },
                                { icon: Phone, label: 'Call Contact' },
                                { icon: RefreshCw, label: 'Trigger Renewal' },
                                { icon: Star, label: 'Edit Scorecard' },
                                { icon: Archive, label: 'Archive' },
                                { icon: Ban, label: 'Suspend', color: 'text-danger' },
                              ].map((m) => (
                                <button key={m.label} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-admin-medium hover:bg-table-hover transition-colors ${m.color || ''}`}>
                                  <m.icon size={14} className={m.color || 'text-admin-muted'} /> {m.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-admin-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] text-admin-muted">Showing 1-10 of 487 suppliers</span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronLeft size={14} /></button>
              {[1, 2, 3, 4, 5, '...', 49].map((p, i) => (
                <button key={i} className={`w-8 h-8 rounded-[8px] text-[12px] font-semibold ${p === 1 ? 'bg-accent text-white' : 'border border-admin-border text-admin-medium hover:bg-table-hover'}`}>{p}</button>
              ))}
              <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronRight size={14} /></button>
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
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow">
              <div className="flex items-start justify-between">
                <SupplierStatusBadge status={s.status} />
                <ScorePill score={s.score} />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  {s.company.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-admin-text truncate">{s.company}</p>
                  <p className="text-[11px] text-admin-muted font-mono truncate">{s.code}</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-admin-medium">{s.cat} · {s.district}</p>
              <div className="mt-3 flex items-center gap-4 text-[12px] text-admin-medium">
                <span>Docs <span className={`font-mono font-bold ${s.docs === '12/12' ? 'text-success-dark' : 'text-warning-dark'}`}>{s.docs}</span></span>
                <span>Renewed {s.renewed}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-admin-border flex items-center justify-between">
                <span className="text-[12px] text-admin-muted">{s.contact}</span>
                <button onClick={() => navigate(`/admin/suppliers/${s.id}`)} className="inline-flex items-center gap-1 text-[12px] font-bold text-secondary hover:text-primary">
                  Open Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
