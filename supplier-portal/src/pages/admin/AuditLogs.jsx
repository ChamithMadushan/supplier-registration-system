import React, { useState } from 'react'
import {
  FileClock, ShieldCheck, Download, Search, ChevronDown, ChevronLeft, ChevronRight,
  Eye, LogIn, LogOut, Lock, PencilLine, Trash2, CheckCircle2, FilePlus2, Send, Ban, X,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { actionColors } from '../../components/admin/Badges'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const actionMeta = {
  login: { label: 'LOGIN', bg: 'bg-[#E9ECEF] text-[#495057]' },
  logout: { label: 'LOGOUT', bg: 'bg-[#E9ECEF] text-[#495057]' },
  view: { label: 'VIEW', bg: 'bg-info-light text-info' },
  create: { label: 'CREATE', bg: 'bg-success-light text-success-dark' },
  update: { label: 'UPDATE', bg: 'bg-warning-light text-warning-dark' },
  delete: { label: 'DELETE', bg: 'bg-danger-light text-danger' },
  approve: { label: 'APPROVE', bg: 'bg-accent/15 text-accent-hover' },
  reject: { label: 'REJECT', bg: 'bg-danger-light text-danger' },
  export: { label: 'EXPORT', bg: 'bg-purple-light text-purple' },
  security: { label: 'SECURITY', bg: 'bg-danger-light text-danger' },
}

const logs = [
  { id: 1, time: '15 Jan 2025 · 11:42 AM', user: 'Kamal Perera', role: 'Procurement Manager', action: 'approve', module: 'Applications', entity: 'SRS-2024-001234', ip: '192.168.1.44', detail: 'Approved ABC Trading as Preferred Supplier' },
  { id: 2, time: '15 Jan 2025 · 10:15 AM', user: 'System', role: 'Automated', action: 'export', module: 'Reports', entity: 'Expiry Digest', ip: 'system', detail: 'Generated monthly expiry report' },
  { id: 3, time: '15 Jan 2025 · 9:30 AM', user: 'Anuja Dias', role: 'Procurement Officer', action: 'update', module: 'Applications', entity: 'SRS-2024-001235', ip: '192.168.1.52', detail: 'Changed status to New · added note' },
  { id: 4, time: '14 Jan 2025 · 4:55 PM', user: 'Saman Fernando', role: 'Verification Officer', action: 'view', module: 'Documents', entity: 'Tax Clearance - ABC', ip: '192.168.1.61', detail: 'Viewed document verification queue' },
  { id: 5, time: '14 Jan 2025 · 3:20 PM', user: 'Nuwan Jay', role: 'System Admin', action: 'security', module: 'Security', entity: 'Failed login', ip: '203.115.22.9', detail: '3 failed login attempts detected' },
  { id: 6, time: '14 Jan 2025 · 1:05 PM', user: 'Kamal Perera', role: 'Procurement Manager', action: 'create', module: 'Suppliers', entity: 'SRS-APR-412', ip: '192.168.1.44', detail: 'Manually registered QuickTrade Zone' },
  { id: 7, time: '14 Jan 2025 · 11:48 AM', user: 'System', role: 'Automated', action: 'reject', module: 'Applications', entity: 'SRS-2024-001199', ip: 'system', detail: 'Auto-rejected due to failed compliance check' },
  { id: 8, time: '13 Jan 2025 · 5:30 PM', user: 'Anuja Dias', role: 'Procurement Officer', action: 'export', module: 'Reports', entity: 'Q4 Summary', ip: '192.168.1.52', detail: 'Exported quarterly summary report' },
  { id: 9, time: '13 Jan 2025 · 2:10 PM', user: 'Kamal Perera', role: 'Procurement Manager', action: 'delete', module: 'Blacklist', entity: 'SR-2024-077', ip: '192.168.1.44', detail: 'Removed outdated blacklist entry' },
  { id: 10, time: '13 Jan 2025 · 10:00 AM', user: 'Saman Fernando', role: 'Verification Officer', action: 'login', module: 'Auth', entity: 'Session', ip: '192.168.1.61', detail: 'Successful 2FA login' },
]

const entityFilter = ['All Modules', 'Applications', 'Suppliers', 'Documents', 'Reports', 'Security', 'Auth', 'Blacklist']
const userFilter = ['All Users', 'Kamal Perera', 'Anuja Dias', 'Saman Fernando', 'Nuwan Jay', 'System']

export default function AuditLogs() {
  const [toast, setToast] = useState(null)
  const [detailOpen, setDetailOpen] = useState(null)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Audit Logs"
        subtitle="Complete trail of system activity for compliance"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'System' }, { label: 'Audit Logs' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export Logs
            </button>
            <button onClick={() => setToast({ type: 'success', message: 'Log retention policy updated' })} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <ShieldCheck size={15} /> Retention Policy
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={FileClock} iconBg="bg-primary/10 text-primary" border="border-primary" label="Total Events (30d)" value="4,812" sub="Immutable audit trail" />
        <AdminStatCard icon={CheckCircle2} iconBg="bg-success-light text-success-dark" border="border-success" label="Successful Actions" value="4,731" sub="98.3% of all events" />
        <AdminStatCard icon={Lock} iconBg="bg-danger-light text-danger" border="border-danger" label="Security Events" value="14" sub="2 failed login attempts" />
        <AdminStatCard icon={Eye} iconBg="bg-info-light text-info" border="border-info" label="Data Accesses (7d)" value="312" sub="View operations" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              placeholder="Search by user, entity, IP address..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
              Action: All <ChevronDown size={13} className="text-admin-muted" />
            </button>
            <button className="inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
              Date Range: Last 7 days <ChevronDown size={13} className="text-admin-muted" />
            </button>
            <button className="inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
              User: All <ChevronDown size={13} className="text-admin-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Module quick filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {entityFilter.map((f, i) => (
          <button key={f} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-white border border-admin-border text-admin-medium hover:border-admin-border-dark'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                  <td className="px-6 py-3.5 text-[12px] text-admin-medium whitespace-nowrap">{l.time}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {l.user === 'System' ? 'SY' : l.user.split(' ').map((n) => n[0]).join('')}
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-admin-text">{l.user}</p>
                        <p className="text-[11px] text-admin-muted">{l.role}</p>
                      </div>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${actionMeta[l.action].bg}`}>{actionMeta[l.action].label}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{l.module}</td>
                  <td className="px-4 py-3.5 text-[12px] font-mono font-semibold text-secondary">{l.entity}</td>
                  <td className="px-4 py-3.5 text-[12px] font-mono text-admin-medium">{l.ip}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => setDetailOpen(l)} aria-label="Details" className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-admin-border flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-admin-muted">Showing 1-10 of 4,812 events</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronLeft size={14} /></button>
            {[1, 2, 3, 4, 5, '...', 482].map((p, i) => (
              <button key={i} className={`w-8 h-8 rounded-[8px] text-[12px] font-semibold ${p === 1 ? 'bg-accent text-white' : 'border border-admin-border text-admin-medium hover:bg-table-hover'}`}>{p}</button>
            ))}
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detailOpen} onClose={() => setDetailOpen(null)} title="Audit Log Details" subtitle={detailOpen?.time}>
        {detailOpen && (
          <div>
            <div className="rounded-[10px] bg-table-header border border-admin-border p-4 mb-5">
              <p className="text-[13px] font-semibold text-admin-text">{detailOpen.detail}</p>
              <p className="text-[11px] text-admin-muted mt-1 font-mono">{detailOpen.ip}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              {[
                ['User', detailOpen.user],
                ['Role', detailOpen.role],
                ['Action', detailOpen.action.toUpperCase()],
                ['Module', detailOpen.module],
                ['Entity', detailOpen.entity],
                ['Timestamp', detailOpen.time],
                ['IP Address', detailOpen.ip],
                ['Device', 'Chrome · Windows 11'],
              ].map(([l, v]) => (
                <div key={l} className="rounded-[8px] border border-admin-border px-3.5 py-2.5">
                  <p className="text-admin-muted text-[11px]">{l}</p>
                  <p className="font-semibold text-admin-text mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-admin-muted flex items-center gap-1.5"><ShieldCheck size={13} className="text-success" /> This event is cryptographically sealed and cannot be modified.</p>
            <div className="mt-5 flex items-center justify-end border-t border-admin-border pt-4">
              <button onClick={() => setDetailOpen(null)} className="h-[38px] px-4 rounded-[8px] text-[13px] font-semibold text-admin-medium hover:bg-table-hover transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
