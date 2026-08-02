import React, { useEffect, useRef, useState } from 'react'
import { Building2, CheckCircle2, Package, Zap } from 'lucide-react'

const stats = [
  { value: 500, suffix: '+', label: 'Registered Suppliers', icon: Building2 },
  { value: 400, suffix: '+', label: 'Approved Vendors', icon: CheckCircle2 },
  { value: 15, suffix: '', label: 'Supply Categories', icon: Package },
  { value: 15, prefix: '', suffix: ' Days', label: 'Average Processing Time', icon: Zap },
]

function Counter({ value, suffix, prefix = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(Math.round(eased * value))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <span ref={ref} className="text-4xl sm:text-[44px] font-bold font-heading text-accent">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section id="stats" className="relative bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center px-6 py-8 transition-all duration-200 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 rounded-[12px] group ${
                i > 0 ? 'border-l border-line-soft' : ''
              } ${i >= 2 ? 'lg:border-t-0 border-t border-line-soft' : ''} ${
                i === 2 ? 'lg:border-l' : ''
              }`}
            >
              <span className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <s.icon size={24} />
              </span>
              <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
              <p className="mt-2 text-sm font-medium text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
