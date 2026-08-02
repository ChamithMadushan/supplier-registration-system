import React from 'react'

export default function AdminStatCard({ icon: Icon, label, value, trend, trendUp, sub, border = 'border-primary', iconBg = 'bg-primary/10 text-primary', onClick, bar }) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 pt-6 text-left overflow-hidden transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <span className={`absolute top-0 left-0 right-0 h-[3px] ${border}`} />
      <div className="flex items-start justify-between">
        <span className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon size={22} />
        </span>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${trendUp ? 'text-success-dark' : 'text-danger'}`}>
            <span>{trendUp ? '▲' : '▼'}</span> {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-[28px] font-bold font-heading text-admin-text leading-none">{value}</p>
      <p className="mt-1.5 text-[12px] font-medium text-admin-light">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-admin-muted">{sub}</p>}
      {bar && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: `${bar}%` }} />
          </div>
          <span className="text-[10px] font-mono text-admin-muted">{bar}%</span>
        </div>
      )}
    </button>
  )
}
