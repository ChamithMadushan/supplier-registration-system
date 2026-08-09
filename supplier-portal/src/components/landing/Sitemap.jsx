import React, { createContext, useContext, useEffect, useState } from 'react'
import { X, Network, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { usePrivacyPolicy } from './PrivacyPolicy'
import { useTerms } from './TermsOfService'
import { useLanguage } from '../../i18n/LanguageContext'

const SitemapContext = createContext({ openSitemap: () => {} })

export function useSitemap() {
  return useContext(SitemapContext)
}

function SitemapModal({ open, onClose }) {
  const { t } = useLanguage()
  const groups = t('sitemap.groups')
  const { openPrivacyPolicy } = usePrivacyPolicy()
  const { openTerms } = useTerms()

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

  const renderLink = (l, i) => {
    const cls =
      'group/link w-full flex items-center gap-2 px-4 py-3 rounded-[10px] text-left text-[14px] lp-muted hover:text-white hover:bg-white/5 transition-colors'
    if (l.to) {
      return (
        <li key={i}>
          <Link to={l.to} onClick={onClose} className={cls}>
            <ChevronRight size={14} className="text-accent shrink-0" />
            {l.label}
            <ArrowUpRight size={13} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </Link>
        </li>
      )
    }
    return (
      <li key={i}>
        <a href={l.href} onClick={onClose} className={cls}>
          <ChevronRight size={14} className="text-accent shrink-0" />
          {l.label}
          <ArrowUpRight size={13} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
        </a>
      </li>
    )
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[4px]"
      onMouseDown={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={t('sitemap.title')}
    >
      <div
        className="lp-glass bg-[#0b1322] w-full max-w-[680px] rounded-[20px] shadow-[0_32px_120px_rgba(0,0,0,0.7)] anim-modal-in flex flex-col max-h-[88vh] border border-white/10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 border border-accent/30 text-accent flex items-center justify-center shrink-0">
              <Network size={22} />
            </span>
            <div>
              <h3 className="text-[20px] font-bold font-heading text-white">{t('sitemap.title')}</h3>
              <p className="text-sm lp-muted mt-0.5">{t('sitemap.subtitle')}</p>
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
        <div className="px-6 sm:px-8 py-6 overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {groups.map((g) => (
              <div key={g.title}>
                <h4 className="text-[12px] font-bold uppercase tracking-[0.18em] text-accent mb-3">{g.title}</h4>
                <ul className="space-y-1">
                  {g.links.map((l, i) => renderLink(l, i))}
                </ul>
              </div>
            ))}

            {/* Legal */}
            <div>
              <h4 className="text-[12px] font-bold uppercase tracking-[0.18em] text-accent mb-3">{t('sitemap.legalTitle')}</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      onClose()
                      openPrivacyPolicy()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-[10px] text-left text-[14px] lp-muted hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight size={14} className="text-accent shrink-0" />
                    {t('sitemap.privacy')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onClose()
                      openTerms()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-[10px] text-left text-[14px] lp-muted hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight size={14} className="text-accent shrink-0" />
                    {t('sitemap.terms')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button onClick={onClose} className="lp-btn-accent btn-shimmer px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white">
            {t('sitemap.close')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function SitemapProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openSitemap = () => setOpen(true)
  return (
    <SitemapContext.Provider value={{ openSitemap }}>
      {children}
      <SitemapModal open={open} onClose={() => setOpen(false)} />
    </SitemapContext.Provider>
  )
}

export default SitemapProvider
