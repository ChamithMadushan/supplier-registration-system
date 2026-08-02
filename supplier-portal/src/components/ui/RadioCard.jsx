import React from 'react'
import { Check } from 'lucide-react'

export default function RadioCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative text-left p-4 rounded-[12px] border-2 transition-all duration-200 ${
        selected
          ? 'border-accent bg-accent/10 shadow-[0_2px_12px_rgba(241,143,1,0.2)]'
          : 'border-line-soft bg-white hover:border-secondary/50 hover:shadow-[var(--shadow-card)]'
      } ${className}`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center anim-fade-in">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
      <div className="flex items-start gap-3">
        {Icon && (
          <span className={`text-[26px] ${selected ? 'text-accent' : 'text-ink-faint'}`}>
            <Icon size={26} />
          </span>
        )}
        <div>
          <p className={`font-semibold text-sm ${selected ? 'text-accent-hover' : 'text-ink'}`}>{title}</p>
          {description && <p className="text-xs text-ink-muted mt-1">{description}</p>}
        </div>
      </div>
    </button>
  )
}
