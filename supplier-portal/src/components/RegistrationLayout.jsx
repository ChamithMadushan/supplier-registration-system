import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import RegistrationSidebar from './RegistrationSidebar'
import ProgressBar from './ui/ProgressBar'
import MobileStepBar from './MobileStepBar'

export default function RegistrationLayout({
  activeStep,
  title,
  subtitle,
  progress,
  crumb = 'Register',
  children,
  breadcrumbExtra,
}) {
  return (
    <div className="min-h-screen bg-surface flex">
      <RegistrationSidebar activeStep={activeStep} />
      <MobileStepBar activeStep={activeStep} />

      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-8 md:py-10 lg:px-14 xl:px-16 max-w-[960px] mx-auto lg:mx-0">
        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-ink-muted mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-secondary transition-colors inline-flex items-center gap-1">
            <Home size={13} /> Home
          </Link>
          <ChevronRight size={13} />
          <Link to="/register/step-1" className="hover:text-secondary transition-colors">
            Register
          </Link>
          <ChevronRight size={13} />
          <span className="text-ink font-medium">{crumb}</span>
          {breadcrumbExtra}
        </nav>

        <header className="anim-fade-up">
          <h1 className="text-[28px] sm:text-[32px] font-bold font-heading text-primary">{title}</h1>
          <p className="text-sm text-ink-muted mt-1">{subtitle}</p>
          <div className="mt-5 max-w-[520px]">
            <ProgressBar value={progress} label="Registration progress" />
          </div>
        </header>

        <div className="mt-8 anim-fade-up" style={{ animationDelay: '0.1s' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
