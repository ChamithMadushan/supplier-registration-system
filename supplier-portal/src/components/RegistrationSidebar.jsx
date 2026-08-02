import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlus,
  Building2,
  Package,
  Wallet,
  FileUp,
  ClipboardCheck,
  Check,
  Phone,
  Mail,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react'
import Logo from './ui/Logo'

export const REG_STEPS = [
  { n: 1, title: 'Create Account', desc: 'Your login credentials', icon: UserPlus, path: '/register/step-1' },
  { n: 2, title: 'Company Info', desc: 'Business registration', icon: Building2, path: '/register/step-2' },
  { n: 3, title: 'Business Details', desc: 'Categories & capabilities', icon: Package, path: '/register/step-3' },
  { n: 4, title: 'Financial Info', desc: 'Tax & banking details', icon: Wallet, path: '/register/step-4' },
  { n: 5, title: 'Upload Documents', desc: 'Certificates & licenses', icon: FileUp, path: '/register/step-5' },
  { n: 6, title: 'Review & Submit', desc: 'Final check & submission', icon: ClipboardCheck, path: '/register/step-6' },
]

export default function RegistrationSidebar({ activeStep }) {
  const navigate = useNavigate()
  return (
    <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 flex-col bg-gradient-to-b from-primary to-primary-dark text-white p-8 min-h-screen sticky top-0 self-start overflow-y-auto">
      <Logo dark size="sm" />
      <div className="w-10 h-[3px] bg-accent rounded-full mt-5" />

      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
        Registration Steps
      </p>
      <p className="text-[13px] text-white/60 -mt-0.5 mb-6">Complete all 6 steps</p>

      <nav className="flex-1">
        {REG_STEPS.map((step, i) => {
          const active = step.n === activeStep
          const completed = step.n < activeStep
          const Icon = step.icon
          return (
            <div key={step.n}>
              <button
                onClick={() => step.n < activeStep && navigate(step.path)}
                className={`w-full flex items-start gap-3.5 text-left rounded-[10px] px-3 py-2.5 transition-all duration-200 ${
                  active
                    ? 'bg-accent/15 border-l-[3px] border-accent'
                    : completed
                      ? 'opacity-80 hover:bg-white/5'
                      : 'opacity-55 hover:bg-white/5'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? 'bg-accent text-white shadow-[0_4px_12px_rgba(241,143,1,0.45)]'
                      : completed
                        ? 'bg-success text-white'
                        : 'bg-transparent border-2 border-white/30 text-white/60'
                  }`}
                >
                  {completed ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold">{step.n}</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-semibold ${active ? 'text-accent' : 'text-white'}`}
                  >
                    Step {step.n}: {step.title}
                  </span>
                  <span className="block text-xs text-white/50 mt-0.5">{step.desc}</span>
                </span>
              </button>
              {i < REG_STEPS.length - 1 && (
                <div
                  className={`ml-[25px] w-[2px] h-6 ${step.n < activeStep ? 'bg-success/70' : 'bg-white/15'}`}
                />
              )}
            </div>
          )
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Phone size={15} className="text-accent" /> Need assistance?
        </p>
        <a href="tel:+9411xxxxxxx" className="flex items-center gap-2 text-[13px] text-white/70 hover:text-white transition-colors">
          <Mail size={13} className="text-white/40" /> +94 11 XXX XXXX
        </a>
        <a href="mailto:suppliers@company.lk" className="flex items-center gap-2 text-[13px] text-white/70 hover:text-white transition-colors">
          <Mail size={13} className="text-white/40" /> suppliers@company.lk
        </a>
        <div className="flex items-center gap-2 pt-2">
          <ShieldCheck size={16} className="text-success shrink-0" />
          <span className="text-xs text-white/70">
            <span className="font-semibold text-white">256-bit SSL Encrypted</span>
            <br />
            Your data is safe
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
      >
        <ChevronLeft size={14} /> Back to Home
      </button>
    </aside>
  )
}
