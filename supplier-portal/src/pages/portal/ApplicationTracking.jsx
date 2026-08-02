import React, { useState, useEffect } from 'react'
import {
  FileText, ClipboardList, BadgeCheck, CheckCircle2, Search, Clock3, MessageSquareText,
  Building2, CalendarDays, Tag, Download, Share2, ChevronRight, Lock, StickyNote, ArrowRight,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

const STATUS_META = {
  in_progress: { label: 'In Progress', stage: 0 },
  submitted: { label: 'Submitted', stage: 1 },
  under_review: { label: 'Under Review', stage: 2 },
  approved: { label: 'Approved', stage: 4 },
  rejected: { label: 'Rejected', stage: 2 },
}

const stageDefs = [
  { id: 1, name: 'Application Submitted', icon: FileText, detail: 'Your application was submitted successfully and a reference number was assigned.' },
  { id: 2, name: 'Initial Screening', icon: Search, detail: 'Basic checks: eligibility criteria, completeness of the form, and mandatory fields.' },
  { id: 3, name: 'Document Verification', icon: BadgeCheck, detail: 'Evaluators are verifying your required documents. Re-upload any rejected items from the Documents page.' },
  { id: 4, name: 'Evaluation & Scoring', icon: ClipboardList, detail: 'Scored on financial strength, capacity, quality systems, and compliance.' },
  { id: 5, name: 'Approval & Contract', icon: CheckCircle2, detail: 'Final approval decision and on-boarding communication.' },
]

function parseList(v) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      if (Array.isArray(parsed)) return parsed
      return v.split(',').map((s) => s.trim()).filter(Boolean)
    } catch {
      return v.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(String(str).replace(' ', 'T') + 'Z')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ApplicationTracking() {
  const { application, company } = useAuth()
  const [toast, setToast] = useState(null)
  const [open, setOpen] = useState([2, 3])
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    api.notifications().then((d) => setNotifs(d.notifications || [])).catch(() => {})
  }, [])

  const statusRaw = (application?.status || 'in_progress').replace('-', '_')
  const meta = STATUS_META[statusRaw] || STATUS_META.in_progress
  const currentStageIdx = meta.stage

  const stages = stageDefs.map((s, i) => {
    if (statusRaw === 'approved') return { ...s, status: 'done', date: 'Completed' }
    if (i < currentStageIdx) return { ...s, status: 'done', date: 'Completed' }
    if (i === currentStageIdx) {
      return {
        ...s,
        status: 'active',
        date: statusRaw === 'in_progress' ? 'Waiting for submission' : 'In Progress',
        alert: statusRaw === 'rejected' ? 'Your application was not approved — see your notifications for the reason.' : undefined,
      }
    }
    return { ...s, status: 'pending', date: 'Pending' }
  })

  const toggle = (id) => setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const specializations = parseList(company?.specializations)
  const rejectedCount = (application?.documents || []).filter((d) => d.status === 'rejected' || d.status === 'expired').length
  const submitted = formatDate(application?.submittedAt)

  const log = (notifs.length
    ? notifs.slice(0, 8).map((n) => ({ who: n.type === 'error' ? 'System alert' : 'System', text: n.message, time: n.createdAt }))
    : [])

  const keyDetails = [
    ['Business Type', company?.businessType || '—'],
    ['Sub-Category', specializations[0] || '—'],
    ['Date Submitted', submitted],
    ['Evaluator', 'Assigned during review'],
    ['Reference', application?.referenceNo || '—'],
  ]

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold font-heading text-ink">Application Tracking</h1>
          <p className="text-sm text-ink-muted mt-1">Track the live progress of your application</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" onClick={() => setToast({ type: 'info', message: 'Application downloaded as PDF' })}>
            <Download size={15} /> Download PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setToast({ type: 'info', message: 'Share link copied' })}>
            <Share2 size={15} /> Share
          </Button>
        </div>
      </div>

      {/* Ref + summary bar */}
      <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center">
              <ClipboardList size={28} />
            </span>
            <div>
              <p className="text-xs text-ink-muted uppercase tracking-wide font-bold">Application Reference</p>
              <p className="text-xl font-bold font-mono text-ink">{application?.referenceNo || '—'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <Building2 size={14} className="text-secondary" /> {company?.legalName || 'Supplier Account'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} className="text-secondary" /> Submitted: {submitted}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tag size={14} className="text-secondary" /> {specializations.slice(0, 3).join(' · ') || 'General'}
            </span>
          </div>
        </div>
        <div className="mt-5 rounded-[10px] bg-surface border border-line-soft px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">
            Current Stage: <span className="text-accent-hover">{meta.label}</span>
            <span className="ml-2 text-xs font-normal text-ink-muted">Stage {Math.min(currentStageIdx + 1, 5)} of 5</span>
          </p>
          <div className="flex items-center gap-4">
            {rejectedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-dark bg-warning-light px-3 py-1.5 rounded-full">
                <Clock3 size={13} /> {rejectedCount} action{rejectedCount > 1 ? 's' : ''} required
              </span>
            )}
            <button
              onClick={() => setToast({ type: 'info', message: 'Navigating to Documents' })}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors"
            >
              Re-upload now <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: `${Math.max(currentStageIdx * 20, 8)}%` }} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Timeline */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-7">
          <p className="font-heading font-semibold text-[17px] text-ink mb-6">Application Timeline</p>
          <div className="relative">
            {stages.map((s, i) => (
              <div key={s.id} className="relative flex gap-4 pb-8 last:pb-0">
                {i < stages.length - 1 && (
                  <span className={`absolute left-[19px] top-11 bottom-0 w-[2px] ${s.status === 'done' ? 'bg-success' : 'bg-line-soft'}`} />
                )}
                <span
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white shadow ${
                    s.status === 'done' ? 'bg-success text-white'
                      : s.status === 'active' ? 'bg-accent text-white animate-pulse-ring'
                        : 'bg-[#E9ECEF] text-ink-faint'
                  }`}
                >
                  <s.icon size={17} />
                </span>

                <div className="flex-1 min-w-0">
                  <button onClick={() => toggle(s.id)} className="w-full text-left group">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-[15px] font-semibold ${s.status === 'active' ? 'text-accent-hover' : 'text-ink'}`}>{s.name}</p>
                      {s.status === 'done' && <CheckCircle2 size={15} className="text-success" />}
                      {s.status === 'active' && (
                        <span className="text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded-full">IN PROGRESS</span>
                      )}
                      <span className="text-[11px] text-ink-muted font-mono ml-auto">{s.date}</span>
                    </div>
                    <p className="text-[13px] text-ink-muted mt-1 pr-6">{s.detail}</p>
                    {s.alert && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-danger bg-danger-light/60 px-3 py-1.5 rounded-full">
                        <StickyNote size={12} /> {s.alert}
                      </p>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Key details */}
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
            <p className="font-heading font-semibold text-[15px] text-ink mb-4">Key Details</p>
            <dl className="space-y-3">
              {keyDetails.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line-soft/70 pb-2.5 last:border-0">
                  <dt className="text-[13px] text-ink-muted">{k}</dt>
                  <dd className="text-[13px] font-semibold text-ink text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-2 rounded-[8px] bg-success-light/50 border border-success/20 px-3 py-2.5 text-[12px] text-success-dark">
              <Lock size={13} className="shrink-0" /> Your information is confidential
            </div>
          </div>

          {/* Communication log */}
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-line-soft">
              <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
                <MessageSquareText size={17} className="text-accent" /> Communication Log
              </p>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {log.length === 0 && <p className="px-5 py-4 text-[13px] text-ink-muted">No updates yet.</p>}
              {log.map((l, i) => (
                <div key={i} className="px-5 py-4 border-b border-line-soft/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-bold text-secondary">{l.who}</p>
                    <span className="ml-auto text-[10px] text-ink-faint">{l.time}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">{l.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setToast({ type: 'info', message: 'New message opened' })}
              className="w-full py-3 text-center text-[13px] font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors border-t border-line-soft"
            >
              <span className="inline-flex items-center gap-1">Send a Message <ChevronRight size={14} /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
