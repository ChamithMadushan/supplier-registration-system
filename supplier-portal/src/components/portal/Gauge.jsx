import React from 'react'

export default function Gauge({ value, max = 5, size = 200, label, sublabel, stroke = 14, display }) {
  const pct = (value / max) * 100
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  const color = pct >= 90 ? '#28A745' : pct >= 70 ? '#F18F01' : pct >= 50 ? '#FFC107' : '#DC3545'
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E9ECEF" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {display ? (
          <span className="font-heading font-bold text-ink" style={{ fontSize: size / 5 }}>
            {display}
          </span>
        ) : (
          <>
            <span className="font-heading font-bold text-ink" style={{ fontSize: size / 5 }}>
              {value.toFixed(1)}
            </span>
            <span className="text-xs text-ink-muted">/ {max.toFixed(1)}</span>
          </>
        )}
        {label && <span className="mt-1 text-[11px] font-semibold text-ink">{label}</span>}
        {sublabel && <span className="text-[10px] text-ink-muted">{sublabel}</span>}
      </div>
    </div>
  )
}
