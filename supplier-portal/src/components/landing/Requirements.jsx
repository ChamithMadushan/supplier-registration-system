import React, { useState } from 'react'
import { Download, CheckCircle2, ShieldCheck, FileCheck2, BadgeCheck } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'
import { downloadChecklistPdf } from '../../utils/checklistPdf'

export default function Requirements() {
  const { t, lang } = useLanguage()
  const [generating, setGenerating] = useState(false)
  const docs = t('req.docs')

  const handleDownload = async () => {
    if (generating) return
    setGenerating(true)
    try {
      await downloadChecklistPdf({ t, lang })
    } finally {
      setGenerating(false)
    }
  }
  return (
    <section
      id="requirements"
      className="relative overflow-hidden lp-bg-base py-20 sm:py-24"
    >
      {/* Aurora + grid background */}
      <div className="absolute -left-32 top-10 w-[460px] h-[460px] lp-aurora-teal anim-float-slow pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-24 -bottom-24 w-[420px] h-[420px] lp-aurora-orange anim-float pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 lp-grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left column */}
        <Reveal>
          <span className="lp-eyebrow text-[12px] font-bold uppercase tracking-[0.16em]">
            {t('req.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-white">
            {t('req.titleBefore')} <span className="lp-gradient-text">{t('req.titleAccent')}</span>
          </h2>
          <p className="mt-4 lp-muted text-[16px]">
            {t('req.para')}
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {docs.map((d) => (
              <li key={d} className="lp-glass flex items-start gap-3 rounded-[12px] px-4 py-3">
                <CheckCircle2 size={19} className="text-[#34d399] shrink-0 mt-0.5" />
                <span className="text-white/85 text-[14px]">{d}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleDownload}
            disabled={generating}
            className="lp-btn-ghost mt-9 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[12px] font-semibold text-sm disabled:opacity-60 disabled:cursor-wait"
          >
            <Download size={18} /> {generating ? t('req.downloading') : t('req.download')}
          </button>
        </Reveal>

        {/* Right column - illustration */}
        <Reveal delay={120}>
          <div className="relative">
            <div className="absolute -inset-8 rounded-[40px] lp-aurora-orange opacity-60 pointer-events-none" aria-hidden="true" />

            <div className="lp-glass relative rounded-[28px] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
              <svg viewBox="0 0 320 260" className="w-full" role="img" aria-label="Document upload illustration">
                <circle cx="160" cy="120" r="96" fill="#F18F01" opacity="0.14" />
                {/* upload box */}
                <g>
                  <rect x="105" y="80" width="110" height="130" rx="14" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
                  <path d="M160 130v50M140 150l20-20 20 20" stroke="#F18F01" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="130" y="104" width="60" height="8" rx="4" fill="#fff" opacity="0.5" />
                </g>
                {/* checklist */}
                <g transform="translate(215,60)">
                  <rect width="56" height="72" rx="8" fill="#fff" />
                  <path d="M14 38l10 10 18-22" stroke="#34d399" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="12" y="18" width="32" height="5" rx="2.5" fill="#DEE2E6" />
                  <rect x="12" y="52" width="32" height="5" rx="2.5" fill="#DEE2E6" />
                </g>
              </svg>
            </div>

            {/* floating checklist card */}
            <div className="absolute -left-4 top-8 anim-float">
              <div className="lp-glass flex items-center gap-3 rounded-[14px] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <span className="w-10 h-10 rounded-full bg-[#34d399]/15 text-[#34d399] flex items-center justify-center">
                  <FileCheck2 size={20} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t('req.checklistReady')}</p>
                  <p className="text-[11px] lp-faint">{t('req.docsCount')}</p>
                </div>
              </div>
            </div>

            {/* security badge */}
            <div className="absolute -right-3 bottom-6 anim-float-slow">
              <div className="lp-glass flex items-center gap-3 rounded-[14px] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <span className="w-10 h-10 rounded-full bg-[#2E86AB]/20 text-[#7fc7e0] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t('req.sslEncrypted')}</p>
                  <p className="text-[11px] lp-faint">{t('req.security')}</p>
                </div>
              </div>
            </div>

            {/* badge */}
            <div className="absolute -top-5 right-4">
              <div className="lp-btn-accent flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                <BadgeCheck size={15} /> {t('req.verifiedOnly')}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
