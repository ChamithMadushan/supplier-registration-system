import React, { useState } from 'react'
import {
  RefreshCw, CalendarCheck2, CheckCircle2, Circle, AlertCircle, FileText, Wallet,
  ClipboardCheck, Download, Clock3, History, ArrowRight, ShieldCheck, BadgeCheck, Stamp,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'

const renewalSteps = [
  {
    title: 'Review & Update Company Information',
    desc: 'Confirm legal name, address, directors and contact details are current.',
    status: 'done',
  },
  {
    title: 'Update Required Documents',
    desc: 'Tax clearance, insurance, and bank statements must be valid within 3 months.',
    status: 'attention',
    note: 'Tax Clearance Certificate expired',
  },
  {
    title: 'Verify Financial Information',
    desc: 'Review turnover and financial data captured for the past 12 months.',
    status: 'pending',
  },
  {
    title: 'Review Compliance & Certifications',
    desc: 'Confirm ISO and compliance certifications are still valid.',
    status: 'pending',
  },
  {
    title: 'Sign Declaration & Submit',
    desc: 'Digitally sign the declaration and pay the renewal fee to submit.',
    status: 'pending',
  },
]

const fees = [
  ['Registration Renewal Fee', 'LKR 25,000.00'],
  ['Administration Fee', 'LKR 1,500.00'],
  ['Service Tax (18%)', 'LKR 4,770.00'],
]

const history = [
  { year: '2023', ref: 'SRS-2023-000987', status: 'Completed', date: '12 Mar 2023' },
  { year: '2024', ref: 'SRS-2024-000112', status: 'Completed', date: '10 Mar 2024' },
  { year: '2025', ref: 'SRS-2024-001234', status: 'In Progress', date: 'Opens 12 Feb 2025' },
]

export default function Renewal() {
  const [toast, setToast] = useState(null)

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold font-heading text-ink">Annual Renewal</h1>
          <p className="text-sm text-ink-muted mt-1">Renew your supplier registration for the next year</p>
        </div>
        <span className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-full bg-accent/10 text-accent-hover text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Renewal Window Open
        </span>
      </div>

      {/* Overview */}
      <div className="mt-6 bg-gradient-to-br from-primary to-primary-light rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1">
            <p className="flex items-center gap-2 text-white/80 text-sm">
              <RefreshCw size={16} className="text-accent" /> Next renewal cycle · 2025 / 2026
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-heading">Your registration renews soon</h2>
            <p className="mt-2 text-white/70 text-sm max-w-[540px]">
              Renewal opens 90 days before your registration anniversary. Keep documents current to renew without delays.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-white/60 text-xs">Renewal Due</p>
                <p className="font-semibold font-mono mt-1">15 March 2025</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Days Remaining</p>
                <p className="font-bold text-accent font-mono mt-1">58 days</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Registration Ref</p>
                <p className="font-semibold font-mono mt-1">SRS-2024-001234</p>
              </div>
            </div>
          </div>

          {/* Progress ring */}
          <div className="relative w-[150px] h-[150px] shrink-0 mx-auto lg:mx-0">
            <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
              <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
              <circle
                cx="75" cy="75" r="62" fill="none"
                stroke="#F18F01" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - 0.36)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-heading font-bold text-2xl">36%</p>
              <p className="text-[11px] text-white/60 mt-0.5">completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Renewal checklist */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <p className="flex items-center gap-2 font-heading font-semibold text-[17px] text-ink">
              <ClipboardCheck size={20} className="text-accent" /> Renewal Checklist
            </p>
            <span className="text-xs font-bold text-accent-hover font-mono">1 / 5 complete</span>
          </div>
          <div className="space-y-3">
            {renewalSteps.map((s, i) => (
              <div key={s.title} className={`rounded-[12px] border p-5 ${s.status === 'done' ? 'border-success/30 bg-success-light/30' : s.status === 'attention' ? 'border-danger/30 bg-danger-light/40' : 'border-line-soft bg-surface/40'}`}>
                <div className="flex items-start gap-3.5">
                  {s.status === 'done' ? (
                    <CheckCircle2 size={22} className="text-success shrink-0 mt-0.5" />
                  ) : s.status === 'attention' ? (
                    <AlertCircle size={22} className="text-danger shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={22} className="text-ink-faint shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-[15px] font-semibold ${s.status === 'attention' ? 'text-danger-dark' : 'text-ink'}`}>
                        {i + 1}. {s.title}
                      </p>
                      {s.status === 'done' && <span className="text-[10px] font-bold text-success-dark bg-success-light px-2 py-0.5 rounded-full">DONE</span>}
                      {s.status === 'attention' && <span className="text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full">ACTION NEEDED</span>}
                    </div>
                    <p className="mt-1 text-[13px] text-ink-muted">{s.desc}</p>
                    {s.note && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-danger">
                        <AlertCircle size={12} /> {s.note}
                      </p>
                    )}
                    {s.status !== 'done' && (
                      <Button size="sm" variant={s.status === 'attention' ? 'danger' : 'secondary'} className="mt-3">
                        {s.status === 'attention' ? 'Resolve Now' : 'Start'} <ArrowRight size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fee summary */}
          <div className="mt-6 rounded-[12px] border border-line-soft overflow-hidden">
            <div className="px-5 py-3.5 bg-surface border-b border-line-soft flex items-center justify-between">
              <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
                <Wallet size={17} className="text-secondary" /> Renewal Fee Summary
              </p>
              <span className="text-[11px] font-bold text-ink-muted">Year 2025 / 26</span>
            </div>
            <div className="divide-y divide-line-soft/70">
              {fees.map(([k, v]) => (
                <div key={k} className="flex justify-between px-5 py-3 text-[13px]">
                  <span className="text-ink-muted">{k}</span>
                  <span className="font-semibold text-ink font-mono">{v}</span>
                </div>
              ))}
              <div className="flex justify-between px-5 py-3.5 bg-accent/5">
                <span className="font-bold text-ink">Total Due</span>
                <span className="font-bold text-accent-hover font-mono">LKR 31,270.00</span>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-line-soft">
              <Button className="w-full" onClick={() => setToast({ type: 'success', message: 'Payment gateway opened' })}>
                <Stamp size={15} /> Proceed to Renewal Payment
              </Button>
              <p className="mt-2.5 text-center text-[11px] text-ink-faint">
                Payments via credit card, bank transfer or PayHere
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Requirements */}
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
              <ShieldCheck size={17} className="text-success" /> Eligibility for Renewal
            </p>
            <ul className="mt-4 space-y-3">
              {[
                ['No outstanding actions or rejected documents', true],
                ['Valid tax clearance certificate', false],
                ['Valid business registration', true],
                ['Up-to-date financial information', true],
                ['No compliance violations in past year', true],
              ].map(([label, ok]) => (
                <li key={label} className="flex items-start gap-2.5">
                  {ok ? (
                    <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
                  )}
                  <span className={`text-[13px] ${ok ? 'text-ink' : 'text-danger-dark font-medium'}`}>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* History */}
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-line-soft">
              <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
                <History size={17} className="text-secondary" /> Renewal History
              </p>
            </div>
            <div className="divide-y divide-line-soft/70">
              {history.map((h) => (
                <div key={h.ref} className="px-5 py-4 flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${h.status === 'Completed' ? 'bg-success-light text-success' : 'bg-accent/10 text-accent-hover'}`}>
                    {h.status === 'Completed' ? <BadgeCheck size={18} /> : <Clock3 size={18} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-ink">
                      Renewal {h.year}
                      <span className="ml-2 text-[11px] font-normal text-ink-muted font-mono">{h.ref}</span>
                    </p>
                    <p className="text-[11px] text-ink-muted mt-0.5">{h.date}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${h.status === 'Completed' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setToast({ type: 'info', message: 'Certificate download started' })}
              className="w-full py-3 text-center text-[13px] font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors border-t border-line-soft"
            >
              <span className="inline-flex items-center gap-1.5"><Download size={14} /> Download Previous Certificate</span>
            </button>
          </div>

          {/* Note */}
          <div className="rounded-[12px] bg-secondary/5 border border-secondary/20 px-5 py-4">
            <p className="flex items-start gap-2.5 text-[13px] text-ink-muted leading-relaxed">
              <CalendarCheck2 size={16} className="text-secondary shrink-0 mt-0.5" />
              Renewal reminders will be sent by email and notification 90, 30 and 7 days before your due date.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
