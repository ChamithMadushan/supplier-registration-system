import React, { useState } from 'react'

export function Sparkline({ data, color = '#2E86AB', width = 90, height = 26 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * (width - 4) + 2,
    height - 3 - ((v - min) / range) * (height - 8),
  ])
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AreaChart({ data, series, height = 260 }) {
  const [hover, setHover] = useState(null)
  const W = 720
  const H = height
  const P = { l: 44, r: 12, t: 16, b: 28 }
  const all = data.flatMap((d) => series.map((s) => d[s.key]))
  const maxV = Math.max(...all) * 1.15 || 1
  const innerW = W - P.l - P.r
  const innerH = H - P.t - P.b
  const x = (i) => P.l + (i / (data.length - 1)) * innerW
  const y = (v) => P.t + innerH - (v / maxV) * innerH

  const colors = { new: '#2E86AB', approved: '#28A745', rejected: '#DC3545' }

  const linePath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ')
  const areaPath = (key) => `${linePath(key)} L${x(data.length - 1).toFixed(1)},${(P.t + innerH).toFixed(1)} L${P.l},${(P.t + innerH).toFixed(1)} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={P.t + innerH * t} y2={P.t + innerH * t} stroke="#F0F0F0" strokeWidth="1" />
            <text x={P.l - 8} y={P.t + innerH * t + 4} textAnchor="end" fontSize="11" fill="#A0AEC0">
              {Math.round(maxV * (1 - t))}
            </text>
          </g>
        ))}
        <path d={areaPath('new')} fill="rgba(46,134,171,0.12)" />
        {series.map((s) => (
          <path key={s.key} d={linePath(s.key)} fill="none" stroke={colors[s.key] || '#2E86AB'} strokeWidth="2.2" strokeLinecap="round" />
        ))}
        {data.map((d, i) => (
          <g key={d.label}>
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#A0AEC0">{d.label}</text>
            {hover === i && (
              <g>
                <line x1={x(i)} x2={x(i)} y1={P.t} y2={P.t + innerH} stroke="#CBD5E0" strokeDasharray="4 3" />
                {series.map((s) => (
                  <circle key={s.key} cx={x(i)} cy={y(d[s.key])} r="4" fill={colors[s.key]} stroke="#fff" strokeWidth="2" />
                ))}
              </g>
            )}
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div className="absolute z-10 -translate-x-1/2 bg-navy-800 text-white text-[11px] rounded-[8px] px-3 py-2 shadow-lg pointer-events-none" style={{ left: `${((x(hover) / W) * 100).toFixed(1)}%`, top: '0%' }}>
          <p className="font-bold mb-1">{data[hover].label}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: colors[s.key] }} />
              {s.label}: {data[hover][s.key]}
            </p>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-5 mt-2">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[12px] text-admin-medium">
            <span className="w-3 h-3 rounded-sm" style={{ background: colors[s.key] }} /> {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function DonutChart({ segments, size = 220, thickness = 26, center, onSelect }) {
  const [active, setActive] = useState(null)
  const total = segments.reduce((s, x) => s + x.value, 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let acc = 0

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((s, i) => {
            const frac = s.value / total
            const len = frac * c
            const offset = c - acc - len
            acc += len
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={offset}
                onMouseEnter={() => { setActive(i); onSelect?.(s) }}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer transition-opacity"
                opacity={active === null || active === i ? 1 : 0.35}
                strokeLinecap="butt"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold font-heading text-admin-text leading-none">{center}</span>
          <span className="text-[11px] text-admin-muted mt-1">Total</span>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        {segments.map((s, i) => (
          <div key={s.label} className={`flex items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 transition-colors ${active === i ? 'bg-table-header' : ''}`}>
            <span className="w-3 h-3 rounded-[3px] shrink-0" style={{ background: s.color }} />
            <span className="flex-1 text-[12px] text-admin-medium">{s.label}</span>
            <span className="text-[12px] font-semibold text-admin-text">{s.value}</span>
            <span className="text-[11px] text-admin-muted font-mono">{((s.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data, color, height = 200, suffix = '' }) {
  const max = Math.max(...data.map((d) => d.value)) * 1.15 || 1
  return (
    <div className="flex items-end gap-2 sm:gap-3 h-[210px]">
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
          <span className="text-[11px] font-mono font-bold text-admin-text opacity-0 group-hover:opacity-100 transition-opacity">{d.value}{suffix}</span>
          <div className="relative w-full flex justify-center" style={{ height }}>
            <div className="absolute bottom-0 w-full max-w-[36px] bg-[#E9ECEF] rounded-t-[6px]" style={{ height: '100%' }} />
            <div
              className="absolute bottom-0 w-full max-w-[36px] rounded-t-[6px] transition-all duration-500 group-hover:brightness-110"
              style={{ height: `${(d.value / max) * 100}%`, background: Array.isArray(color) ? color[i] : color }}
            />
          </div>
          <span className="text-[11px] text-admin-muted font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function HBarChart({ data, max }) {
  const m = max || Math.max(...data.map((d) => d.value))
  return (
    <div className="space-y-3.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-[12px] mb-1">
            <span className="font-medium text-admin-text">{d.label}</span>
            <span className="font-mono font-bold text-admin-medium">{d.value}</span>
          </div>
          <div className="h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${d.color || 'bg-gradient-to-r from-secondary to-info'}`}
              style={{ width: `${(d.value / m) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
