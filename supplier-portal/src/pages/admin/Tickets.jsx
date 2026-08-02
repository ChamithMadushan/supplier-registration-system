import React, { useState } from 'react'
import {
  LifeBuoy, Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Paperclip, Send,
  Clock3, CheckCircle2, RefreshCw, AlertTriangle, Phone, Mail, Plus, X, MessageSquare,
  Download, Star, Filter,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { PriorityBadge } from '../../components/admin/Badges'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const tickets = [
  { id: 1, ref: 'TS-2045', subject: 'Unable to upload bank statement', supplier: 'DEF Services', contact: 'Ruwan Dias', category: 'Technical', priority: 'high', status: 'open', assignee: 'K. Perera', created: '15 Jan 2025 · 9:15 AM', updated: '15 Jan 2025 · 10:05 AM', replies: 2, sla: '12h remaining' },
  { id: 2, ref: 'TS-2044', subject: 'Password reset request', supplier: 'GHI Constructs', contact: 'Mala Fernando', category: 'Account', priority: 'medium', status: 'pending', assignee: 'Unassigned', created: '15 Jan 2025 · 8:40 AM', updated: '15 Jan 2025 · 9:00 AM', replies: 0, sla: '1d remaining' },
  { id: 3, ref: 'TS-2043', subject: 'Question about renewal fee', supplier: 'JKL Trading', contact: 'Saman Perera', category: 'Billing', priority: 'low', status: 'open', assignee: 'A. Dias', created: '14 Jan 2025 · 4:20 PM', updated: '15 Jan 2025 · 9:30 AM', replies: 3, sla: '2d remaining' },
  { id: 4, ref: 'TS-2042', subject: 'Verification status unclear', supplier: 'XYZ Supplies', contact: 'Nimali Silva', category: 'Application', priority: 'high', status: 'resolved', assignee: 'K. Perera', created: '14 Jan 2025 · 2:10 PM', updated: '15 Jan 2025 · 8:30 AM', replies: 4, sla: 'Resolved' },
  { id: 5, ref: 'TS-2041', subject: 'Need help with 2FA setup', supplier: 'MNO Services', contact: 'Anura Jay', category: 'Account', priority: 'medium', status: 'open', assignee: 'S. Fernando', created: '14 Jan 2025 · 11:00 AM', updated: '14 Jan 2025 · 4:00 PM', replies: 1, sla: '6h remaining' },
  { id: 6, ref: 'TS-2040', subject: 'Document rejected incorrectly', supplier: 'PQR Manufacturing', contact: 'Kumari De', category: 'Application', priority: 'critical', status: 'pending', assignee: 'A. Dias', created: '14 Jan 2025 · 10:15 AM', updated: '14 Jan 2025 · 12:30 PM', replies: 2, sla: '3h remaining' },
  { id: 7, ref: 'TS-2039', subject: 'Request to change business type', supplier: 'STU Engineering', contact: 'Nuwan Silva', category: 'Profile', priority: 'low', status: 'closed', assignee: 'S. Fernando', created: '13 Jan 2025 · 3:45 PM', updated: '14 Jan 2025 · 9:00 AM', replies: 5, sla: 'Closed' },
]

const statusTabs = [
  { key: 'all', label: 'All Tickets', count: 3 },
  { key: 'open', label: 'Open', count: 1 },
  { key: 'pending', label: 'Pending', count: 2 },
  { key: 'resolved', label: 'Resolved', count: 1 },
  { key: 'closed', label: 'Closed', count: 1 },
]

const statusMeta = {
  open: { label: '● OPEN', bg: 'bg-info-light text-info' },
  pending: { label: '⏳ PENDING', bg: 'bg-warning-light text-warning-dark' },
  resolved: { label: '✓ RESOLVED', bg: 'bg-success-light text-success-dark' },
  closed: { label: '✕ CLOSED', bg: 'bg-table-header text-admin-muted' },
}

export default function Tickets() {
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const filtered = tab === 'all' ? tickets : tickets.filter((t) => t.status === tab)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Support Tickets"
        subtitle="Supplier inquiries and support requests"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'System' }, { label: 'Support Tickets' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export
            </button>
            <button onClick={() => setToast({ type: 'info', message: 'Ticket form opened' })} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <Plus size={15} /> New Ticket
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={LifeBuoy} iconBg="bg-primary/10 text-primary" border="border-primary" label="Open Tickets" value="3" sub="1 pending resolution" />
        <AdminStatCard icon={Clock3} iconBg="bg-warning-light text-warning-dark" border="border-warning" label="SLA Breaches" value="1" sub="⚠ Ticket TS-2040 at risk" />
        <AdminStatCard icon={CheckCircle2} iconBg="bg-success-light text-success-dark" border="border-success" label="Resolved This Week" value="17" sub="Avg resolution 6h 40m" />
        <AdminStatCard icon={MessageSquare} iconBg="bg-info-light text-info" border="border-info" label="Avg First Response" value="48 min" trend="-12%" trendUp sub="Improving response time" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {statusTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-white text-admin-text shadow border-b-2 border-accent' : 'text-admin-light hover:text-admin-text hover:bg-white/70'
            }`}
          >
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
              placeholder="Search ticket ref, subject, supplier..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Category', 'Priority', 'Assignee', 'Date Range'].map((f) => (
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
                <th className="px-6 py-3">Ticket</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                  <td className="px-6 py-3.5">
                    <button onClick={() => setSelected(t)} className="text-left group">
                      <p className="text-[12px] font-mono font-semibold text-secondary group-hover:underline">{t.ref}</p>
                      <p className="text-[13px] font-semibold text-admin-text group-hover:text-secondary transition-colors">{t.subject}</p>
                      <p className="text-[11px] text-admin-muted mt-0.5">{t.replies} reply{t.replies !== 1 ? 's' : ''} · {t.sla}</p>
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[13px] font-semibold text-admin-text">{t.supplier}</p>
                    <p className="text-[11px] text-admin-muted">{t.contact}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-table-header text-admin-medium">{t.category}</span>
                  </td>
                  <td className="px-4 py-3.5"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusMeta[t.status].bg}`}>{statusMeta[t.status].label}</span></td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{t.assignee}</td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium whitespace-nowrap">{t.updated}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(t)} aria-label="View" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View Ticket">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => setToast({ type: 'info', message: 'Ticket reassigned' })} className="inline-flex items-center gap-1.5 h-[28px] px-2.5 rounded-[7px] bg-primary text-white text-[11px] font-semibold hover:bg-primary-light transition-colors">
                        Assign
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
          <span className="text-[12px] text-admin-muted">Showing 1-7 of 42 tickets</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronLeft size={14} /></button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-8 h-8 rounded-[8px] text-[12px] font-semibold ${p === 1 ? 'bg-accent text-white' : 'border border-admin-border text-admin-medium'}`}>{p}</button>
            ))}
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Ticket detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Ticket Details" subtitle={selected?.ref} size="lg">
        {selected && (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <PriorityBadge priority={selected.priority} />
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusMeta[selected.status].bg}`}>{statusMeta[selected.status].label}</span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-table-header text-admin-medium">{selected.category}</span>
              <span className="ml-auto text-[12px] font-semibold text-warning-dark bg-warning-light px-2.5 py-1 rounded-full">⏳ {selected.sla}</span>
            </div>

            <div className="rounded-[10px] bg-table-header border border-admin-border p-4 mb-5">
              <p className="text-[15px] font-bold text-admin-text">{selected.subject}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-admin-medium">
                <span>{selected.supplier} · {selected.contact}</span>
                <span className="inline-flex items-center gap-1"><Mail size={12} /> {selected.contact.toLowerCase().replace(' ', '.')}@{selected.supplier.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)}.lk</span>
                <span className="inline-flex items-center gap-1"><Phone size={12} /> +94 77 000 0000</span>
              </div>
            </div>

            <p className="text-[12px] font-semibold text-admin-text mb-2">Conversation</p>
            <div className="space-y-3 mb-5">
              <div className="rounded-[10px] border border-admin-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[9px] font-bold">{selected.supplier.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>
                  <p className="text-[12px] font-semibold text-admin-text">{selected.supplier}</p>
                  <span className="text-[11px] text-admin-muted ml-auto">{selected.created}</span>
                </div>
                <p className="text-[13px] text-admin-medium leading-relaxed">"We are experiencing {selected.subject.toLowerCase()} on the portal. Could you please assist? Attached is a screenshot of the error."</p>
              </div>
              <div className="rounded-[10px] border border-admin-border border-l-4 border-l-secondary bg-info-light/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-[9px] font-bold">KP</span>
                  <p className="text-[12px] font-semibold text-admin-text">K. Perera <span className="text-admin-muted font-normal">· Support Agent</span></p>
                  <span className="text-[11px] text-admin-muted ml-auto">{selected.updated}</span>
                </div>
                <p className="text-[13px] text-admin-medium leading-relaxed">"Thank you for reporting this. We have escalated the issue to our technical team and will update you shortly."</p>
              </div>
            </div>

            <div className="rounded-[10px] border border-admin-border p-4">
              <p className="text-[12px] font-semibold text-admin-text mb-2">Reply to ticket</p>
              <textarea rows={3} placeholder="Type your reply..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none" />
              <div className="mt-2.5 flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors"><Paperclip size={13} /> Attach</button>
                <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors"><RefreshCw size={13} /> Reassign</button>
                <Button size="sm" className="ml-auto" onClick={() => { setSelected(null); setToast({ type: 'success', message: 'Reply sent to supplier' }) }}><Send size={14} /> Send Reply</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
