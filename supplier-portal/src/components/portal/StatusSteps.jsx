import React from 'react'
import { Check } from 'lucide-react'

export default function StatusSteps({ steps, activeIndex }) {
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const completed = i < activeIndex
        const active = i === activeIndex
        const Icon = s.icon
        return (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="relative flex items-center justify-center">
                {/* node */}
                <span
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    completed
                      ? 'bg-success border-success text-white'
                      : active
                        ? 'bg-accent border-accent text-white shadow-[0_4px_12px_rgba(241,143,1,0.4)]'
                        : 'bg-white border-line text-ink-faint'
                  }`}
                >
                  {completed ? (
                    <Check size={18} strokeWidth={3} />
                  ) : active ? (
                    <span className="relative flex w-2.5 h-2.5">
                      <span className="absolute inset-0 rounded-full bg-white/60 animate-ping" />
                      <span className="relative w-2.5 h-2.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <Icon size={17} />
                  )}
                </span>
              </div>
              <p className={`mt-2 text-[12px] font-semibold text-center ${active ? 'text-accent-hover' : completed ? 'text-success-dark' : 'text-ink-muted'}`}>
                {s.label}
              </p>
              <p className={`text-[10px] text-center ${active ? 'text-ink' : 'text-ink-faint'}`}>
                {s.date}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-1 mb-5 h-[3px] rounded-full overflow-hidden bg-[#E9ECEF]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i < activeIndex ? 'bg-success' : i === activeIndex ? 'bg-accent/40' : 'bg-[#E9ECEF]'
                  }`}
                  style={{ width: completed || active ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
