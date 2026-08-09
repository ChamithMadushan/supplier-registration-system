import React, { createContext, useContext, useEffect, useState } from 'react'
import { X, ShieldCheck, ChevronRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../../i18n/LanguageContext'

const PrivacyContext = createContext({ openPrivacyPolicy: () => {} })

export function usePrivacyPolicy() {
  return useContext(PrivacyContext)
}

function PrivacyPolicyModal({ open, onClose }) {
  const { t } = useLanguage()
  const sections = t('privacy.sections')

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[4px]"
      onMouseDown={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={t('privacy.title')}
    >
      <div
        className="lp-glass bg-[#0b1322] w-full max-w-[680px] rounded-[20px] shadow-[0_32px_120px_rgba(0,0,0,0.7)] anim-modal-in flex flex-col max-h-[88vh] border border-white/10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 border border-accent/30 text-accent flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h3 className="text-[20px] font-bold font-heading text-white">{t('privacy.title')}</h3>
              <p className="text-sm lp-muted mt-0.5">{t('privacy.lastUpdated')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('floating.close')}
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center lp-faint hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6">
          <p className="text-[14px] lp-muted leading-relaxed">
            {t('privacy.intro')}
          </p>
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="flex items-center gap-2 text-[15px] font-semibold text-white">
                <ChevronRight size={16} className="text-accent shrink-0" />
                {s.title}
              </h4>
              <p className="mt-2 text-[13.5px] lp-muted leading-relaxed pl-6">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="lp-btn-ghost px-6 py-2.5 rounded-[10px] text-sm font-semibold"
          >
            {t('privacy.close')}
          </button>
          <button
            onClick={onClose}
            className="lp-btn-accent btn-shimmer px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white"
          >
            {t('privacy.iUnderstand')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function PrivacyPolicyProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openPrivacyPolicy = () => setOpen(true)
  return (
    <PrivacyContext.Provider value={{ openPrivacyPolicy }}>
      {children}
      <PrivacyPolicyModal open={open} onClose={() => setOpen(false)} />
    </PrivacyContext.Provider>
  )
}

export default PrivacyPolicyProvider
