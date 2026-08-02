import React from 'react'
import { Download, CheckCircle2, ShieldCheck, FileCheck2, BadgeCheck } from 'lucide-react'
import Reveal from '../ui/Reveal'

const docs = [
  'Business Registration Certificate',
  'Certificate of Incorporation',
  'VAT Registration Certificate',
  'Tax Clearance Certificate',
  'Audited Financial Statements (3 years)',
  'Bank Reference Letter',
  'Insurance Certificates',
  'Company Profile & Org Chart',
  'Director/Partner ID Copies',
  'Quality Certifications (if any)',
]

export default function Requirements() {
  return (
    <section
      id="requirements"
      className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-20 sm:py-24"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, #fff 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left column */}
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            What You Need to Register
          </h2>
          <p className="mt-4 text-white/60 text-[16px]">
            Prepare these documents before starting your application to keep the
            process fast and smooth.
          </p>

          <ul className="mt-8 space-y-3">
            {docs.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" />
                <span className="text-white/90 text-[15px]">{d}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => window.print()}
            className="mt-9 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[8px] bg-white text-primary font-semibold text-sm hover:bg-primary-light hover:text-white transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download size={18} /> Download Full Checklist
          </button>
        </Reveal>

        {/* Right column - illustration */}
        <Reveal delay={120}>
          <div className="relative">
            <div className="relative rounded-[24px] bg-white/[0.07] border border-white/15 backdrop-blur-md p-10">
              <svg viewBox="0 0 320 260" className="w-full" role="img" aria-label="Document upload illustration">
                <circle cx="160" cy="120" r="96" fill="#F18F01" opacity="0.12" />
                {/* upload box */}
                <g>
                  <rect x="105" y="80" width="110" height="130" rx="14" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
                  <path d="M160 130v50M140 150l20-20 20 20" stroke="#F18F01" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="130" y="104" width="60" height="8" rx="4" fill="#fff" opacity="0.5" />
                </g>
                {/* checklist */}
                <g transform="translate(215,60)">
                  <rect width="56" height="72" rx="8" fill="#fff" />
                  <path d="M14 38l10 10 18-22" stroke="#28A745" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="12" y="18" width="32" height="5" rx="2.5" fill="#DEE2E6" />
                  <rect x="12" y="52" width="32" height="5" rx="2.5" fill="#DEE2E6" />
                </g>
              </svg>
            </div>

            {/* floating checklist card */}
            <div className="absolute -left-4 top-8 anim-float">
              <div className="flex items-center gap-3 bg-white rounded-[12px] shadow-[var(--shadow-card-hover)] px-4 py-3">
                <span className="w-10 h-10 rounded-full bg-success-light text-success flex items-center justify-center">
                  <FileCheck2 size={20} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">Checklist Ready</p>
                  <p className="text-[11px] text-ink-muted">10 documents required</p>
                </div>
              </div>
            </div>

            {/* security badge */}
            <div className="absolute -right-3 bottom-6 anim-float-slow">
              <div className="flex items-center gap-3 bg-white rounded-[12px] shadow-[var(--shadow-card-hover)] px-4 py-3">
                <span className="w-10 h-10 rounded-full bg-info-light text-info flex items-center justify-center">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">SSL Encrypted</p>
                  <p className="text-[11px] text-ink-muted">256-bit security</p>
                </div>
              </div>
            </div>

            {/* badge */}
            <div className="absolute -top-5 right-4">
              <div className="flex items-center gap-2 bg-accent text-white rounded-full px-4 py-2 shadow-[0_4px_12px_rgba(241,143,1,0.4)]">
                <BadgeCheck size={15} /> Verified Documents Only
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
