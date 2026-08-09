import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

export default function FAQ() {
  const { t } = useLanguage()
  const faqs = t('faq.items')
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section id="faq" className="lp-bg-alt py-20 sm:py-24">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="lp-eyebrow justify-center text-[12px] font-bold uppercase tracking-[0.16em]">
            {t('faq.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-white">
            {t('faq.title')}
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const open = openIdx === i
            return (
              <Reveal key={f.q} delay={Math.min(i * 40, 300)}>
                <div className="lp-glass rounded-[16px] overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 sm:px-6 py-4.5 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setOpenIdx(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        open ? 'lp-btn-accent text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {open ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                    <span className={`font-semibold text-[15px] flex-1 ${open ? 'text-[#ffc66e]' : 'text-white'}`}>
                      {f.q}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                    style={{ maxHeight: open ? 600 : 0 }}
                  >
                    <p className="px-5 sm:px-6 pb-5 pl-[60px] sm:pl-[68px] text-[14px] lp-muted leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                  <div className="mx-5 sm:mx-6 border-t border-white/5" />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
