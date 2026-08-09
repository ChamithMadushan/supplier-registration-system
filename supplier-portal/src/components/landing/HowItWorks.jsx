import React from 'react'
import { Link } from 'react-router-dom'
import {
  UserPlus, Building2, Package, Wallet, FileUp, BadgeCheck, ArrowRight,
} from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

const stepIcons = [UserPlus, Building2, Package, Wallet, FileUp, BadgeCheck]

export default function HowItWorks() {
  const { t } = useLanguage()
  const steps = t('how.steps')
  return (
    <section id="how-it-works" className="lp-bg-base py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="lp-eyebrow justify-center text-[12px] font-bold uppercase tracking-[0.16em]">
            {t('how.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-white">
            {t('how.title')}
          </h2>
          <p className="mt-3 text-[16px] lp-muted">
            {t('how.sub')}
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* connector line - desktop */}
          <div className="hidden lg:block absolute top-[54px] left-[8%] right-[8%] border-t border-dashed border-white/10 anim-draw-x" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="relative">
                <div className="lp-glass lp-glass-hover group relative flex flex-col items-center text-center px-4 pt-8 pb-6 rounded-[20px] h-full">
                  {/* number badge */}
                  <div className="lp-btn-accent relative z-10 w-[54px] h-[54px] rounded-2xl text-white flex items-center justify-center mb-4">
                    <span className="absolute inset-0 rounded-2xl bg-accent/40 anim-pulse-ring" aria-hidden="true" />
                    <span className="text-lg font-bold font-heading relative">{i + 1}</span>
                  </div>
                  <span className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 group-hover:border-accent/40 transition-all duration-200">
                    {(() => { const Icon = stepIcons[i]; return <Icon size={22} /> })()}
                  </span>
                  <h3 className="font-semibold text-[15px] text-white">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] lp-muted leading-relaxed">{s.desc}</p>
                </div>
                {/* mobile connector */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden w-[2px] h-5 mx-auto border-l border-dashed border-white/10" />
                )}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="text-center mt-12" delay={200}>
          <Link
            to="/register/step-1"
            className="lp-btn-accent btn-shimmer group inline-flex items-center gap-2.5 px-8 py-4 rounded-[12px] font-semibold text-[15px]"
          >
            {t('how.cta')} <ArrowRight size={18} className="anim-arrow" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
