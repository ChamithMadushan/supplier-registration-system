import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, CheckCircle2, TrendingUp, Clock, ShieldCheck, ChevronDown, Star } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const features = t('hero.features')

  return (
    <section
      id="home"
      className="relative overflow-hidden lp-bg-base"
    >
      {/* Aurora glows */}
      <div className="absolute -top-40 -left-32 w-[560px] h-[560px] lp-aurora-orange anim-float-slow pointer-events-none" aria-hidden="true" />
      <div className="absolute top-20 right-[-140px] w-[520px] h-[520px] lp-aurora-teal anim-float pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-180px] left-1/3 w-[480px] h-[480px] lp-aurora-violet anim-float-slow pointer-events-none" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="absolute inset-0 lp-grid-bg lp-grid-fade pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-14 items-center min-h-[92vh]">
        {/* Left content */}
        <div className="text-center lg:text-left">
          <span
            className="anim-fade-up lp-chip-accent inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium backdrop-blur"
            style={{ animationDelay: '0.05s' }}
          >
            <span aria-hidden>🇱🇰</span> {t('hero.badge')}
          </span>

          <h1
            className="anim-fade-up mt-6 text-4xl sm:text-5xl xl:text-[56px] font-bold text-white leading-[1.1]"
            style={{ animationDelay: '0.15s' }}
          >
            {t('hero.titleBefore')}{' '}
            <span className="relative inline-block lp-gradient-text">
              {t('hero.titleAccent')}
              <span className="absolute left-0 -bottom-1 w-full h-[6px] bg-gradient-to-r from-accent to-transparent rounded-full" />
            </span>{' '}
            {t('hero.titleAfter')}
          </h1>

          <p
            className="anim-fade-up mt-6 text-[16px] lg:text-[17px] lp-muted max-w-[540px] mx-auto lg:mx-0 leading-relaxed"
            style={{ animationDelay: '0.25s' }}
          >
            {t('hero.paraBefore')} <strong className="text-white font-semibold">{t('hero.paraStrong')}</strong>{' '}
            {t('hero.paraAfter')}
          </p>

          {/* Feature pills */}
          <div
            className="anim-fade-up mt-7 flex flex-wrap justify-center lg:justify-start gap-2.5"
            style={{ animationDelay: '0.35s' }}
          >
            {features.map((f) => (
              <span
                key={f}
                className="lp-chip inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium"
              >
                <CheckCircle2 size={14} className="text-accent" /> {f}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="anim-fade-up mt-9 flex flex-wrap justify-center lg:justify-start gap-4"
            style={{ animationDelay: '0.45s' }}
          >
            <Link
              to="/register/step-1"
              className="lp-btn-accent group inline-flex items-center gap-2.5 px-8 py-4 rounded-[12px] font-semibold text-[15px]"
            >
              {t('hero.startRegistration')} <ArrowRight size={18} className="anim-arrow" />
            </Link>
            <a
              href="#requirements"
              className="lp-btn-ghost inline-flex items-center gap-2.5 px-8 py-4 rounded-[12px] font-semibold text-[15px]"
            >
              <ClipboardList size={18} /> {t('hero.viewRequirements')}
            </a>
          </div>

          <p
            className="anim-fade-up mt-6 inline-flex items-center gap-2 text-[13px] lp-faint"
            style={{ animationDelay: '0.55s' }}
          >
            <ShieldCheck size={15} className="text-[#34d399]" /> {t('hero.dataSafe')}
          </p>
        </div>

        {/* Right illustration */}
        <div className="relative hidden lg:block anim-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative mx-auto max-w-[480px]">
            {/* pulsing halo ring */}
            <div className="absolute -inset-6 rounded-[40px] border border-accent/25 anim-pulse-ring pointer-events-none" aria-hidden="true" />
            <div className="absolute -inset-10 rounded-full lp-aurora-orange opacity-70 pointer-events-none" aria-hidden="true" />

            {/* Main illustration card - glass */}
            <div className="lp-glass relative rounded-[28px] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
              <svg viewBox="0 0 320 260" className="w-full" role="img" aria-label="Business partnership illustration">
                {/* background glow */}
                <circle cx="160" cy="130" r="100" fill="#F18F01" opacity="0.16" />
                {/* People shapes */}
                <g>
                  {/* left person */}
                  <circle cx="118" cy="78" r="22" fill="#F18F01" />
                  <rect x="96" y="108" width="44" height="70" rx="16" fill="#2E86AB" />
                  {/* right person */}
                  <circle cx="202" cy="78" r="22" fill="#FFC107" />
                  <rect x="180" y="108" width="44" height="70" rx="16" fill="#2E86AB" />
                  {/* handshake */}
                  <g transform="translate(152,118)">
                    <circle cx="8" cy="0" r="16" fill="#F18F01" opacity="0.85" />
                    <circle cx="-8" cy="0" r="16" fill="#FFC107" opacity="0.85" />
                    <rect x="-22" y="10" width="44" height="14" rx="7" fill="#fff" opacity="0.9" />
                  </g>
                </g>
                {/* document with check */}
                <g transform="translate(140,178)">
                  <rect width="40" height="52" rx="6" fill="#fff" />
                  <path d="M12 22l6 6 10-12" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="10" y="8" width="20" height="4" rx="2" fill="#DEE2E6" />
                </g>
              </svg>
            </div>

            {/* Floating card 1 */}
            <div className="absolute -left-8 top-6 anim-float">
              <div className="lp-glass flex items-center gap-2.5 rounded-[14px] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <span className="w-9 h-9 rounded-full bg-[#34d399]/15 text-[#34d399] flex items-center justify-center">
                  <CheckCircle2 size={19} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t('hero.appApproved')}</p>
                  <p className="text-[11px] lp-faint">{t('hero.daysAgo')}</p>
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div className="absolute -right-6 top-1/4 anim-float-slow">
              <div className="lp-glass flex items-center gap-2.5 rounded-[14px] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <span className="w-9 h-9 rounded-full bg-[#2E86AB]/20 text-[#7fc7e0] flex items-center justify-center">
                  <TrendingUp size={19} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t('hero.score')}</p>
                  <p className="text-[11px] lp-faint">{t('hero.excellent')}</p>
                </div>
              </div>
            </div>

            {/* Floating card 3 */}
            <div className="absolute -bottom-5 right-8 anim-float" style={{ animationDelay: '1.2s' }}>
              <div className="lp-glass flex items-center gap-2.5 rounded-[14px] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <span className="w-9 h-9 rounded-full bg-[#ffb44d]/15 text-[#ffc66e] flex items-center justify-center">
                  <Clock size={19} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t('hero.avgProcessing')}</p>
                  <p className="text-[11px] lp-faint">{t('hero.fastest')}</p>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <div className="absolute -top-5 right-2">
              <div className="lp-btn-accent flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold">
                <Star size={14} fill="currentColor" /> {t('hero.supplierRating')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 lp-faint hover:text-white transition-colors"
        aria-label={t('hero.scrollStats')}
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">{t('hero.scroll')}</span>
        <ChevronDown size={20} className="anim-bounce-down" />
      </a>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0a1220] pointer-events-none" aria-hidden="true" />
    </section>
  )
}
