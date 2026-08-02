import React from 'react'
import { ChevronDown } from 'lucide-react'

export default function Select({
  label,
  required,
  helper,
  error,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  wrapperClass = '',
}) {
  return (
    <div className={wrapperClass}>
      {label && (
        <label className="block text-[13px] font-semibold text-ink mb-1.5">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full h-[48px] bg-white rounded-[8px] border-[1.5px] px-4 pr-10 text-sm text-ink appearance-none transition-all duration-200 focus:outline-none ${
            error
              ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(220,53,69,0.15)]'
              : 'border-line focus:border-secondary focus:shadow-[var(--shadow-input)]'
          } ${value === '' ? 'text-ink-faint' : ''} ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ),
          )}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
        />
      </div>
      {helper && !error && <p className="mt-1.5 text-xs text-ink-muted">{helper}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}
