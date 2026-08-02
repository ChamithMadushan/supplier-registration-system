import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, HelpCircle, ArrowRight, Globe } from 'lucide-react'
import Logo from '../ui/Logo'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Requirements', href: '#requirements' },
  { label: 'Categories', href: '#categories' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState('EN')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const langs = ['EN', 'සි', 'த']

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[var(--shadow-nav)]' : 'border-b border-line-soft'
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Logo size="sm" />

        {/* Center links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-ink hover:text-accent rounded-[8px] hover:bg-surface transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {/* Language toggle */}
          <div
            className="hidden md:flex items-center rounded-full border border-line bg-surface p-0.5"
            role="group"
            aria-label="Language selector"
          >
            <Globe size={14} className="ml-2.5 text-ink-muted" />
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  lang === l ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Help */}
          <a
            href="#contact"
            aria-label="Help"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-ink-muted hover:text-accent hover:bg-surface transition-colors"
            title="Get help"
          >
            <HelpCircle size={19} />
          </a>

          <Link
            to="/register/step-1"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register/step-1"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-accent text-white text-sm font-semibold shadow-[0_4px_12px_rgba(241,143,1,0.3)] hover:bg-accent-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            Register Now <ArrowRight size={16} />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[8px] text-ink hover:bg-surface transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-line-soft bg-white anim-fade-in">
          <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-[8px] text-sm font-medium text-ink hover:bg-surface hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-2 px-4 py-3">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    lang === l
                      ? 'bg-primary text-white border-primary'
                      : 'text-ink-muted border-line'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              to="/register/step-1"
              className="mt-2 px-5 py-3 rounded-[8px] bg-accent text-white text-center text-sm font-semibold"
            >
              Register Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
