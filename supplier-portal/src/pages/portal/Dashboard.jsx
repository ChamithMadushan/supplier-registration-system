import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList, FileText, Clock, BellRing, ArrowRight, Upload, Eye, PencilLine,
  PhoneCall, AlertTriangle, BadgeCheck, XCircle, ChevronRight, Wallet, Package, Building2, CheckCircle2, AlertCircle,
  ShieldAlert, Info, CheckCheck,
} from 'lucide-react'
import StatusSteps from '../../components/portal/StatusSteps'
import StatCard from '../../components/portal/StatCard'
import Button from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

const notifMeta = {
  error: { icon: ShieldAlert, bg: 'bg-danger-light text-danger' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-light text-warning-dark' },
  success: { icon: CheckCircle2, bg: 'bg-success-light text-success-dark' },
  info: { icon: Clock, bg: 'bg-secondary/10 text-secondary' },
  default: { icon: Info, bg: 'bg-info-light text-info' },
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

const stages = [
  { label: 'Submit', date: '08 Jan', icon: FileText },
  { label: 'Screen', date: '10 Jan', icon: SearchCircle },
  { label: 'Verify', date: 'Today', icon: BadgeCheck },
  { label: 'Evaluate', date: 'Pending', icon: ClipboardList },
  { label: 'Approve', date: 'Pending', icon: CheckCircle2 },
]

function SearchCircle(props) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

const STATUS_META = {
  in_progress: { label: 'In Progress', cls: 'bg-warning-light text-warning-dark', dot: 'bg-warning', stage: 0 },
  submitted: { label: 'Submitted', cls: 'bg-info-light text-info-dark', dot: 'bg-info', stage: 1 },
  under_review: { label: 'Under Review', cls: 'bg-warning-light text-warning-dark', dot: 'bg-warning', stage: 2 },
  approved: { label: 'Approved', cls: 'bg-success-light text-success-dark', dot: 'bg-success', stage: 4 },
  rejected: { label: 'Rejected', cls: 'bg-danger-light text-danger-dark', dot: 'bg-danger', stage: 4 },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, application, company } = useAuth()
  const [toast, setToast] = useState(null)
  const [notifs, setNotifs] = useState([])
  const [notifsLoading, setNotifsLoading] = useState(true)

  useEffect(() => {
    api.notifications()
      .then((d) => setNotifs(d.notifications || []))
      .catch(() => {})
      .finally(() => setNotifsLoading(false))
  }, [])

  const markAllNotifs = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: 1 })))
    api.readAllNotifications().catch(() => {})
    setToast({ type: 'success', message: 'All notifications marked as read' })
  }

  const status = (application?.status || 'in_progress').replace('-', '_')
  const meta = STATUS_META[status] || STATUS_META.in_progress
  const completedSteps = (application?.steps || []).filter((s) => s.completed).length
  const completeness = application?.steps?.length ? Math.round((completedSteps / application.steps.length) * 100) : 0
  const unreadCount = notifs.filter((n) => !n.isRead).length
  const firstName = (user?.fullName || 'Supplier').split(' ')[0]

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const submitted = application?.submittedAt
    ? new Date(application.submittedAt + 'Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Not yet'

  const rejectedDocs = (application?.documents || []).filter((d) => d.status === 'rejected')

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold font-heading text-ink">
            Welcome back, {firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="text-sm text-ink-muted mt-1">{today}</p>
          <p className="text-[13px] text-ink-muted">Here's your application status</p>
        </div>
        <span className={`inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-full text-xs font-bold ${meta.cls}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${meta.dot}`} /> {meta.label}
        </span>
      </div>

      {/* Application status card */}
      <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-heading font-semibold text-[17px] text-ink">
            <ClipboardList size={20} className="text-accent" /> Your Application Status
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <span>
              Reference: <span className="font-mono font-semibold text-ink">{application?.referenceNo || '—'}</span>
            </span>
            <span className="hidden sm:inline">| {company?.legalName || 'Supplier Account'}</span>
          </div>
        </div>

        <div className="mt-8 px-1 sm:px-4">
          <StatusSteps steps={stages} activeIndex={meta.stage} />
        </div>

        <div className="mt-7 rounded-[12px] bg-surface border border-line-soft p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">
              Current Stage: <span className="text-accent-hover">{meta.label}</span>
            </p>
            <p className="text-xs text-ink-muted">Status: {application?.status || 'draft'}</p>
          </div>
          <div className="mt-2.5 h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: `${Math.max(meta.stage * 20, 8)}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1"><Clock size={13} className="text-secondary" /> Submitted: {submitted}</span>
            <span>Reference: {application?.referenceNo || '—'}</span>
          </div>
          <button
            onClick={() => navigate('/portal/application')}
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors"
          >
            View Details <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Three column grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: small stats */}
        <div className="space-y-4">
          <StatCard
            icon={FileText} accent="success" label="Documents" value={`${application?.documents?.length || 0} / 12`}
            bar barValue={(application?.documents?.length || 0) / 12 * 100} sub={`${(application?.documents || []).filter((d) => d.status !== 'verified').length} pending`}
            onClick={() => navigate('/portal/documents')}
          />
          <StatCard icon={Clock} accent="info" label="Application Status" value={meta.label} sub="Live from database" />
          <div className="bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-5 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-[10px] bg-danger-light text-danger flex items-center justify-center">
                <BellRing size={22} />
              </span>
              <span className="text-[11px] font-medium text-ink-muted">Unread</span>
            </div>
            <p className="mt-3 text-2xl font-bold font-heading text-ink leading-none">{unreadCount}</p>
            <p className="mt-1.5 text-[13px] text-ink-muted">New Notifications</p>
            <button
              onClick={() => navigate('/portal/notifications')}
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-danger hover:text-danger/70 transition-colors"
            >
              View Now <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Column 2: notifications */}
        <div className="lg:col-span-1 bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] flex flex-col">
          <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-3 border-b border-line-soft">
            <p className="font-heading font-semibold text-[15px] text-ink">Notifications</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllNotifs} className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:text-primary transition-colors">
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
              <span className="text-xs font-bold text-danger">{unreadCount} unread</span>
            </div>
          </div>
          <div className="flex-1 max-h-[520px] overflow-y-auto">
            {notifsLoading ? (
              <div className="px-5 py-8 text-center text-sm text-ink-muted">Loading notifications...</div>
            ) : notifs.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-ink-muted">No notifications yet</div>
            ) : (
              notifs.map((n) => {
                const m = notifMeta[n.type] || notifMeta.default
                const isUnread = !n.isRead
                return (
                  <button
                    key={n.id}
                    onClick={() => navigate('/portal/notifications')}
                    className={`w-full flex items-start gap-3 px-5 py-4 border-b border-line-soft/60 last:border-0 text-left hover:bg-surface/60 transition-colors ${isUnread ? 'bg-secondary/[0.03]' : ''}`}
                  >
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.bg}`}>
                      <m.icon size={16} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <span className={`text-[13px] truncate ${isUnread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}>{n.title}</span>
                        {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                      </span>
                      <span className="block text-xs text-ink-muted mt-0.5 line-clamp-2">{n.message}</span>
                      <span className="block text-[10px] font-medium text-ink-faint mt-1">{timeAgo(n.createdAt)}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
          <button
            onClick={() => navigate('/portal/notifications')}
            className="w-full py-3 text-center text-[13px] font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors border-t border-line-soft"
          >
            View All Notifications
          </button>
        </div>

        {/* Column 3: quick actions */}
        <div className="bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-5">
          <p className="font-heading font-semibold text-[15px] text-ink mb-4">⚡ Quick Actions</p>
          <div className="space-y-2.5">
            {[
              { icon: Upload, label: 'Upload Documents', to: '/portal/documents' },
              { icon: Eye, label: 'View Application', to: '/portal/application' },
              { icon: PencilLine, label: 'Edit Profile', to: '/portal/profile' },
              { icon: PhoneCall, label: 'Contact Support', to: '/portal/support' },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border border-line-soft text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <span className="w-9 h-9 rounded-[8px] bg-surface group-hover:bg-accent/10 text-ink-muted group-hover:text-accent flex items-center justify-center transition-colors">
                  <a.icon size={18} />
                </span>
                <span className="flex-1 text-[14px] font-medium text-ink">{a.label}</span>
                <ChevronRight size={16} className="text-ink-faint group-hover:text-accent transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action required section */}
      {rejectedDocs.length > 0 && (
        <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 bg-danger-light/50 border-b border-danger/10">
            <AlertTriangle size={19} className="text-danger" />
            <p className="font-heading font-semibold text-[15px] text-danger-dark">Action Required (Urgent)</p>
            <span className="ml-auto text-xs font-bold text-danger">{rejectedDocs.length} item{rejectedDocs.length > 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-line-soft">
            {rejectedDocs.map((d) => (
              <div key={d.id} className="p-6">
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 bg-danger-light text-danger">
                    <FileText size={22} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[15px] text-ink">{d.label}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full">
                        <XCircle size={11} /> REJECTED
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">
                      {d.reviewNote || 'This document was rejected during verification. Please re-upload a clear, valid copy.'}
                    </p>
                    <Button size="sm" variant="danger" className="mt-3" onClick={() => navigate('/portal/documents')}>
                      <Upload size={15} /> Re-upload Document
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile completeness */}
      <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-heading font-semibold text-[16px] text-ink">
            <BadgeCheck size={20} className="text-success" /> Profile Completeness
          </p>
          <span className="text-sm font-bold text-accent-hover">{completeness}%</span>
        </div>
        <div className="mt-3 h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: `${completeness}%` }} />
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: UserCircle, label: 'Account Information', ok: !!user },
            { icon: Building2, label: 'Company Information', ok: !!company },
            { icon: Package, label: 'Business Details', ok: (application?.steps || []).find((s) => s.stepNumber === 3)?.completed },
            { icon: Wallet, label: 'Financial Information', ok: (application?.steps || []).find((s) => s.stepNumber === 4)?.completed },
            { icon: FileText, label: 'Documents', ok: (application?.documents || []).length > 0, note: `${(application?.documents || []).length} uploaded` },
            { icon: PencilLine, label: 'Declaration Signed', ok: (application?.steps || []).find((s) => s.stepNumber === 6)?.completed },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 rounded-[10px] border px-3.5 py-3 ${
                s.ok ? 'border-success/30 bg-success-light/40' : 'border-warning/30 bg-warning-light/50'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.ok ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                {s.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              </span>
              <span className={`text-[13px] font-medium ${s.ok ? 'text-success-dark' : 'text-warning-dark'}`}>
                {s.label}
                {s.note && <span className="block text-[11px] opacity-80">{s.note}</span>}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-[10px] bg-surface border border-line-soft px-4 py-3">
          <p className="text-[13px] text-ink-muted">
            {application?.status === 'submitted' ? 'Your application has been submitted and is under review.' : 'Complete your registration for faster processing'}
          </p>
          {application?.status === 'in_progress' && (
            <Button size="sm" onClick={() => navigate('/register/step-2')}>
              Continue Registration <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function UserCircle(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}
