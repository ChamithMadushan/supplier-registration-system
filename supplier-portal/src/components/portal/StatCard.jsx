import React from 'react'

const accentMap = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning-dark',
  danger: 'bg-danger-light text-danger',
  info: 'bg-info-light text-info',
  violet: 'bg-violet-100 text-violet-700',
}

export default function StatCard({ icon: Icon, label, value, sub, bar, barValue, accent = 'primary', className = '', onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-5 transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 ${onClick ? 'text-left cursor-pointer w-full' : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${accentMap[accent]}`}>
          <Icon size={22} />
        </span>
        {sub && <span className="text-[11px] font-medium text-ink-muted text-right">{sub}</span>}
      </div>
      <p className="mt-3 text-2xl font-bold font-heading text-ink leading-none">{value}</p>
      <p className="mt-1.5 text-[13px] text-ink-muted">{label}</p>
      {bar && (
        <div className="mt-3">
          <div className="h-1.5 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
              style={{ width: `${barValue}%` }}
            />
          </div>
        </div>
      )}
    </Tag>
  )
}
