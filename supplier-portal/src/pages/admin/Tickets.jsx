import React, { useState, useEffect, useMemo } from 'react'
import {
  LifeBuoy, Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Paperclip, Send,
  Clock3, CheckCircle2, RefreshCw, AlertTriangle, Phone, Mail, Plus, X, MessageSquare,
  Download, Star, Filter, RotateCcw,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { PriorityBadge } from '../../components/admin/Badges'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'
import { adminApi } from '../../api/adminClient'

const TAB_LABELS = {
  all: 'All Tickets',
  open: 'Open',
  pending: 'Pending',
  replied: 'Replied',
  resolved: 'Resolved',
  closed: 'Closed',
}

const statusMeta = {
  open: { label: '● OPEN', bg: 'bg-info-light text-info' },
  pending: { label: '⏳ PENDING', bg: 'bg-warning-light text-warning-dark' },
  replied: { label: '↩ REPLIED', bg: 'bg-secondary/10 text-secondary' },
  resolved: { label: '✓ RESOLVED', bg: 'bg-success-light text-success-dark' },
  closed: { label: '✕ CLOSED', bg: 'bg-table-header text-admin-muted' },
}

function fmtTime(str) {
  if (!str) return ''
  const d = new Date(String(str).replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return str
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
  return `${date} · ${time}`
}

export default function Tickets() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [tabs, setTabs] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [reply, setReply] = useState('')
  const [replying, setReplying] = useState(false)
  const [toast, setToast] = useState(null)

  const load = () =>
    adminApi.tickets()
      .then((d) => {
        setTabs(d.tabs || [])
        setData(d.data || [])
      })
      .catch(() => setToast({ type: 'error', message: 'Failed to load tickets' }))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openTicket = async (t) => {
    setSelected(t)
    setDetail(null)
    setReply('')
    setDetailLoading(true)
    try {
      const d = await adminApi.ticket(t.id)
      setDetail(d)
    } catch {
      setToast({ type: 'error', message: 'Could not load ticket details' })
    } finally {
      setDetailLoading(false)
    }
  }

  const sendReply = async () => {
    if (!reply.trim() || !selected) return
    setReplying(true)
    try {
      await adminApi.replyTicket(selected.id, { body: reply.trim() })
      setReply('')
      setToast({ type: 'success', message: 'Reply sent to supplier' })
      load()
      openTicket(selected)
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    } finally {
      setReplying(false)
    }
  }

  const changeStatus = async (status) => {
    if (!selected) return
    try {
      await adminApi.updateTicketStatus(selected.id, status)
      setToast({ type: 'success', message: `Ticket marked ${status}` })
      load()
      if (selected) {
        const d = await adminApi.ticket(selected.id)
        setDetail(d)
      }
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter((t) => {
      if (tab !== 'all' && t.status !== tab) return false
      if (!q) return true
      return (
        t.ref.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.supplier || '').toLowerCase().includes(q)
      )
    })
  }, [data, tab, search])

  const openCount = data.filter((t) => t.status === 'open' || t.status === 'replied' || t.status === 'pending').length
  const overdueCount = data.filter((t) => t.sla === 'Overdue').length
  const resolvedCount = data.filter((t) => t.status === 'resolved' || t.status === 'closed').length

  const detailTicket = detail?.ticket
  const activeMeta = detailTicket && (statusMeta[detailTicket.status] || statusMeta.open)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Support Tickets"
        subtitle="Supplier inquiries and support requests"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'System' }, { label: 'Support Tickets' }]}
        actions={
          <>
            <button onClick={() => setToast({ type: 'info', message: 'Export not yet wired' })} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export
            </button>
            <button onClick={() => setToast({ type: 'info', message: 'Suppliers create tickets from their portal' })} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <Plus size={15} /> New Ticket
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={LifeBuoy} iconBg="bg-primary/10 text-primary" border="border-primary" label="Active Tickets" value={String(openCount)} sub="open / pending / replied" />
        <AdminStatCard icon={Clock3} iconBg="bg-warning-light text-warning-dark" border="border-warning" label="SLA Breaches" value={String(overdueCount)} sub={overdueCount ? '⚠ Needs attention' : 'All on track'} />
        <AdminStatCard icon={CheckCircle2} iconBg="bg-success-light text-success-dark" border="border-success" label="Resolved / Closed" value={String(resolvedCount)} sub="All time" />
        <AdminStatCard icon={MessageSquare} iconBg="bg-info-light text-info" border="border-info" label="Total Tickets" value={String(data.length)} sub="Live from portal" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {(tabs.length ? tabs : []).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-white text-admin-text shadow border-b-2 border-accent' : 'text-admin-light hover:text-admin-text hover:bg-white/70'
            }`}
          >
            {TAB_LABELS[t.key] || t.key}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket ref, subject, supplier..."
              className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border bg-white pl-10 pr-4 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none transition-colors"
            />
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
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[13px] text-admin-muted">Loading tickets...</td>
                </tr>
              )}
              {!loading && filtered.map((t) => (
                <tr key={t.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                  <td className="px-6 py-3.5">
                    <button onClick={() => openTicket(t)} className="text-left group">
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
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${(statusMeta[t.status] || statusMeta.open).bg}`}>
                      {(statusMeta[t.status] || statusMeta.open).label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{t.assignee}</td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium whitespace-nowrap">{fmtTime(t.updated)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openTicket(t)} aria-label="View" className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View Ticket">
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => changeStatus(t.status === 'resolved' || t.status === 'closed' ? 'open' : 'resolved')}
                        className="inline-flex items-center gap-1.5 h-[28px] px-2.5 rounded-[7px] bg-primary text-white text-[11px] font-semibold hover:bg-primary-light transition-colors"
                      >
                        {t.status === 'resolved' || t.status === 'closed' ? 'Reopen' : 'Resolve'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[13px] text-admin-muted">No tickets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-admin-border flex items-center justify-between">
          <span className="text-[12px] text-admin-muted">Showing {filtered.length} of {data.length} tickets</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 rounded-[8px] bg-accent text-white text-[12px] font-semibold">1</button>
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Ticket detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Ticket Details" subtitle={selected?.ref} size="lg">
        {detailTicket ? (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <PriorityBadge priority={detailTicket.priority} />
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${activeMeta.bg}`}>{activeMeta.label}</span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-table-header text-admin-medium">{detailTicket.category}</span>
              <span className={`ml-auto text-[12px] font-semibold px-2.5 py-1 rounded-full ${detailTicket.sla === 'Overdue' ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning-dark'}`}>
                ⏳ {detailTicket.sla}
              </span>
              {detailTicket.status !== 'resolved' && detailTicket.status !== 'closed' && (
                <>
                  <button onClick={() => changeStatus('resolved')} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-success-light text-success-dark text-[12px] font-semibold hover:bg-success hover:text-white transition-colors">
                    <CheckCircle2 size={13} /> Resolve
                  </button>
                  <button onClick={() => changeStatus('closed')} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-table-header text-admin-muted text-[12px] font-semibold hover:bg-[#DADCE0] hover:text-admin-text transition-colors">
                    <X size={13} /> Close
                  </button>
                </>
              )}
              {(detailTicket.status === 'resolved' || detailTicket.status === 'closed') && (
                <button onClick={() => changeStatus('open')} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-info-light text-info text-[12px] font-semibold hover:bg-info hover:text-white transition-colors">
                  <RotateCcw size={13} /> Reopen
                </button>
              )}
            </div>

            <div className="rounded-[10px] bg-table-header border border-admin-border p-4 mb-5">
              <p className="text-[15px] font-bold text-admin-text">{detailTicket.subject}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-admin-medium">
                <span>{detailTicket.supplier.name} · {detailTicket.supplier.contactName}</span>
                <span className="inline-flex items-center gap-1"><Mail size={12} /> {detailTicket.supplier.email}</span>
                <span className="inline-flex items-center gap-1"><Phone size={12} /> {detailTicket.supplier.phone}</span>
              </div>
            </div>

            <p className="text-[12px] font-semibold text-admin-text mb-2">Conversation</p>
            <div className="space-y-3 mb-5 max-h-[360px] overflow-y-auto pr-1">
              {detailLoading && <p className="text-center text-[13px] text-admin-muted py-6">Loading conversation...</p>}
              {!detailLoading && (detail.messages || []).map((m) => {
                const sName = m.author || detailTicket.supplier.contactName || detailTicket.supplier.name || 'Supplier'
                const sInitials = sName
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'S'
                return (
                  <div key={m.id} className={`flex gap-2.5 ${m.admin ? 'justify-start' : 'justify-end flex-row-reverse'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-1 ${
                      m.admin ? 'bg-secondary text-white' : 'bg-gradient-to-br from-primary to-primary-light text-white'
                    }`}>
                      {m.admin ? 'ST' : sInitials}
                    </span>
                    <div className={`max-w-[78%] rounded-[12px] border p-3.5 ${
                      m.admin
                        ? 'bg-info-light/30 border-secondary/40 border-l-4 border-l-secondary'
                        : 'bg-primary/5 border-primary/30 border-l-4 border-l-primary'
                    }`}>
                      <div className={`flex flex-wrap items-center gap-2 mb-1.5 ${m.admin ? '' : 'justify-end'}`}>
                        <span className={`text-[11px] font-bold ${m.admin ? 'text-secondary' : 'text-primary'}`}>
                          {m.admin ? 'Support Team' : sName}
                        </span>
                        {m.admin ? (
                          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-secondary text-white">Admin</span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary text-white">Supplier</span>
                        )}
                        <span className={`text-[10px] text-admin-muted ${m.admin ? '' : 'ml-auto'}`}>{fmtTime(m.time)}</span>
                      </div>
                      <p className="text-[13px] text-admin-medium leading-relaxed">{m.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-[10px] border border-admin-border p-4">
              <p className="text-[12px] font-semibold text-admin-text mb-2">Reply to ticket</p>
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none"
              />
              <div className="mt-2.5 flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors"><Paperclip size={13} /> Attach</button>
                <button onClick={() => setToast({ type: 'info', message: 'Reassignment not wired' })} className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors"><RefreshCw size={13} /> Reassign</button>
                <Button size="sm" className="ml-auto" onClick={sendReply} disabled={replying || !reply.trim()}>
                  <Send size={14} /> {replying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-[13px] text-admin-muted">Loading ticket details...</div>
        )}
      </Modal>
    </div>
  )
}
