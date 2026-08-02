import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canSubmit = emailValid && password.length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    try {
      const data = await login(email.trim(), password)
      setToast({ type: 'success', message: `Welcome back, ${data.user.fullName || ''}`.trim() })
      setTimeout(() => navigate(data.application ? '/portal/dashboard' : '/portal/dashboard'), 800)
    } catch (err) {
      setToast({ type: 'error', message: err.message })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Brand panel */}
      <div className="hidden lg:flex w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-light/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full bg-accent/10 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-3 z-10">
          <span className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" />
              <path d="M3 9h18M7 17v2M12 17v2M17 17v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-heading font-bold text-[19px] text-white leading-tight">
            Supplier Registration
            <span className="block text-[12px] font-medium text-white/60">Management System</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-heading text-[28px] font-bold text-white leading-snug">
            Manage your supplier<br />registration in one place
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              'Track your application in real time',
              'Upload and manage required documents',
              'Get support from the registration team',
              'Receive notifications on your application',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-white/80 text-sm">
                <CheckCircle2 size={17} className="text-accent shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-[12px] text-white/50">
          Demo account: demo@company.lk / Demo@1234
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <span className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" />
                <path d="M3 9h18M7 17v2M12 17v2M17 17v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-heading font-bold text-[18px] text-primary">Supplier Portal</span>
          </div>

          <h1 className="text-2xl font-heading font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-ink-muted mt-1">Sign in to your supplier account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field
              label="Email Address" required icon={Mail} type="email"
              placeholder="you@company.lk" value={email}
              onChange={(e) => setEmail(e.target.value)}
              valid={email !== '' && emailValid}
              error={email !== '' && !emailValid ? 'Enter a valid email address' : ''}
            />
            <Field
              label="Password" required icon={Lock}
              placeholder="Enter your password" type={showPw ? 'text' : 'password'}
              value={password} onChange={(e) => setPassword(e.target.value)}
              rightIcon={showPw ? EyeOff : Eye}
              onRightIconClick={() => setShowPw(!showPw)}
              rightIconLabel={showPw ? 'Hide password' : 'Show password'}
            />
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent" />
                <span className="text-ink-muted">Remember me</span>
              </label>
              <button type="button" className="font-semibold text-secondary hover:text-primary transition-colors">
                Forgot password?
              </button>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={!canSubmit || loading}>
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <div className="mt-8 rounded-[12px] border border-line-soft bg-white p-4 text-center">
            <p className="text-[13px] text-ink-muted">
              New supplier?{' '}
              <Link to="/register/step-1" className="font-semibold text-secondary hover:text-primary transition-colors">
                Start your registration →
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-ink-faint">
            Protected by the Supplier Registration System. Your data is confidential.
          </p>
        </div>
      </div>
    </div>
  )
}
