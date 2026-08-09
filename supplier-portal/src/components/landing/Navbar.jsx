import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, HelpCircle, ArrowRight, Globe } from 'lucide-react'
import Logo from '../ui/Logo'
import { useLanguage } from '../../i18n/LanguageContext'

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සි' },
  { code: 'ta', label: 'த' },
]

export default function Navbar() {
  const { t, lang, setLang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { key: 'home', href: '#home' },
    { key: 'howItWorks', href: '#how-it-works' },
    { key: 'requirements', href: '#requirements' },
    { key: 'categories', href: '#categories' },
    { key: 'contact', href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#060a13]/85 border-b border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
          : 'bg-[#060a13]/40 border-b border-white/5'
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Logo dark size="sm" brand="VENDIORA" />

        {/* Center links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-[8px] hover:bg-white/10 transition-colors"
            >
              {t(`nav.${l.key}`)}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {/* Language toggle */}
          <div
            className="hidden md:flex items-center rounded-full border border-white/10 bg-white/5 p-0.5"
            role="group"
            aria-label={t('nav.language')}
          >
            <Globe size={14} className="ml-2.5 text-white/50" />
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  lang === l.code ? 'lp-btn-accent' : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Help */}
          <a
            href="#contact"
            aria-label={t('nav.help')}
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-white/60 hover:text-accent hover:bg-white/10 transition-colors"
            title={t('nav.help')}
          >
            <HelpCircle size={19} />
          </a>

          <Link
            to="/register/step-1"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] border border-white/15 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
          >
            {t('nav.login')}
          </Link>
          <Link
            to="/register/step-1"
            className="lp-btn-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-white text-sm font-semibold"
          >
            {t('nav.registerNow')} <ArrowRight size={16} />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[8px] text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#070c16]/95 backdrop-blur-xl anim-fade-in">
          <nav className="px-4 py-4 flex flex-col gap-1" aria-label={t('nav.mobileNav')}>
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-[8px] text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {t(`nav.${l.key}`)}
              </a>
            ))}
            <div className="flex items-center gap-2 px-4 py-3" role="group" aria-label={t('nav.language')}>
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    lang === l.code
                      ? 'lp-btn-accent border-transparent'
                      : 'text-white/60 border-white/15'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link
              to="/register/step-1"
              className="lp-btn-accent mt-2 px-5 py-3 rounded-[8px] text-white text-center text-sm font-semibold"
            >
              {t('nav.registerNow')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
