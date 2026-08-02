import React from 'react'

export default function SectionLabel({ icon: Icon, children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-2 ${className}`}>
      {Icon && <Icon size={14} className="text-accent" />}
      <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-muted">
        {children}
      </span>
      <span className="flex-1 h-px bg-line" />
    </div>
  )
}
