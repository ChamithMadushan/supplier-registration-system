import React from 'react'
import { Link } from 'react-router-dom'
import {
  UserPlus, Building2, Package, Wallet, FileUp, BadgeCheck, ArrowRight,
} from 'lucide-react'
import Reveal from '../ui/Reveal'

const steps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Register your email and create secure login' },
  { icon: Building2, title: 'Company Info', desc: 'Fill your company details and address' },
  { icon: Package, title: 'Business Details', desc: 'Select supply categories and capabilities' },
  { icon: Wallet, title: 'Financial Info', desc: 'Provide financial and bank information' },
  { icon: FileUp, title: 'Upload Documents', desc: 'Upload all required certificates and documents' },
  { icon: BadgeCheck, title: 'Get Approved', desc: 'Our team reviews and notifies you in 15 days' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Simple Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-ink">
            How Registration Works
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted">
            Simple 6-step process to get approved
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* connector line - desktop */}
          <div className="hidden lg:block absolute top-[54px] left-[8%] right-[8%] border-t-2 border-dashed border-line" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="relative">
                <div className="group relative flex flex-col items-center text-center px-4 pt-0 pb-6">
                  {/* number circle */}
                  <div className="relative z-10 w-[54px] h-[54px] rounded-full bg-accent text-white flex items-center justify-center shadow-[0_4px_12px_rgba(241,143,1,0.35)] mb-5">
                    <span className="text-lg font-bold font-heading">{i + 1}</span>
                  </div>
                  <span className="w-12 h-12 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center text-accent mb-4 -mt-1 group-hover:scale-110 transition-transform duration-200">
                    <s.icon size={22} />
                  </span>
                  <h3 className="font-semibold text-[15px] text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{s.desc}</p>
                </div>
                {/* mobile connector */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden w-[2px] h-5 bg-dashed mx-auto border-l-2 border-dashed border-line" />
                )}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="text-center mt-12" delay={200}>
          <Link
            to="/register/step-1"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[8px] bg-accent text-white font-semibold text-[15px] shadow-[0_4px_12px_rgba(241,143,1,0.3)] hover:bg-accent-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            Start Your Registration <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
