import React, { useState, useEffect } from 'react'
import {
  Search, MessageCircle, PhoneCall, Mail, FileText, LifeBuoy, Send, ChevronRight,
  BookOpen, HelpCircle, ShieldQuestion, ClipboardList, UploadCloud, UserCircle2, ArrowRight,
  MessagesSquare, CheckCircle2, RotateCcw, Clock3,
} from 'lucide-react'
import Accordion from '../../components/ui/Accordion'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

const faqs = [
  {
    q: 'How long does the registration process take?',
    a: 'Typical processing time is 15–20 working days after submission, depending on the completeness of your documents. Responding to document requests quickly can shorten this.',
    icon: ClockIcon,
  },
  {
    q: 'What happens after my application is approved?',
    a: 'You will receive an approval letter and be on-boarded into the supplier directory. Your performance dashboard and renewal cycle will then begin.',
    icon: BadgeCheckIcon,
  },
  {
    q: 'Why was my document rejected?',
    a: 'Documents are typically rejected when they are not legible, expired, or do not match the requirement. You will be notified with the reason and can re-upload a corrected copy.',
    icon: FileIcon,
  },
  {
    q: 'Can I update my company information after submitting?',
    a: 'Yes. You can edit most profile fields from the Profile page. Some fields, like legal name and registration number, require supporting documents to verify the change.',
    icon: UserCircle2,
  },
  {
    q: 'When do I need to complete annual renewal?',
    a: 'Renewal opens 90 days before your registration anniversary. Keep your documents up to date to renew smoothly — see the Annual Renewal page for details.',
    icon: CalendarIcon,
  },
  {
    q: 'How do I change my primary contact person?',
    a: 'Update the contact person from the Profile → Company tab. If you no longer have access to the registered email, contact support to verify ownership.',
    icon: ShieldQuestion,
  },
]

const categories = ['All', 'General', 'Application', 'Documents', 'Technical']

const articles = [
  { icon: ClipboardList, title: 'How to submit your application', views: '2.4k views' },
  { icon: UploadCloud, title: 'Document upload best practices', views: '1.8k views' },
  { icon: UserCircle2, title: 'Updating your company profile', views: '1.1k views' },
  { icon: BadgeCheckIcon, title: 'Understanding the approval process', views: '980 views' },
  { icon: CalendarIcon, title: 'Annual renewal guide', views: '760 views' },
]

const ticketStatusMeta = {
  open: { label: 'Open', cls: 'bg-info-light text-info' },
  pending: { label: 'Pending', cls: 'bg-warning-light text-warning-dark' },
  replied: { label: 'Replied', cls: 'bg-secondary/10 text-secondary' },
  resolved: { label: 'Resolved', cls: 'bg-success-light text-success-dark' },
  closed: { label: 'Closed', cls: 'bg-table-header text-ink-faint' },
}

const priorityMeta = {
  low: 'bg-surface text-ink-muted',
  medium: 'bg-warning-light text-warning-dark',
  high: 'bg-danger-light text-danger',
  critical: 'bg-danger text-white',
}

function ClockIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> }
function BadgeCheckIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg> }
function FileIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg> }
function CalendarIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg> }

function fmtTime(str) {
  if (!str) return ''
  const d = new Date(String(str).replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return str
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
  return `${date}, ${time}`
}

function timeAgo(str) {
  if (!str) return ''
  const d = new Date(String(str).replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return ''
  const secs = Math.round((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function Support() {
  const { user, company } = useAuth()
  const [toast, setToast] = useState(null)
  const [category, setCategory] = useState('All')
  const [sending, setSending] = useState(false)

  // ticket form
  const [ticket, setTicket] = useState({ subject: '', category: 'Application Status', priority: 'medium', message: '' })

  // my tickets
  const [tickets, setTickets] = useState([])
  const [ticketsLoading, setTicketsLoading] = useState(true)

  // ticket detail modal
  const [active, setActive] = useState(null)
  const [thread, setThread] = useState([])
  const [threadLoading, setThreadLoading] = useState(false)
  const [reply, setReply] = useState('')
  const [replying, setReplying] = useState(false)

  const loadTickets = () =>
    api.tickets()
      .then((d) => setTickets(d.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setTicketsLoading(false))

  useEffect(() => { loadTickets() }, [])

  const openTicket = async (t) => {
    setActive(t)
    setThreadLoading(true)
    setReply('')
    try {
      const d = await api.ticket(t.id)
      setThread(d.messages || [])
      setActive({ ...t, ...d.ticket })
    } catch {
      setToast({ type: 'error', message: 'Could not load this ticket' })
    } finally {
      setThreadLoading(false)
    }
  }

  const sendReply = async () => {
    if (!reply.trim()) {
      setToast({ type: 'error', message: 'Please type a reply' })
      return
    }
    setReplying(true)
    try {
      const d = await api.replyTicket(active.id, { body: reply.trim() })
      setThread(d.messages || [])
      setReply('')
      loadTickets()
      setToast({ type: 'success', message: 'Reply sent' })
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    } finally {
      setReplying(false)
    }
  }

  const changeStatus = async (status) => {
    if (!active) return
    try {
      await api.updateTicketStatus(active.id, status)
      setActive({ ...active, status })
      loadTickets()
      setToast({ type: 'success', message: `Ticket marked ${status}` })
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    }
  }

  const submitTicket = async () => {
    if (!ticket.subject.trim() || !ticket.message.trim()) {
      setToast({ type: 'error', message: 'Please fill in subject and message' })
      return
    }
    setSending(true)
    try {
      const res = await api.createTicket({
        subject: ticket.subject.trim(),
        category: ticket.category,
        priority: ticket.priority,
        message: ticket.message.trim(),
      })
      setToast({ type: 'success', message: `Ticket submitted. Reference #TS-${String(res.ticket.id).padStart(4, '0')}.` })
      setTicket({ subject: '', category: ticket.category, priority: ticket.priority, message: '' })
      loadTickets()
    } catch (e) {
      setToast({ type: 'error', message: e.message })
    } finally {
      setSending(false)
    }
  }

  const visibleFaqs = category === 'All' ? faqs : faqs.filter((f) => f.tags?.includes(category))

  const channels = [
    { icon: MessageCircle, title: 'Live Chat', desc: 'Mon–Fri, 8:00 AM – 5:00 PM', color: 'bg-secondary/10 text-secondary', action: 'Start Chat' },
    { icon: PhoneCall, title: 'Call Support', desc: 'Hotline: 0112 345 678', color: 'bg-success-light text-success-dark', action: 'Call Now' },
    { icon: Mail, title: 'Email Support', desc: 'support@portal.lk · Reply in 24h', color: 'bg-accent/10 text-accent-hover', action: 'Send Email' },
    { icon: FileText, title: 'Submit a Ticket', desc: 'Track your request online', color: 'bg-primary/10 text-primary', action: 'Open Ticket' },
  ]

  const activeMeta = active && (ticketStatusMeta[active.status] || ticketStatusMeta.open)

  const supplierName = company?.legalName || user?.fullName || 'You'
  const supplierInitials = supplierName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SP'

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-7 sm:p-9 text-center">
        <LifeBuoy size={34} className="mx-auto text-accent" />
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold font-heading text-white">How can we help you?</h1>
        <p className="mt-2 text-sm text-white/70">Search our help centre or browse topics below</p>
        <div className="mt-6 max-w-[520px] mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            placeholder="Search for answers, e.g. “document rejected”"
            className="w-full rounded-[12px] bg-white py-3.5 pl-11 pr-4 text-sm shadow-lg placeholder:text-ink-faint focus:outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['Document rejected', 'Deadlines', 'Renewal', 'Profile update'].map((s) => (
            <button key={s} onClick={() => setToast({ type: 'info', message: `Searching: ${s}` })} className="px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {channels.map((c) => (
          <button
            key={c.title}
            onClick={() => setToast({ type: 'info', message: `Opening: ${c.action}` })}
            className="bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-5 text-left hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all group"
          >
            <span className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${c.color}`}>
              <c.icon size={22} />
            </span>
            <p className="mt-3 font-semibold text-[15px] text-ink">{c.title}</p>
            <p className="text-xs text-ink-muted mt-1">{c.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-secondary group-hover:text-primary transition-colors">
              {c.action} <ChevronRight size={14} />
            </span>
          </button>
        ))}
      </div>

      {/* My Tickets */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <p className="flex items-center gap-2 font-heading font-semibold text-[17px] text-ink">
            <MessagesSquare size={20} className="text-accent" /> My Tickets
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent-hover">
              {tickets.filter((t) => t.status === 'open' || t.status === 'replied').length} active
            </span>
          </p>
          {tickets.length > 0 && (
            <span className="text-xs text-ink-muted">{tickets.length} total</span>
          )}
        </div>

        {ticketsLoading ? (
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-10 text-center text-sm text-ink-muted">
            Loading your tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-10 text-center">
            <LifeBuoy size={32} className="mx-auto text-ink-faint" />
            <p className="mt-3 text-sm font-semibold text-ink">No tickets yet</p>
            <p className="text-xs text-ink-muted mt-1">Use the ticket form to contact our support team.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] divide-y divide-line-soft/70 overflow-hidden">
            {tickets.map((t) => {
              const sm = ticketStatusMeta[t.status] || ticketStatusMeta.open
              return (
                <button
                  key={t.id}
                  onClick={() => openTicket(t)}
                  className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-surface/60 transition-colors group"
                >
                  <span className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 ${sm.cls}`}>
                    <LifeBuoy size={20} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-ink truncate">{t.subject}</span>
                      <span className="text-[11px] font-mono font-semibold text-ink-faint">{t.ref}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityMeta[t.priority] || priorityMeta.medium}`}>
                        {t.priority}
                      </span>
                      <span>{t.category || 'General'}</span>
                      <span>·</span>
                      <span className="line-clamp-1">{t.lastMessage?.body}</span>
                    </span>
                    <span className="mt-1 block text-[10px] text-ink-faint">
                      {t.messageCount} message{t.messageCount !== 1 ? 's' : ''} · {timeAgo(t.lastMessage?.createdAt || t.createdAt)}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${sm.cls}`}>{sm.label}</span>
                    <ChevronRight size={16} className="text-ink-faint group-hover:text-secondary transition-colors" />
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* FAQ */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <p className="flex items-center gap-2 font-heading font-semibold text-[17px] text-ink">
              <HelpCircle size={20} className="text-accent" /> Frequently Asked Questions
            </p>
            <div className="flex gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                    category === c ? 'bg-primary text-white' : 'bg-white text-ink-muted border border-line-soft hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {visibleFaqs.map((f) => (
              <Accordion key={f.q} title={f.q} icon={f.icon}>
                <p className="text-[13px] text-ink-muted leading-relaxed mt-3">{f.a}</p>
                <button
                  onClick={() => setToast({ type: 'info', message: 'Opening related article' })}
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors"
                >
                  Read related guide <ArrowRight size={13} />
                </button>
              </Accordion>
            ))}
          </div>

          {/* Articles */}
          <p className="flex items-center gap-2 font-heading font-semibold text-[17px] text-ink mt-8 mb-4">
            <BookOpen size={20} className="text-secondary" /> Popular Guides
          </p>
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] divide-y divide-line-soft/70 overflow-hidden">
            {articles.map((a) => (
              <button
                key={a.title}
                onClick={() => setToast({ type: 'info', message: `Opening guide: ${a.title}` })}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface/60 transition-colors group"
              >
                <span className="w-10 h-10 rounded-[10px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <a.icon size={19} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] font-semibold text-ink truncate">{a.title}</span>
                  <span className="text-[11px] text-ink-muted">{a.views}</span>
                </span>
                <ChevronRight size={16} className="text-ink-faint group-hover:text-secondary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Ticket form */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sticky top-24">
          <p className="flex items-center gap-2 font-heading font-semibold text-[16px] text-ink">
            <FileText size={18} className="text-accent" /> Submit a Ticket
          </p>
          <p className="text-xs text-ink-muted mt-1 mb-5">We typically respond within 24 hours.</p>
          <div className="space-y-4">
            <Field
              label="Full Name"
              value={user?.fullName || ''}
              disabled
              readOnly
            />
            <Field
              label="Email Address"
              type="email"
              value={user?.email || ''}
              disabled
              readOnly
            />
            <Field
              label="Subject"
              placeholder="Short summary of your issue"
              value={ticket.subject}
              onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
            />
            <Field label="Category" as="select" value={ticket.category} onChange={(e) => setTicket({ ...ticket, category: e.target.value })}>
              {['Application Status', 'Document Upload', 'Account / Profile', 'Technical Issue', 'Billing / Renewal', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </Field>
            <Field label="Priority" as="select" value={ticket.priority} onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}>
              {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
            </Field>
            <Field
              label="Message"
              as="textarea"
              textareaRows={4}
              placeholder="Describe your issue in detail..."
              value={ticket.message}
              onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
            />
            <Button className="w-full" onClick={submitTicket} disabled={sending}>
              <Send size={15} /> {sending ? 'Submitting...' : 'Submit Ticket'}
            </Button>
            <p className="text-[11px] text-ink-faint text-center">Your ticket is logged against your registered application.</p>
          </div>
        </div>
      </div>

      {/* Ticket detail modal */}
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.subject} subtitle={`${active?.ref} · ${active?.category || 'General'}`} size="lg">
        {active && (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${activeMeta.cls}`}>{activeMeta.label}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${priorityMeta[active.priority] || priorityMeta.medium}`}>
                {active.priority} priority
              </span>
              {active.status !== 'resolved' && active.status !== 'closed' && (
                <button onClick={() => changeStatus('resolved')} className="ml-auto inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-success-light text-success-dark text-[12px] font-semibold hover:bg-success hover:text-white transition-colors">
                  <CheckCircle2 size={13} /> Mark Resolved
                </button>
              )}
              {(active.status === 'resolved' || active.status === 'closed') && (
                <button onClick={() => changeStatus('open')} className="ml-auto inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-info-light text-info text-[12px] font-semibold hover:bg-info hover:text-white transition-colors">
                  <RotateCcw size={13} /> Reopen
                </button>
              )}
            </div>

            {threadLoading ? (
              <div className="py-10 text-center text-sm text-ink-muted">Loading conversation...</div>
            ) : (
              <div className="space-y-3 mb-5 max-h-[380px] overflow-y-auto pr-1">
                {thread.length === 0 && (
                  <p className="text-center text-sm text-ink-muted py-8">No messages yet.</p>
                )}
                {thread.map((m) => (
                  <div key={m.id} className={`flex gap-2.5 ${m.isAdmin ? 'justify-start' : 'justify-end flex-row-reverse'}`}>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 ${
                      m.isAdmin ? 'bg-secondary text-white' : 'bg-accent text-white'
                    }`}>
                      {m.isAdmin ? 'ST' : supplierInitials}
                    </span>
                    <div className={`max-w-[78%] rounded-[14px] border p-3.5 ${
                      m.isAdmin
                        ? 'bg-secondary/10 border-secondary/30 border-l-4 border-l-secondary'
                        : 'bg-primary text-white border-primary'
                    }`}>
                      <div className={`flex flex-wrap items-center gap-2 mb-1.5 ${m.isAdmin ? '' : 'justify-end'}`}>
                        <span className={`text-[11px] font-bold ${m.isAdmin ? 'text-secondary' : 'text-white/85'}`}>
                          {m.isAdmin ? 'Support Team' : supplierName}
                        </span>
                        {m.isAdmin ? (
                          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-secondary text-white">Admin</span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/20 text-white">You</span>
                        )}
                        <span className={`text-[10px] ${m.isAdmin ? 'text-ink-faint' : 'text-white/60'} ${m.isAdmin ? '' : 'ml-auto'}`}>
                          {fmtTime(m.createdAt)}
                        </span>
                      </div>
                      <p className={`text-[13px] leading-relaxed ${m.isAdmin ? 'text-ink' : 'text-white/95'}`}>{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-[12px] border border-line-soft p-4">
              <p className="text-[12px] font-semibold text-ink mb-2 flex items-center gap-2">
                <Clock3 size={13} className="text-secondary" /> Add a reply
              </p>
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply... (we typically respond within 24 hours)"
                className="w-full rounded-[8px] border-[1.5px] border-line-soft p-3 text-[13px] placeholder:text-ink-faint focus:border-secondary focus:outline-none resize-none"
              />
              <div className="mt-2.5 flex justify-end">
                <Button size="sm" onClick={sendReply} disabled={replying || !reply.trim()}>
                  <Send size={14} /> {replying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
