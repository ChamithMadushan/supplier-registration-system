import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, CheckCircle2, TrendingUp, Clock, ShieldCheck, ChevronDown, Star } from 'lucide-react'

const features = ['Free Registration', 'Quick Process', 'Fair Evaluation', 'Secure Platform']

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary-dark"
    >
      {/* geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 75% 75%, #fff 1.5px, transparent 1.5px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(115deg, transparent 45%, rgba(255,255,255,0.5) 45.5%, transparent 46%), linear-gradient(115deg, transparent 55%, rgba(255,255,255,0.4) 55.5%, transparent 56%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-16 pb-28 lg:pt-24 lg:pb-36 grid lg:grid-cols-2 gap-12 items-center min-h-[92vh]">
        {/* Left content */}
        <div className="anim-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-[13px] font-medium backdrop-blur">
            <span aria-hidden>🇱🇰</span> Sri Lanka's Trusted Procurement Platform
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl xl:text-[56px] font-bold text-white leading-[1.1]">
            Register as an Approved{' '}
            <span className="relative inline-block text-accent">
              Supplier
              <span className="absolute left-0 -bottom-1 w-full h-[6px] bg-accent/70 rounded-full" />
            </span>{' '}
            Today
          </h1>

          <p className="mt-6 text-[16px] lg:text-[17px] text-white/75 max-w-[540px] mx-auto lg:mx-0 leading-relaxed">
            Join our network of <strong className="text-white font-semibold">400+ verified suppliers</strong> and grow
            your business with <strong className="text-white font-semibold">[Company Name]</strong>.
          </p>

          {/* Feature pills */}
          <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2.5">
            {features.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-[13px] font-medium"
              >
                <CheckCircle2 size={14} className="text-accent" /> {f}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link
              to="/register/step-1"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[8px] bg-accent text-white font-semibold text-[15px] shadow-[0_4px_12px_rgba(241,143,1,0.3)] hover:bg-accent-hover transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Registration <ArrowRight size={18} />
            </Link>
            <a
              href="#requirements"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[8px] bg-white/95 text-primary font-semibold text-[15px] hover:bg-white transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
            >
              <ClipboardList size={18} /> View Requirements
            </a>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-[13px] text-white/60">
            <ShieldCheck size={15} className="text-success" /> Your data is safe and confidential
          </p>
        </div>

        {/* Right illustration */}
        <div className="relative hidden lg:block anim-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative mx-auto max-w-[480px]">
            {/* Main illustration card - handshake visual */}
            <div className="relative rounded-[24px] bg-white/[0.07] border border-white/15 backdrop-blur-md p-10">
              <svg viewBox="0 0 320 260" className="w-full" role="img" aria-label="Business partnership illustration">
                {/* background glow */}
                <circle cx="160" cy="130" r="100" fill="#F18F01" opacity="0.12" />
                {/* People shapes */}
                <g>
                  {/* left person */}
                  <circle cx="118" cy="78" r="22" fill="#F18F01" />
                  <rect x="96" y="108" width="44" height="70" rx="16" fill="#2E86AB" />
                  {/* right person */}
                  <circle cx="202" cy="78" r="22" fill="#FFC107" />
                  <rect x="180" y="108" width="44" height="70" rx="16" fill="#2E86AB" />
                  {/* handshake */}
                  <g transform="translate(152,118)">
                    <circle cx="8" cy="0" r="16" fill="#F18F01" opacity="0.85" />
                    <circle cx="-8" cy="0" r="16" fill="#FFC107" opacity="0.85" />
                    <rect x="-22" y="10" width="44" height="14" rx="7" fill="#fff" opacity="0.9" />
                  </g>
                </g>
                {/* document with check */}
                <g transform="translate(140,178)">
                  <rect width="40" height="52" rx="6" fill="#fff" />
                  <path d="M12 22l6 6 10-12" stroke="#28A745" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="10" y="8" width="20" height="4" rx="2" fill="#DEE2E6" />
                </g>
              </svg>
            </div>

            {/* Floating card 1 */}
            <div className="absolute -left-8 top-6 anim-float">
              <div className="flex items-center gap-2.5 bg-white rounded-[12px] shadow-[var(--shadow-card-hover)] px-4 py-3">
                <span className="w-9 h-9 rounded-full bg-success-light text-success flex items-center justify-center">
                  <CheckCircle2 size={19} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">Application Approved!</p>
                  <p className="text-[11px] text-ink-muted">2 days ago</p>
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div className="absolute -right-6 top-1/4 anim-float-slow">
              <div className="flex items-center gap-2.5 bg-white rounded-[12px] shadow-[var(--shadow-card-hover)] px-4 py-3">
                <span className="w-9 h-9 rounded-full bg-info-light text-info flex items-center justify-center">
                  <TrendingUp size={19} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">Score: 85/100</p>
                  <p className="text-[11px] text-ink-muted">Excellent rating</p>
                </div>
              </div>
            </div>

            {/* Floating card 3 */}
            <div className="absolute -bottom-5 right-8 anim-float" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2.5 bg-white rounded-[12px] shadow-[var(--shadow-card-hover)] px-4 py-3">
                <span className="w-9 h-9 rounded-full bg-warning-light text-warning-dark flex items-center justify-center">
                  <Clock size={19} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">15 days avg processing</p>
                  <p className="text-[11px] text-ink-muted">Fastest in Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <div className="absolute -top-4 right-2">
              <div className="flex items-center gap-1.5 bg-accent text-white rounded-full px-4 py-2 shadow-[0_4px_12px_rgba(241,143,1,0.4)]">
                <Star size={14} fill="currentColor" /> 4.8 / 5 Supplier Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors"
        aria-label="Scroll to statistics"
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown size={20} className="anim-bounce-down" />
      </a>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 90" className="w-full h-[60px] sm:h-[80px]" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,100 480,10 720,40 C960,70 1200,30 1440,60 L1440,90 L0,90 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  )
}
