import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Copy, Check, PartyPopper, TrendingUp, Home, Download, ChevronRight, BadgeCheck,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'
import { Toast } from '../components/ui/Toast'

const confetti = Array.from({ length: 40 }, (_, i) => ({
  left: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 3,
  color: ['#F18F01', '#1E3A5F', '#28A745', '#2E86AB', '#FFC107', '#DC3545'][i % 6],
  size: 6 + Math.random() * 8,
  rotate: Math.random() * 360,
}))

const nextSteps = [
  'Initial screening (1-2 days)',
  'Document verification (5 days)',
  'Technical evaluation (5 days)',
  'Committee review (3 days)',
  'Decision notification',
]

export default function Success() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)
  const refNo = 'SRS-2024-001234'

  useEffect(() => {
    const t = setTimeout(() => setToast({ type: 'success', message: 'Application submitted successfully!' }), 500)
    return () => clearTimeout(t)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(refNo)
      setCopied(true)
      setToast({ type: 'success', message: 'Reference number copied to clipboard.' })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setToast({ type: 'error', message: 'Could not copy. Please copy manually.' })
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {confetti.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.4,
              backgroundColor: c.color,
              transform: `rotate(${c.rotate}deg)`,
              animation: `confettiFall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <header className="bg-white border-b border-line-soft px-4 sm:px-8 h-[72px] flex items-center justify-between">
        <Logo size="sm" />
        <Link to="/" className="text-sm font-semibold text-ink-muted hover:text-primary transition-colors">
          Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[620px] bg-white rounded-[16px] shadow-[var(--shadow-modal)] border border-line-soft p-8 sm:p-12 text-center anim-fade-up">
          <div className="relative inline-block">
            <span className="absolute inset-0 rounded-full bg-success/20 anim-float" style={{ animationName: 'pulseRing' }} />
            <span className="relative w-20 h-20 rounded-full bg-success text-white flex items-center justify-center mx-auto shadow-[0_8px_24px_rgba(40,167,69,0.35)]">
              <PartyPopper size={38} />
            </span>
          </div>

          <h1 className="mt-6 text-2xl sm:text-[32px] font-bold font-heading text-ink">
            Application Submitted Successfully!
          </h1>
          <p className="mt-2 text-sm text-ink-muted">Your supplier registration application is now under review.</p>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted mb-3">
              Your Reference Number
            </p>
            <div className="inline-flex items-center gap-3 rounded-[12px] border-2 border-dashed border-accent/50 bg-accent/5 px-6 py-4">
              <span className="font-mono text-2xl font-bold text-primary tracking-wider">{refNo}</span>
              <button
                onClick={copy}
                aria-label="Copy reference number"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  copied ? 'bg-success text-white' : 'bg-white text-ink-muted hover:text-primary border border-line'
                }`}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink">
            <BadgeCheck size={17} className="text-success shrink-0" />
            Confirmation email sent to: <span className="font-semibold">john@abctrading.lk</span>
          </div>

          <div className="mt-8 rounded-[16px] bg-primary text-white p-6 text-left">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] mb-4">
              <TrendingUp size={18} className="text-accent" /> Expected Processing Time: 15-20 working days
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50 mb-3">
              What happens next?
            </p>
            <ul className="space-y-2.5">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-accent shrink-0">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="primary" onClick={() => navigate('/register/step-6')}>
              <TrendingUp size={16} /> Track Application
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home size={16} /> Back to Home
            </Button>
            <Button variant="ghost" onClick={() => setToast({ type: 'success', message: 'Receipt downloaded.' })}>
              <Download size={16} /> Download Receipt
            </Button>
          </div>

          <p className="mt-8 text-xs text-ink-muted flex items-center justify-center gap-1">
            Need help? <span className="font-semibold text-secondary">+94 11 XXX XXXX</span>
            <ChevronRight size={12} />
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-muted border-t border-line-soft bg-white">
        © 2024 [Company Name] • Supplier Registration Portal • Made with ❤️ in Sri Lanka 🇱🇰
      </footer>
    </div>
  )
}
