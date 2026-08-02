import React from 'react'

export default function ProgressBar({ value = 0, className = '', label }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-ink-muted">{label}</span>
          <span className="text-xs font-bold text-accent">{clamped}%</span>
        </div>
      )}
      <div
        className="h-2 w-full bg-[#E9ECEF] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
