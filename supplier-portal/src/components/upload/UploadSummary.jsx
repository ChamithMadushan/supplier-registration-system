import React from 'react'
import { BarChart3, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export default function UploadSummary({ uploaded, required, rejected }) {
  const remaining = required - uploaded
  const pct = Math.round((uploaded / required) * 100)
  return (
    <div className="rounded-[16px] border border-line-soft bg-white shadow-[var(--shadow-card)] p-6">
      <p className="flex items-center gap-2 font-heading font-semibold text-[16px] text-ink mb-4">
        <BarChart3 size={19} className="text-accent" /> Upload Summary
      </p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-muted">Total Required:</span>
        <span className="font-bold text-ink">{required} documents</span>
      </div>
      <div className="flex items-center justify-between text-sm mt-2">
        <span className="text-ink-muted">Uploaded:</span>
        <span className="font-bold text-success">{uploaded} / {required}</span>
      </div>
      <div className="mt-3">
        <div className="h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-success to-success/70 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-ink-muted mt-1.5">{pct}% complete</p>
      </div>
      <div className="flex items-center justify-between text-sm mt-3">
        <span className="text-ink-muted">Pending:</span>
        <span className="font-bold text-warning-dark">{remaining} documents</span>
      </div>
      {rejected > 0 && (
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-ink-muted">Rejected:</span>
          <span className="font-bold text-danger">{rejected} document{rejected > 1 ? 's' : ''} (re-upload)</span>
        </div>
      )}

      {remaining > 0 ? (
        <div className="mt-4 rounded-[10px] bg-warning-light/70 border border-warning/30 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-warning-dark mb-2">
            <AlertTriangle size={14} /> Mandatory Remaining:
          </p>
          <ul className="space-y-1 text-xs text-warning-dark">
            <li>• Certificate of Incorporation</li>
            <li>• Bank Statement (6 months)</li>
            {rejected > 0 && <li>⚠️ VAT Certificate (needs re-upload)</li>}
          </ul>
        </div>
      ) : (
        <div className="mt-4 rounded-[10px] bg-success-light/70 border border-success/30 p-3.5 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <p className="text-xs font-semibold text-success-dark">All mandatory documents uploaded!</p>
        </div>
      )}

      {remaining > 0 && (
        <p className="mt-4 text-xs text-ink-muted text-center">
          Can't proceed until mandatory documents are uploaded
        </p>
      )}
    </div>
  )
}
