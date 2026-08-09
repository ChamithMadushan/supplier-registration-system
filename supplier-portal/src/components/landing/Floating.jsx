import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Cookie, X } from 'lucide-react'
import { usePrivacyPolicy } from './PrivacyPolicy'
import { useLanguage } from '../../i18n/LanguageContext'

export function WhatsAppButton() {
  const { t } = useLanguage()
  return (
    <a
      href="#"
      aria-label={t('floating.whatsapp')}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:scale-110 transition-transform"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.56 2 2.12 6.44 2.12 11.92c0 1.75.46 3.45 1.33 4.95L2 22l5.24-1.37a9.87 9.87 0 0 0 4.8 1.22h.01c5.47 0 9.91-4.44 9.91-9.92A9.87 9.87 0 0 0 12.04 2Zm0 18.14h-.01c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.11.81.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.19 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
      </svg>
    </a>
  )
}

export function BackToTop() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('floating.backToTop')}
      className={`fixed bottom-6 right-24 z-40 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-[0_4px_12px_rgba(241,143,1,0.4)] hover:bg-accent-hover transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp size={22} />
    </button>
  )
}

export function CookieConsent() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const { openPrivacyPolicy } = usePrivacyPolicy()
  useEffect(() => {
    if (!localStorage.getItem('cookie-accepted')) {
      const timeout = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timeout)
    }
  }, [])
  const choose = (val) => {
    localStorage.setItem('cookie-accepted', val)
    setAccepted(true)
    setVisible(false)
  }
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-500 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-primary-dark/95 backdrop-blur text-white border-t border-white/10 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Cookie size={18} />
          </span>
          <p className="text-[13px] text-white/80 leading-relaxed">
            {t('floating.cookie')}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={openPrivacyPolicy}
            className="px-3 py-2 rounded-[8px] text-[13px] font-medium text-white/60 hover:text-white underline decoration-dotted underline-offset-4 transition-colors"
          >
            {t('privacy.title')}
          </button>
          <button
            onClick={() => choose('declined')}
            className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            {t('floating.decline')}
          </button>
          <button
            onClick={() => choose('accepted')}
            className="px-5 py-2 rounded-[8px] bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors"
          >
            {t('floating.accept')}
          </button>
        </div>
        {accepted && (
          <button
            aria-label={t('floating.close')}
            className="absolute top-3 right-3 text-white/50 hover:text-white"
            onClick={() => setVisible(false)}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export function MobileCTABar() {
  const { t } = useLanguage()
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 lp-glass bg-[#060a13]/85 border-t border-white/10 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] p-3 flex gap-3">
      <Link
        to="/register/step-1"
        className="flex-1 px-5 py-3 rounded-[10px] text-center text-sm font-semibold border border-white/15 text-white"
      >
        {t('nav.login')}
      </Link>
      <Link
        to="/register/step-1"
        className="lp-btn-accent flex-[1.4] px-5 py-3 rounded-[10px] text-center text-sm font-semibold text-white"
      >
        {t('nav.registerNow')}
      </Link>
    </div>
  )
}
