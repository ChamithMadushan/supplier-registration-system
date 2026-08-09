import React from 'react'
import { FileText, MailCheck, Search, FileCheck2, Cpu, Users, BellRing, PartyPopper } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

const stepIcons = [FileText, MailCheck, Search, FileCheck2, Cpu, Users, BellRing, PartyPopper]
const colors = ['bg-accent', 'bg-secondary', 'bg-info', 'bg-success', 'bg-warning', 'bg-danger', 'bg-secondary', 'bg-success']
const glows = [
  'rgba(241,143,1,0.4)',
  'rgba(46,134,171,0.4)',
  'rgba(23,162,184,0.4)',
  'rgba(40,167,69,0.4)',
  'rgba(255,193,7,0.4)',
  'rgba(220,53,69,0.4)',
  'rgba(46,134,171,0.4)',
  'rgba(40,167,69,0.4)',
]

export default function Journey() {
  const { t } = useLanguage()
  const journey = t('journey.steps')
  return (
    <section className="relative lp-bg-alt py-20 sm:py-24 overflow-hidden">
      <div className="absolute -left-32 bottom-0 w-[420px] h-[420px] lp-aurora-violet anim-float-slow pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="lp-eyebrow justify-center text-[12px] font-bold uppercase tracking-[0.16em]">
            {t('journey.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-white">
            {t('journey.title')}
          </h2>
          <p className="mt-3 text-[16px] lp-muted">
            {t('journey.sub')}
          </p>
        </Reveal>

        <div className="relative mt-16 mx-auto max-w-3xl">
          {/* center line */}
          <div className="absolute left-[22px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-secondary to-success rounded-full anim-draw-y" />

          <div className="space-y-10">
            {journey.map((j, i) => {
              const left = i % 2 === 0
              return (
                <Reveal key={j.day} delay={i * 60}>
                  <div className={`relative flex items-center ${left ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-6 sm:gap-0`}>
                    {/* node */}
                    <div className={`absolute left-[22px] sm:left-1/2 -translate-x-1/2 z-10`}>
                      <span
                        className={`relative w-11 h-11 rounded-full ${colors[i]} text-white flex items-center justify-center`}
                        style={{ boxShadow: `0 0 24px ${glows[i]}` }}
                      >
                        <span className="absolute inset-0 rounded-full bg-white/40 anim-pulse-ring" aria-hidden="true" />
                        {(() => { const Icon = stepIcons[i]; return <Icon size={20} className="relative" /> })()}
                      </span>
                    </div>
                    <div className={`w-full sm:w-1/2 ${left ? 'sm:pr-14' : 'sm:pl-14'}`}>
                      <div className={`ml-16 sm:ml-0 ${left ? '' : 'sm:text-right'}`}>
                        <span className="lp-chip-accent inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          {j.day}
                        </span>
                        <h3 className="mt-2 font-semibold text-[16px] text-white">{j.title}</h3>
                        <p className="mt-1 text-[13px] lp-muted">
                          {left ? t('journey.left') : t('journey.right')}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
