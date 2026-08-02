import React, { useState } from 'react'
import {
  Mail, Send, Inbox, Clock3, CheckCheck, Star, Archive, Trash2, FileText, Download,
  ChevronDown, Search, Users, Megaphone, CalendarDays, Paperclip, Reply, Eye, X, Plus,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const mailItems = [
  { id: 1, from: 'ABC Trading', email: 'john@abctrading.lk', subject: 'Re: Document Request - Tax Clearance', preview: 'Dear Team, Please find attached the updated tax clearance certificate...', time: '10:42 AM', tag: 'documents', unread: true, starred: false },
  { id: 2, from: 'XYZ Supplies', email: 'nimali@xyzsupplies.lk', subject: 'Registration Renewal - Assistance Needed', preview: 'We are having trouble uploading our bank statement...', time: '9:15 AM', tag: 'renewal', unread: true, starred: true },
  { id: 3, from: 'Support System', email: 'no-reply@company.lk', subject: 'New support ticket created #TS-2045', preview: 'A new support ticket has been created by DEF Services...', time: 'Yesterday', tag: 'support', unread: false, starred: false },
  { id: 4, from: 'GHI Constructs', email: 'mala@ghiconstructs.lk', subject: 'Re: Evaluation Clarification', preview: 'Thank you for the clarification. We confirm our capacity...', time: 'Yesterday', tag: 'evaluation', unread: false, starred: false },
  { id: 5, from: 'Renewal System', email: 'no-reply@company.lk', subject: '18 suppliers expiring within 30 days', preview: 'This is a system-generated digest of suppliers whose...', time: 'Mon', tag: 'system', unread: false, starred: false },
  { id: 6, from: 'JKL Trading', email: 'saman@jkltrading.lk', subject: 'Updated Contact Information', preview: 'Please update our primary contact to Ruwan Dissanayake...', time: 'Fri', tag: 'profile', unread: false, starred: false },
]

const templates = [
  { id: 1, name: 'Document Request', desc: 'Request missing or expired documents', used: 84, icon: FileText },
  { id: 2, name: 'Renewal Reminder', desc: 'Notify suppliers of upcoming expiry', used: 132, icon: CalendarDays },
  { id: 3, name: 'Approval Notification', desc: 'Inform supplier of successful approval', used: 96, icon: CheckCheck },
  { id: 4, name: 'Rejection Notification', desc: 'Notify supplier of application rejection', used: 41, icon: X },
  { id: 5, name: 'Blacklist Notification', desc: 'Formal blacklisting notice', used: 8, icon: Archive },
  { id: 6, name: 'Performance Scorecard', desc: 'Quarterly scorecard delivery', used: 318, icon: Star },
]

const campaigns = [
  { id: 1, name: 'Renewal Reminder Campaign - Jan 2025', type: 'Bulk Email', recipients: 18, sent: '13 Jan 2025', opened: '94%', status: 'completed' },
  { id: 2, name: 'Approved Vendor List Update Notice', type: 'Bulk Email', recipients: 412, sent: '05 Jan 2025', opened: '87%', status: 'completed' },
  { id: 3, name: 'Document Compliance Drive', type: 'Bulk Email', recipients: 64, sent: 'Pending', opened: '—', status: 'draft' },
]

export default function Communications() {
  const [selected, setSelected] = useState(1)
  const [composeOpen, setComposeOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [mailbox, setMailbox] = useState('inbox')

  const sel = mailItems.find((m) => m.id === selected)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Communication Center"
        subtitle="Email, campaigns and supplier outreach"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'System' }, { label: 'Communications' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Megaphone size={15} /> Campaigns
            </button>
            <Button onClick={() => setComposeOpen(true)}><Mail size={15} /> Compose Email</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={Inbox} iconBg="bg-primary/10 text-primary" border="border-primary" label="Unread Messages" value="12" sub="In inbox" />
        <AdminStatCard icon={Send} iconBg="bg-info-light text-info" border="border-info" label="Sent This Month" value="148" trend="+18%" trendUp sub="Across all channels" />
        <AdminStatCard icon={Megaphone} iconBg="bg-accent/15 text-accent-hover" border="border-accent" label="Active Campaigns" value="3" sub="1 draft · 2 completed" />
        <AdminStatCard icon={CheckCheck} iconBg="bg-success-light text-success-dark" border="border-success" label="Avg Open Rate" value="91%" trend="+4%" trendUp sub="Email campaigns" />
      </div>

      {/* Email app layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5 items-start">
        {/* Left column: folders + templates */}
        <div className="space-y-5">
          {/* Folders */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted mb-2">Mailbox</p>
            <div className="space-y-0.5">
              {[
                { id: 'inbox', label: 'Inbox', icon: Inbox, count: 12 },
                { id: 'sent', label: 'Sent', icon: Send, count: null },
                { id: 'drafts', label: 'Drafts', icon: FileText, count: 2 },
                { id: 'templates', label: 'Templates', icon: Star, count: 6 },
                { id: 'archive', label: 'Archive', icon: Archive, count: null },
                { id: 'trash', label: 'Trash', icon: Trash2, count: null },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMailbox(f.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                    mailbox === f.id ? 'bg-primary text-white' : 'text-admin-medium hover:bg-table-header'
                  }`}
                >
                  <f.icon size={16} className={mailbox === f.id ? 'text-white' : 'text-admin-muted'} />
                  <span className="flex-1 text-left">{f.label}</span>
                  {f.count && <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${mailbox === f.id ? 'bg-white/20 text-white' : 'bg-table-header text-admin-muted'}`}>{f.count}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">Email Templates</p>
              <button onClick={() => setToast({ type: 'info', message: 'New template' })} className="text-[11px] font-bold text-secondary hover:text-primary"><Plus size={12} className="inline" /> New</button>
            </div>
            <div className="space-y-2">
              {templates.slice(0, 4).map((t) => (
                <button key={t.id} onClick={() => setToast({ type: 'success', message: `Template: ${t.name} loaded` })} className="w-full flex items-center gap-3 rounded-[8px] border border-admin-border px-3 py-2.5 text-left hover:border-secondary hover:bg-info-light/30 transition-colors group">
                  <span className="w-8 h-8 rounded-[8px] bg-table-header text-admin-medium group-hover:bg-secondary group-hover:text-white flex items-center justify-center transition-colors"><t.icon size={14} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-admin-text truncate">{t.name}</p>
                    <p className="text-[10px] text-admin-muted truncate">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setToast({ type: 'info', message: 'Opening template library' })} className="mt-3 w-full text-center text-[12px] font-semibold text-secondary hover:text-primary">View All Templates</button>
          </div>
        </div>

        {/* Right: mail list + preview */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
          {/* Mail list */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-4 py-3 border-b border-admin-border">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                <input placeholder="Search mail..." className="w-full h-[36px] rounded-[8px] border border-admin-border pl-9 pr-3 text-[12px] focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div className="divide-y divide-[#F0F0F0] max-h-[620px] overflow-y-auto">
              {mailItems.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full px-4 py-3 text-left transition-colors ${selected === m.id ? 'bg-info-light/40 border-l-[3px] border-secondary' : 'hover:bg-table-header border-l-[3px] border-transparent'} ${m.unread ? 'bg-white' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                      {m.from.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </span>
                    <span className={`flex-1 text-[13px] truncate ${m.unread ? 'font-bold text-admin-text' : 'font-medium text-admin-medium'}`}>{m.from}</span>
                    <span className="text-[11px] text-admin-muted whitespace-nowrap">{m.time}</span>
                  </div>
                  <p className={`mt-1.5 text-[12px] truncate pl-10 ${m.unread ? 'font-semibold text-admin-text' : 'text-admin-medium'}`}>{m.subject}</p>
                  <div className="flex items-center gap-2 mt-1 pl-10">
                    <span className="text-[11px] text-admin-muted truncate">{m.preview}</span>
                    {m.starred && <Star size={11} className="text-accent fill-accent shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mail preview */}
          {sel && (
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-admin-border flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-info-light text-info">{sel.tag.toUpperCase()}</span>
                {sel.unread && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-danger-light text-danger">UNREAD</span>}
                <div className="ml-auto flex items-center gap-1">
                  <button onClick={() => setToast({ type: 'info', message: 'Starred' })} aria-label="Star" className={`w-8 h-8 rounded-[8px] flex items-center justify-center hover:bg-table-hover ${sel.starred ? 'text-accent' : 'text-admin-muted'}`}><Star size={15} /></button>
                  <button onClick={() => setToast({ type: 'info', message: 'Archived' })} aria-label="Archive" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-muted hover:bg-table-hover"><Archive size={15} /></button>
                  <button onClick={() => setToast({ type: 'info', message: 'Moved to trash' })} aria-label="Delete" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-muted hover:bg-danger-light hover:text-danger"><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-[17px] font-bold font-heading text-admin-text">{sel.subject}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[13px] font-bold">
                    {sel.from.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-admin-text">{sel.from} <span className="text-admin-muted font-normal">&lt;{sel.email}&gt;</span></p>
                    <p className="text-[11px] text-admin-muted">to Procurement Division · {sel.time}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-[10px] bg-table-header border border-admin-border p-5">
                  <p className="text-[13px] text-admin-medium leading-relaxed">
                    Dear Procurement Team,<br /><br />
                    {sel.preview}<br /><br />
                    Please let us know if you require any further information.<br /><br />
                    Best regards,<br />
                    <span className="font-semibold text-admin-text">{sel.from}</span>
                  </p>
                </div>
                <div className="mt-5 pt-5 border-t border-admin-border flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => setToast({ type: 'success', message: 'Reply composer opened' })}><Reply size={14} /> Reply</Button>
                  <Button size="sm" variant="ghost" onClick={() => setToast({ type: 'info', message: 'Forward composer opened' })}>Forward</Button>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-admin-muted"><Paperclip size={13} /> 1 attachment</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns */}
      <div className="mt-5 bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <div>
            <p className="text-[16px] font-semibold font-heading text-admin-text">Bulk Campaigns</p>
            <p className="text-[12px] text-admin-muted">Scheduled bulk communications</p>
          </div>
          <button onClick={() => setToast({ type: 'info', message: 'New campaign wizard' })} className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
            + New Campaign
          </button>
        </div>
        <div className="divide-y divide-[#F0F0F0]">
          {campaigns.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-table-header transition-colors">
              <span className="w-10 h-10 rounded-[10px] bg-accent/15 text-accent-hover flex items-center justify-center shrink-0"><Megaphone size={18} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-admin-text">{c.name}</p>
                <p className="text-[11px] text-admin-muted">{c.type} · {c.recipients} recipients · Sent {c.sent}</p>
              </div>
              <span className="text-[12px] text-admin-medium">{c.opened === '—' ? '—' : `Opened: ${c.opened}`}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.status === 'completed' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                {c.status === 'completed' ? '✓ Completed' : 'Draft'}
              </span>
              <button onClick={() => setToast({ type: 'info', message: `Opening campaign: ${c.name}` })} className="inline-flex items-center gap-1 text-[12px] font-bold text-secondary hover:text-primary">View <span>→</span></button>
            </div>
          ))}
        </div>
      </div>

      {/* Compose modal */}
      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Compose Email" subtitle="Send a message to suppliers" size="lg">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">To</p>
            <div className="flex items-center gap-2 flex-wrap rounded-[8px] border-[1.5px] border-admin-border px-3 py-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-info-light text-info px-2.5 py-1 rounded-full">All suppliers <X size={11} /></span>
              <button className="text-[12px] font-semibold text-secondary hover:underline">Select recipients</button>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Template</p>
            <button className="w-full h-[40px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">
              Select template <ChevronDown size={13} className="text-admin-muted" />
            </button>
          </div>
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Subject</p>
            <input placeholder="Email subject" className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border px-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none" />
          </div>
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Message</p>
            <textarea rows={7} placeholder="Type your message..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors"><Paperclip size={13} /> Attach Files</button>
            <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors"><CalendarDays size={13} /> Schedule Send</button>
            <span className="ml-auto text-[11px] text-admin-muted">characters: 0 / 5000</span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-admin-border pt-4">
          <Button variant="ghost" size="sm" onClick={() => setComposeOpen(false)}>Save Draft</Button>
          <Button size="sm" onClick={() => { setComposeOpen(false); setToast({ type: 'success', message: 'Email sent' }) }}><Send size={14} /> Send Email</Button>
        </div>
      </Modal>
    </div>
  )
}
