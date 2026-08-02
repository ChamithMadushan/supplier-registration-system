import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PageHeader({ title, subtitle, breadcrumb, actions }) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-[12px] text-admin-muted mb-1.5 flex-wrap">
          {breadcrumb.map((b, i) =>
            i === breadcrumb.length - 1 ? (
              <span key={i} className="font-semibold text-admin-text">{b.label}</span>
            ) : (
              <span key={i} className="flex items-center gap-1.5">
                {b.to ? <Link to={b.to} className="hover:text-secondary transition-colors">{b.label}</Link> : <span>{b.label}</span>}
                <ChevronRight size={12} />
              </span>
            ),
          )}
        </nav>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold font-heading text-admin-text leading-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-[13px] text-admin-light">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
