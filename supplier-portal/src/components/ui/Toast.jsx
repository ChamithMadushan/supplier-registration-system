import React, { useEffect, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'

const toastStyles = {
  success: { icon: CheckCircle2, border: 'border-l-success', text: 'text-success-dark' },
  info: { icon: Info, border: 'border-l-info', text: 'text-info-dark' },
  warning: { icon: AlertTriangle, border: 'border-l-warning', text: 'text-warning-dark' },
  error: { icon: XCircle, border: 'border-l-danger', text: 'text-danger-dark' },
}

export function Toast({ open, message, type = 'success', onClose }) {
  const { icon: Icon, border, text } = toastStyles[type]
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className={`fixed top-6 right-6 z-[200] max-w-[380px] bg-white rounded-[12px] border-l-4 ${border} shadow-[var(--shadow-modal)] anim-slide-right flex items-center gap-3 pl-4 pr-3 py-3.5`}
      role="status"
    >
      <Icon size={22} className={`${text} shrink-0`} />
      <p className="text-sm font-medium text-ink flex-1">{message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-ink-muted hover:text-ink transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}
