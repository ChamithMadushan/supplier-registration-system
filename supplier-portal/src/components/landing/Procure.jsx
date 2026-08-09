import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

const counts = [45, 38, 52, 28, 35, 41, 29, 18, 33, 22, 19, 15]

export default function Procure() {
  const { t } = useLanguage()
  const categories = t('procure.items')
  return (
    <section id="categories" className="relative lp-bg-alt py-20 sm:py-24 overflow-hidden">
      <div className="absolute -top-40 right-[-160px] w-[460px] h-[460px] lp-aurora-teal anim-float-slow pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="lp-eyebrow justify-center text-[12px] font-bold uppercase tracking-[0.16em]">
            {t('procure.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-white">{t('procure.title')}</h2>
          <p className="mt-3 text-[16px] lp-muted">
            {t('procure.sub')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 70}>
              <Link
                to="/register/step-1"
                className="lp-glass lp-glass-hover group block h-full rounded-[20px] p-6"
              >
                <span className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-accent/10 group-hover:border-accent/40 flex items-center justify-center text-[28px] transition-colors">
                  <span aria-hidden>{c.emoji}</span>
                </span>
                <h3 className="mt-4 font-semibold text-[16px] text-white group-hover:text-[#ffc66e] transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1 text-[13px] lp-muted">{c.subs}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {counts[i]} {t('procure.suppliers')}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
