import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, Lock, Mail, Eye, EyeOff, AlertTriangle, ArrowLeft, Loader2,
  CheckCircle2, RefreshCw, Building2, Fingerprint, Timer, KeyRound, ShieldAlert,
} from 'lucide-react'
import { adminApi, setAdminToken, setAdminUser, getAdminToken } from '../../api/adminClient'

function OTPBox({ value, onChange }) {
  const refs = useRef([])
  const set = (i, ch) => {
    if (ch && !/^\d$/.test(ch)) return
    const next = value.split('')
    next[i] = ch || ''
    onChange(next.join(''))
    if (ch && i < 5) refs.current[i + 1]?.focus()
  }
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }
  return (
    <div className="flex justify-center gap-2.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-[52px] h-[58px] text-center text-[24px] font-bold font-mono text-admin-text bg-white border-[1.5px] border-admin-border rounded-[10px] focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,58,95,0.12)] focus:outline-none transition-all"
        />
      ))}
    </div>
  )
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locked, setLocked] = useState(false)
  const [otp, setOtp] = useState('')
  const [admin, setAdmin] = useState(null)
  const [creds, setCreds] = useState({ email: '', password: '' })

  useEffect(() => {
    if (getAdminToken()) navigate('/admin/dashboard', { replace: true })
  }, [navigate])

  const submitLogin = async (e) => {
    e.preventDefault()
    if (!creds.email || !creds.password) {
      setError('Please enter both email and password')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.login(creds.email.trim(), creds.password)
      setAdmin(data.admin)
      setScreen('2fa')
    } catch (err) {
      if (err.status === 423) {
        setLocked(true)
      } else {
        const left = err.data?.attemptsRemaining
        if (left !== undefined && left === 0) {
          setLocked(true)
          setError('Account locked. Too many failed attempts.')
        } else {
          setError(left !== undefined
            ? `Invalid email or password. ${left} attempt${left > 1 ? 's' : ''} remaining before lockout.`
            : (err.message || 'Login failed'))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.verifyOtp(creds.email.trim(), otp)
      setAdminToken(data.token)
      setAdminUser(data.admin)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Incorrect verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const InputShell = ({ label, icon: Icon, right, error, children }) => (
    <div>
      <label className="block text-[12px] font-semibold text-admin-text mb-1.5">{label}</label>
      <div className={`relative flex items-center rounded-[8px] border-[1.5px] bg-white transition-colors ${error ? 'border-danger' : 'border-admin-border focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(30,58,95,0.12)]'}`}>
        <Icon size={17} className={`absolute left-3.5 ${error ? 'text-danger' : 'text-admin-muted'}`} />
        {children}
        {right && <span className="absolute right-3">{right}</span>}
      </div>
      {error && <p className="mt-1.5 text-[11px] font-medium text-danger anim-fade-up">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex bg-admin-bg">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white p-10">
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '42px 42px' }}
        />
        {/* geometric shapes */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-[12px] bg-accent text-white flex items-center justify-center font-heading font-bold text-lg shadow-[0_4px_14px_rgba(241,143,1,0.4)]">S</span>
            <div>
              <p className="font-heading font-bold text-[22px] leading-none">Supplier Registration System</p>
              <p className="text-[13px] text-white/60 mt-1">Admin Management Portal</p>
            </div>
          </div>
          <div className="mt-3 w-[60px] h-[3px] rounded-full bg-accent" />
        </div>

        <div className="relative max-w-[440px]">
          <span className="w-14 h-14 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center mb-6">
            <ShieldCheck size={30} className="text-accent" />
          </span>
          <h2 className="font-heading font-bold text-[28px] leading-tight">Procurement Command Center</h2>
          <p className="mt-3 text-[14px] text-white/70 leading-relaxed">
            Manage supplier registrations, evaluations, and performance from one secure platform.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: Lock, title: 'Multi-level security authentication', desc: '2FA & role-based access control' },
              { icon: Building2, title: 'Real-time supplier analytics', desc: 'Live dashboards & reporting' },
              { icon: CheckCircle2, title: 'Complete procurement workflow', desc: 'From screening to approval' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3.5">
                <span className="w-9 h-9 rounded-[10px] bg-accent/15 border border-accent/25 text-accent flex items-center justify-center shrink-0">
                  <f.icon size={17} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold">{f.title}</p>
                  <p className="text-[12px] text-white/55">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-wrap gap-2.5">
            {['🔒 256-bit SSL', '🛡️ 2FA Protected', '📋 Audit Logged'].map((b) => (
              <span key={b} className="px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10 text-[12px] font-medium text-white/85">
                {b}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/50">
            <span>SRS Admin v2.1.0 · © 2024 Procurement Division</span>
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <span className="w-10 h-10 rounded-[10px] bg-navy-800 text-white flex items-center justify-center font-heading font-bold">S</span>
          <p className="font-heading font-bold text-[16px] text-admin-text">SRS Admin Portal</p>
        </div>

        <div className="w-full max-w-[440px] bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] px-8 sm:px-11 py-10 anim-fade-up">
          {/* LOGIN SCREEN */}
          {screen === 'login' && (
            <>
              <div className="flex flex-col items-center text-center">
                <span className="w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                  <ShieldCheck size={24} />
                </span>
                <h1 className="mt-3 font-heading font-bold text-[24px] text-admin-text">Admin Login</h1>
                <p className="mt-1 text-[13px] text-admin-light">Enter your credentials to continue</p>
              </div>
              <div className="my-6 h-px bg-admin-border" />

              {error && (
                <div className="mb-5 rounded-[10px] border border-danger/25 bg-danger-light px-4 py-3 anim-fade-up">
                  <p className="flex items-center gap-2 text-[12px] font-bold text-danger-dark">
                    <AlertTriangle size={15} className="shrink-0" /> {error}
                  </p>
                </div>
              )}

              {locked && (
                <div className="mb-5 rounded-[10px] border border-danger/25 bg-danger-light px-4 py-3">
                  <p className="flex items-center gap-2 text-[12px] font-bold text-danger-dark">
                    <ShieldAlert size={15} className="shrink-0" /> Account temporarily locked
                  </p>
                  <p className="mt-1 text-[11px] text-danger/80">Too many failed attempts. Locked for 29:45 min. Contact IT Support.</p>
                </div>
              )}

              <form onSubmit={submitLogin} className="space-y-5">
                <InputShell label="Email Address" icon={Mail} error={error && !creds.email ? 'Please enter your email' : null}>
                  <input
                    type="email"
                    autoComplete="off"
                    placeholder="admin@company.lk"
                    value={creds.email}
                    disabled={locked}
                    onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                    className="w-full h-[44px] bg-transparent pl-11 pr-4 text-[14px] placeholder:text-admin-muted focus:outline-none"
                  />
                </InputShell>

                <InputShell
                  label="Password"
                  icon={Lock}
                  error={error && !creds.password ? 'Please enter your password' : null}
                  right={
                    <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password" className="text-admin-muted hover:text-admin-text transition-colors">
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                >
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={creds.password}
                    disabled={locked}
                    onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                    className="w-full h-[44px] bg-transparent pl-11 pr-11 text-[14px] placeholder:text-admin-muted focus:outline-none"
                  />
                </InputShell>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded-[4px] border-admin-border accent-primary" />
                    Remember this device
                  </label>
                  <button type="button" onClick={() => { setScreen('forgot'); setError(null) }} className="text-[12px] font-semibold text-accent-hover hover:text-accent transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || locked}
                  className="w-full h-[48px] rounded-[10px] bg-accent hover:bg-accent-hover text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(241,143,1,0.3)] transition-colors disabled:opacity-60"
                >
                  {loading ? (<><Loader2 size={17} className="animate-spin" /> Authenticating...</>) : (<><Lock size={17} /> Sign In Securely</>)}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4 text-[11px] text-admin-muted">
                <span className="flex-1 h-px bg-admin-border" /> OR <span className="flex-1 h-px bg-admin-border" />
              </div>
              <button
                onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setScreen('2fa') }, 900) }}
                className="w-full h-[46px] rounded-[10px] border-[1.5px] border-primary text-primary hover:bg-primary hover:text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors"
              >
                <Building2 size={17} /> Sign in with Company SSO
              </button>

              <div className="mt-7 text-center text-[12px] text-admin-light">
                Having trouble? Contact IT Support
                <p className="mt-1 font-medium text-admin-text">itsupport@company.lk · +94 11 234 5678 (ext. 100)</p>
              </div>
            </>
          )}

          {/* 2FA SCREEN */}
          {screen === '2fa' && (
            <div className="anim-fade-up">
              <div className="flex flex-col items-center text-center">
                <span className="w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                  <Fingerprint size={24} />
                </span>
                <h1 className="mt-3 font-heading font-bold text-[22px] text-admin-text">Two-Factor Verification</h1>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-success-dark bg-success-light px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} /> Credentials verified
                </p>
              </div>

              <div className="mt-6 rounded-[10px] bg-table-header border border-admin-border px-4 py-3 text-[12px] text-admin-medium space-y-1">
                <p>We sent a 6-digit code to:</p>
                <p className="font-medium text-admin-text">📱 {admin?.phoneMasked || '+94 77 ***-**67'}</p>
                <p className="font-medium text-admin-text">📧 {admin?.emailMasked || 'ad***@company.lk'}</p>
              </div>

              {error && (
                <p className="mt-4 text-[12px] font-semibold text-danger bg-danger-light border border-danger/25 rounded-[8px] px-3 py-2 text-center">{error}</p>
              )}

              <div className="mt-6">
                <OTPBox value={otp} onChange={setOtp} />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-admin-medium">
                <Timer size={14} className="text-accent-hover" /> Code expires in <span className="font-mono font-bold text-admin-text">04:32</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#E9ECEF] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: '72%' }} />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="mt-6 w-full h-[48px] rounded-[10px] bg-accent hover:bg-accent-hover text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <><Loader2 size={17} className="animate-spin" /> Verifying...</> : <><CheckCircle2 size={17} /> Verify Code</>}
              </button>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button className="h-[40px] rounded-[8px] border border-admin-border text-[13px] font-semibold text-admin-medium hover:bg-table-hover transition-colors">
                  <RefreshCw size={14} className="inline mr-1.5" />Resend via SMS
                </button>
                <button className="h-[40px] rounded-[8px] border border-admin-border text-[13px] font-semibold text-admin-medium hover:bg-table-hover transition-colors">
                  📧 Resend via Email
                </button>
              </div>

              <button onClick={() => setScreen('login')} className="mt-5 w-full text-center text-[13px] font-semibold text-secondary hover:text-primary transition-colors">
                <ArrowLeft size={14} className="inline mr-1" /> Use a different account
              </button>
              <p className="mt-3 text-center text-[11px] text-admin-muted">Lost access? Contact IT Support</p>
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {screen === 'forgot' && (
            <div className="anim-fade-up">
              <div className="flex flex-col items-center text-center">
                <span className="w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                  <KeyRound size={24} />
                </span>
                <h1 className="mt-3 font-heading font-bold text-[22px] text-admin-text">Reset Your Password</h1>
                <p className="mt-1.5 text-[13px] text-admin-light">Enter your admin email and we will send a password reset link</p>
              </div>
              <div className="mt-7 space-y-5">
                <InputShell label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    placeholder="admin@company.lk"
                    className="w-full h-[44px] bg-transparent pl-11 pr-4 text-[14px] placeholder:text-admin-muted focus:outline-none"
                  />
                </InputShell>
                <button className="w-full h-[48px] rounded-[10px] bg-accent hover:bg-accent-hover text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors">
                  <Mail size={16} /> Send Reset Link
                </button>
                <button onClick={() => setScreen('login')} className="w-full text-center text-[13px] font-semibold text-secondary hover:text-primary transition-colors">
                  <ArrowLeft size={14} className="inline mr-1" /> Back to Login
                </button>
                <p className="text-center text-[11px] text-admin-muted leading-relaxed">ⓘ Reset links expire after 30 minutes.<br />Contact IT if you need immediate access.</p>
              </div>
            </div>
          )}
        </div>

        {/* Security warning banner */}
        <div className="mt-6 w-full max-w-[440px] rounded-[10px] border border-warning/40 bg-warning-light px-4 py-3 text-center">
          <p className="text-[11px] text-warning-dark leading-relaxed">
            ⚠️ This system is for authorized users only. Unauthorized access attempts are logged and may result in legal action.
          </p>
        </div>
      </div>
    </div>
  )
}
