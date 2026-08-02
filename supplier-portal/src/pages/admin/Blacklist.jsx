import React, { useState } from 'react'
import {
  Ban, ShieldAlert, Search, ChevronDown, ChevronLeft, ChevronRight, Download,
  MoreHorizontal, Plus, AlertTriangle, UserCheck, FileWarning, Eye, Mail,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const blacklist = [
  { id: 1, company: 'Fake Trading Co Ltd', code: 'SRS-APR-015', reason: 'Fraudulent documentation', severity: 'Critical', listed: '02 Jan 2025', by: 'K. Perera', reapply: 'Never', contact: '—' },
  { id: 2, company: 'Phantom Supplies', code: 'SRS-APR-089', reason: 'Repeated delivery failures (5 instances)', severity: 'High', listed: '18 Dec 2024', by: 'S. Fernando', reapply: 'Dec 2026', contact: '—' },
  { id: 3, company: 'Shadow Logistics (Pvt) Ltd', code: 'SRS-APR-120', reason: 'Compliance violation - expired licenses', severity: 'High', listed: '30 Nov 2024', by: 'A. Dias', reapply: 'Jun 2026', contact: '—' },
  { id: 4, company: 'Rogue Builders', code: 'SRS-APR-198', reason: 'Safety incident - unresolved', severity: 'Critical', listed: '12 Nov 2024', by: 'K. Perera', reapply: 'Never', contact: '—' },
  { id: 5, company: 'Ghost Manufacturing', code: 'SRS-APR-241', reason: 'Conflict of interest discovered', severity: 'Medium', listed: '25 Oct 2024', by: 'S. Fernando', reapply: 'Oct 2026', contact: '—' },
  { id: 6, company: 'Hollow Traders', code: 'SRS-APR-300', reason: 'Misrepresentation of credentials', severity: 'Critical', listed: '10 Oct 2024', by: 'A. Dias', reapply: 'Never', contact: '—' },
  { id: 7, company: 'Void Services', code: 'SRS-APR-342', reason: 'Quality failures below minimum threshold', severity: 'High', listed: '02 Sep 2024', by: 'K. Perera', reapply: 'Sep 2026', contact: '—' },
  { id: 8, company: 'Mirage Solutions', code: 'SRS-APR-378', reason: 'Unpaid invoices / debt default', severity: 'Medium', listed: '18 Aug 2024', by: 'S. Fernando', reapply: 'Aug 2026', contact: '—' },
]

const severityMap = {
  Critical: 'bg-danger text-white',
  High: 'bg-accent/15 text-accent-hover',
  Medium: 'bg-warning-light text-warning-dark',
  Low: 'bg-info-light text-info',
}

export default function Blacklist() {
  const [addOpen, setAddOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(null)
  const [toast, setToast] = useState(null)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Blacklist Register"
        subtitle="Suppliers excluded from procurement activities"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Suppliers' }, { label: 'Blacklist' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export
            </button>
            <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-danger text-white text-[13px] font-semibold hover:opacity-90 transition-colors">
              <Plus size={15} /> Add to Blacklist
            </button>
          </>
        }
      />

      {/* Warning banner */}
      <div className="mb-5 rounded-[12px] border border-danger/30 bg-danger-light px-5 py-4 flex items-center gap-3">
        <ShieldAlert size={20} className="text-danger shrink-0" />
        <div className="flex-1">
          <p className="text-[14px] font-bold text-danger-dark">8 suppliers are currently blacklisted</p>
          <p className="text-[12px] text-danger/80 mt-0.5">Blacklisted suppliers are excluded from all procurement activities and cannot reapply (subject to blacklist policy).</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={Ban} iconBg="bg-danger-light text-danger" border="border-danger" label="Total Blacklisted" value="8" sub="0.5% of all registered" />
        <AdminStatCard icon={FileWarning} iconBg="bg-accent/15 text-accent-hover" border="border-accent" label="Critical Cases" value="3" sub="Permanent exclusion" />
        <AdminStatCard icon={AlertTriangle} iconBg="bg-warning-light text-warning-dark" border="border-warning" label="High Severity" value="3" sub="Temporary exclusion" />
        <AdminStatCard icon={UserCheck} iconBg="bg-success-light text-success-dark" border="border-success" label="Reinstated (12 mo)" value="2" sub="Following appeal" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              placeholder="Search by company name, code, reason..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-3 rounded-[7px] bg-danger text-white text-[12px] font-semibold hover:opacity-90 transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Severity', 'Reason Type', 'Listed Date', 'Listed By'].map((f) => (
              <button key={f} className="inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
                {f} <ChevronDown size={13} className="text-admin-muted" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                <th className="px-6 py-3">Supplier</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Listed Date</th>
                <th className="px-4 py-3">Listed By</th>
                <th className="px-4 py-3">Eligible to Reapply</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.map((b) => (
                <tr key={b.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0"><Ban size={16} /></span>
                      <div>
                        <p className="text-[13px] font-semibold text-admin-text">{b.company}</p>
                        <p className="text-[11px] text-admin-muted">{b.contact === '—' ? 'No contact on record' : b.contact}</p>
                      </div>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] font-mono font-semibold text-secondary">{b.code}</td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium max-w-[240px]">{b.reason}</td>
                  <td className="px-4 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${severityMap[b.severity]}`}>{b.severity}</span></td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{b.listed}</td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{b.by}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-semibold ${b.reapply === 'Never' ? 'text-danger font-bold' : 'text-admin-medium'}`}>{b.reapply}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setToast({ type: 'info', message: 'Viewing blacklist case' })} aria-label="View" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View Case">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => setToast({ type: 'info', message: 'Notifying registries' })} aria-label="Notify" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Notify Registries">
                        <Mail size={15} />
                      </button>
                      <button onClick={() => setRemoveOpen(b)} aria-label="Remove" className="h-[28px] px-2.5 rounded-[7px] bg-success text-white text-[11px] font-semibold hover:bg-success-dark transition-colors">
                        Reinstate
                      </button>
                      <button className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-table-hover transition-colors" title="More">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-admin-border flex items-center justify-between">
          <span className="text-[12px] text-admin-muted">Showing 1-8 of 8 blacklisted suppliers</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 rounded-[8px] bg-accent text-white text-[12px] font-semibold">1</button>
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add to Blacklist" subtitle="Exclude a supplier from procurement">
        <p className="text-[12px] font-semibold text-admin-text mb-1.5">Search supplier</p>
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input placeholder="Company name or supplier code..." className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none" />
        </div>
        <div className="rounded-[10px] bg-table-header border border-admin-border px-4 py-3 mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[10px] font-bold">QZ</span>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-admin-text">QuickTrade Zone (Pvt) Ltd</p>
            <p className="text-[11px] text-admin-muted font-mono">SRS-APR-412</p>
          </div>
          <span className="text-[11px] text-admin-muted">Score: 58</span>
        </div>
        <p className="text-[12px] font-semibold text-admin-text mb-2">Reason for blacklisting (required)</p>
        <div className="space-y-2 mb-4">
          {['Fraudulent documentation', 'Compliance violation', 'Repeated delivery failures', 'Quality failures', 'Conflict of interest', 'Debt default'].map((r) => (
            <label key={r} className="flex items-center gap-2.5 rounded-[8px] border border-admin-border px-3.5 py-2.5 cursor-pointer hover:bg-table-header transition-colors">
              <input type="checkbox" className="accent-primary" />
              <span className="text-[13px] text-admin-text">{r}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Severity</p>
            <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">Critical <ChevronDown size={13} className="text-admin-muted" /></button>
          </div>
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Eligible to Reapply</p>
            <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">Never <ChevronDown size={13} className="text-admin-muted" /></button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> Notify supplier of blacklisting</label>
          <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> Share case with national procurement registry</label>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-admin-border pt-4">
          <button onClick={() => setAddOpen(false)} className="h-[38px] px-4 rounded-[8px] text-[13px] font-semibold text-admin-medium hover:bg-table-hover transition-colors">Cancel</button>
          <button onClick={() => { setAddOpen(false); setToast({ type: 'danger', message: 'Supplier blacklisted' }) }} className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-[8px] bg-danger text-white text-[13px] font-semibold hover:opacity-90 transition-colors">
            <Ban size={15} /> Confirm Blacklist
          </button>
        </div>
      </Modal>

      {/* Reinstate modal */}
      <Modal open={!!removeOpen} onClose={() => setRemoveOpen(null)} title="Reinstate Supplier" subtitle="Remove from blacklist register">
        {removeOpen && (
          <>
            <div className="rounded-[10px] bg-table-header border border-admin-border px-4 py-3 mb-5">
              <p className="text-[13px] font-semibold text-admin-text">{removeOpen.company}</p>
              <p className="text-[11px] text-admin-muted font-mono">{removeOpen.code}</p>
            </div>
            <p className="text-[12px] font-semibold text-admin-text mb-2">Reinstatement type</p>
            <div className="space-y-2 mb-4">
              {['Full reinstatement (restore supplier status)', 'Conditional reinstatement (probation period)', 'Allow reapplication only'].map((r, i) => (
                <label key={r} className="flex items-center gap-2.5 rounded-[8px] border border-admin-border px-3.5 py-2.5 cursor-pointer hover:bg-table-header transition-colors">
                  <input type="radio" name="reinst" defaultChecked={i === 0} className="accent-primary" />
                  <span className="text-[13px] text-admin-text">{r}</span>
                </label>
              ))}
            </div>
            <p className="text-[12px] font-semibold text-admin-text mb-1.5">Notes</p>
            <textarea rows={3} placeholder="Reason for reinstatement..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none" />
            <div className="mt-5 flex items-center justify-end gap-3 border-t border-admin-border pt-4">
              <button onClick={() => setRemoveOpen(null)} className="h-[38px] px-4 rounded-[8px] text-[13px] font-semibold text-admin-medium hover:bg-table-hover transition-colors">Cancel</button>
              <button onClick={() => { setRemoveOpen(null); setToast({ type: 'success', message: 'Supplier reinstated' }) }} className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-[8px] bg-success text-white text-[13px] font-semibold hover:bg-success-dark transition-colors">
                <UserCheck size={15} /> Reinstate Supplier
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
