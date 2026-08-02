import React, { useState } from 'react'
import {
  Search, MessageCircle, PhoneCall, Mail, FileText, LifeBuoy, Send, ChevronRight,
  BookOpen, HelpCircle, ShieldQuestion, ClipboardList, UploadCloud, UserCircle2, ArrowRight,
} from 'lucide-react'
import Accordion from '../../components/ui/Accordion'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
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

function ClockIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> }
function BadgeCheckIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg> }
function FileIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg> }
function CalendarIcon(p) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg> }

export default function Support() {
  const { user } = useAuth()
  const [toast, setToast] = useState(null)
  const [category, setCategory] = useState('All')
  const [sending, setSending] = useState(false)
  const [ticket, setTicket] = useState({ subject: '', category: 'Application Status', message: '' })

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
        message: ticket.message.trim(),
      })
      setToast({ type: 'success', message: `Ticket submitted. Reference #TK-${res.ticket.id}.` })
      setTicket({ subject: '', category: ticket.category, message: '' })
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

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
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
            <div>
              <label className="block text-[13px] font-semibold text-ink mb-1.5">Category</label>
              <select
                value={ticket.category}
                onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                className="w-full rounded-[8px] border border-line-soft bg-white px-3.5 py-2.5 text-sm focus:border-secondary focus:outline-none transition-colors"
              >
                {['Application Status', 'Document Upload', 'Account / Profile', 'Technical Issue', 'Billing / Renewal', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
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
    </div>
  )
}
