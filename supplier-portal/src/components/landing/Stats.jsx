import React, { useEffect, useRef, useState } from 'react'
import { Building2, CheckCircle2, Package, Zap } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

const icons = [Building2, CheckCircle2, Package, Zap]

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
  const { t } = useLanguage()
  const stats = t('stats.items')
  return (
    <section id="stats" className="relative lp-bg-alt py-16 sm:py-20">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120} className="h-full">
              <div className="lp-glass lp-glass-hover h-full flex flex-col items-center text-center px-6 py-9 rounded-[18px] group">
                <span className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="absolute inset-0 rounded-2xl bg-accent/20 anim-pulse-ring" aria-hidden="true" />
                  {(() => { const Icon = icons[i]; return <Icon size={24} className="relative" /> })()}
                </span>
                <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                <p className="mt-2 text-sm font-medium lp-muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
