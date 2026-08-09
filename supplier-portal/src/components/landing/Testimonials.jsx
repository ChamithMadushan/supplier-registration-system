import React from 'react'
import { Star, Quote } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

const initials = ['AT', 'XS', 'DS']

function TestimonialCard({ item, initialsLabel, active }) {
  return (
    <div
      className={`lp-glass lp-glass-hover h-full rounded-[20px] p-8 relative ${
        active ? 'ring-1 ring-accent/50' : ''
      }`}
    >
      <Quote size={44} className="absolute top-6 right-6 text-accent/20" fill="currentColor" />
      <div className="flex gap-1 text-warning">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={17} fill="currentColor" />
        ))}
      </div>
      <p className="mt-5 text-[15px] text-white/85 leading-relaxed">"{item.quote}"</p>
      <div className="mt-6 flex items-center gap-3.5">
        <span className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary text-white flex items-center justify-center font-heading font-bold text-sm shadow-[0_4px_16px_rgba(241,143,1,0.35)]">
          {initialsLabel}
        </span>
        <div>
          <p className="font-semibold text-sm text-white">{item.name}</p>
          <p className="text-[13px] text-accent font-medium">{item.company}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t } = useLanguage()
  const items = t('testimonials.items')
  return (
    <section className="relative lp-bg-base py-20 sm:py-24 overflow-hidden">
      <div className="absolute -right-32 top-20 w-[420px] h-[420px] lp-aurora-orange anim-float-slow pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="lp-eyebrow justify-center text-[12px] font-bold uppercase tracking-[0.16em]">
            {t('testimonials.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-white">
            {t('testimonials.title')}
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <TestimonialCard item={item} initialsLabel={initials[i]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
