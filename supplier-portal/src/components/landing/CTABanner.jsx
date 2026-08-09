import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PhoneCall, Check } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

export default function CTABanner() {
  const { t } = useLanguage()
  return (
    <section className="relative overflow-hidden lp-bg-base py-20 sm:py-24">
      {/* Glow card backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 lp-aurora-orange opacity-70 anim-float-slow" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 w-[400px] h-[400px] lp-aurora-violet anim-float pointer-events-none" aria-hidden="true" />
        <div className="absolute -left-24 -bottom-24 w-[380px] h-[380px] lp-aurora-teal anim-float-slow pointer-events-none" aria-hidden="true" />
      </div>

      <div className="relative mx-auto max-w-[980px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="lp-glass relative overflow-hidden rounded-[32px] px-6 py-16 sm:py-20 text-center shadow-[0_32px_100px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" aria-hidden="true" />
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, #fff 1.5px, transparent 1.5px)',
                backgroundSize: '48px 48px',
              }}
            />

            <span className="lp-chip-accent inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[0.16em]">
              {t('cta.chip')}
            </span>
            <h2 className="mt-5 text-3xl sm:text-[42px] font-bold font-heading text-white leading-tight">
              {t('cta.titleBefore')} <span className="lp-gradient-text">{t('cta.titleAccent')}</span> {t('cta.titleAfter')}
            </h2>
            <p className="mt-4 lp-muted text-[16px] sm:text-[17px]">
              {t('cta.para')}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                to="/register/step-1"
                className="lp-btn-accent btn-shimmer group inline-flex items-center gap-2.5 px-9 py-4 rounded-[14px] font-semibold text-[15px]"
              >
                {t('cta.register')} <ArrowRight size={18} className="anim-arrow" />
              </Link>
              <a
                href="#contact"
                className="lp-btn-ghost inline-flex items-center gap-2.5 px-9 py-4 rounded-[14px] font-semibold text-[15px]"
              >
                <PhoneCall size={18} /> {t('cta.talkToUs')}
              </a>
            </div>

            <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-white/70">
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-[#34d399]" /> {t('cta.free')}</span>
              <span className="text-white/30">•</span>
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-[#34d399]" /> {t('cta.noHidden')}</span>
              <span className="text-white/30">•</span>
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-[#34d399]" /> {t('cta.cancel')}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
