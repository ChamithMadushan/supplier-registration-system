import React from 'react'

export default function Toggle({ checked, onChange, label, description, yesLabel = 'Yes', noLabel = 'No' }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-300 shrink-0 ${
          checked ? 'bg-success' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? 'translate-x-[27px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
      {label && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{label}</span>
          <span className="text-sm">
            <span className={checked ? 'font-semibold text-success' : 'text-ink-muted'}>{checked ? yesLabel : noLabel}</span>
          </span>
          {description && <span className="text-xs text-ink-muted">{description}</span>}
        </div>
      )}
    </div>
  )
}
