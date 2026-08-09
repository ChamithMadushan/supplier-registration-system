import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo({ dark = false, size = 'md', as: Tag = Link, to = '/', brand = 'Supplier Portal' }) {
  const textSize = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-lg'
  const subText = dark ? 'text-white/50' : 'text-ink-muted'
  return (
    <Tag to={to} className="flex items-center gap-3 no-underline">
      <span className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-[0_4px_10px_rgba(241,143,1,0.35)] shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="14" rx="2" stroke="white" strokeWidth="1.6" />
          <path d="M3 9h18M7 17v2M12 17v2M17 17v2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={`block font-heading font-bold tracking-wide ${textSize} ${dark ? 'text-white' : 'text-primary'}`}
        >
          {brand}
        </span>
        <span className={`block text-[10px] font-medium tracking-[0.18em] uppercase ${subText}`}>
          Sri Lanka Procurement
        </span>
      </span>
    </Tag>
  )
}
