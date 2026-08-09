import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

const emojis = ['🏭', '💻', '🔧', '🚚', '🏗️', '🧹', '👔', '⚡', '🖨️', '🏥', '🌿', '🚗']

function Row({ items, hidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {items.map((label, i) => (
        <div key={label} className="flex items-center gap-2.5 lp-faint">
          <span className="text-[22px]" aria-hidden>
            {emojis[i]}
          </span>
          <span className="whitespace-nowrap text-[15px] font-semibold tracking-wide">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function TrustMarquee() {
  const { t } = useLanguage()
  const items = t('marquee.items')
  return (
    <section className="relative lp-bg-alt border-b border-white/5 py-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <span className="lp-eyebrow justify-center text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          {t('marquee.label')}
        </span>
      </div>
      <div className="marquee-paused relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track">
          <Row items={items} />
          <Row items={items} hidden />
        </div>
      </div>
    </section>
  )
}
