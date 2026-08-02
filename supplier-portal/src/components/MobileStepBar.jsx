import React from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { REG_STEPS } from './RegistrationSidebar'

export default function MobileStepBar({ activeStep }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-primary text-white shadow-[var(--shadow-sidebar)]">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold">
          Step {activeStep} of 6: <span className="text-accent">{REG_STEPS[activeStep - 1]?.title}</span>
        </p>
        <div className="flex gap-1.5">
          {REG_STEPS.map((s) => (
            <span
              key={s.n}
              className={`w-2.5 h-2.5 rounded-full ${
                s.n === activeStep
                  ? 'bg-accent'
                  : s.n < activeStep
                    ? 'bg-success'
                    : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
        {REG_STEPS.map((s) => (
          <Link
            key={s.n}
            to={s.n < activeStep ? s.path : undefined}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              s.n === activeStep
                ? 'bg-accent text-white'
                : s.n < activeStep
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-white/10 text-white/50'
            }`}
          >
            {s.n < activeStep && <Check size={12} />}
            {s.n}. {s.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
