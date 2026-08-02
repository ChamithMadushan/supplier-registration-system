import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User, Briefcase, Mail, Smartphone, Phone, Eye, EyeOff, Lock,
  ArrowRight, ArrowLeft, Check, ShieldCheck, Timer, RefreshCw,
} from 'lucide-react'
import RegistrationLayout from '../components/RegistrationLayout'
import Field from '../components/ui/Field'
import SectionLabel from '../components/ui/SectionLabel'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { useAuth } from '../context/AuthContext'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'At least one uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'At least one number', ok: /\d/.test(password) },
    { label: 'At least one special character', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length
  const levels = [
    { label: 'Weak', color: 'bg-danger', text: 'text-danger' },
    { label: 'Fair', color: 'bg-warning', text: 'text-warning-dark' },
    { label: 'Good', color: 'bg-info', text: 'text-info-dark' },
    { label: 'Strong', color: 'bg-success', text: 'text-success-dark' },
    { label: 'Very Strong', color: 'bg-primary', text: 'text-primary' },
  ]
  const lvl = levels[score === 5 ? 4 : score]

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? lvl.color : 'bg-[#E9ECEF]'
            }`}
          />
        ))}
      </div>
      {password && (
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-semibold ${lvl.text}`}>Strength: {lvl.label}</span>
        </div>
      )}
      <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? 'text-success-dark' : 'text-ink-muted'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center ${c.ok ? 'bg-success-light text-success' : 'bg-surface text-ink-faint'}`}>
              <Check size={10} strokeWidth={3} />
            </span>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function OtpModal({ open, onClose, email, onVerified }) {
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [seconds, setSeconds] = useState(272)
  const refs = useRef([])
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!open) return
    setDigits(Array(6).fill(''))
    setSeconds(272)
    setVerified(false)
  }, [open])

  useEffect(() => {
    if (!open || verified) return
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [open, verified])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const code = digits.join('')
  const complete = code.length === 6

  const submit = () => {
    if (!complete) return
    setVerified(true)
    onVerified?.()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Email Verification"
      subtitle="Confirm your email address"
    >
      <div className="text-center">
        <span className="mx-auto w-14 h-14 rounded-full bg-info-light text-info flex items-center justify-center">
          <Mail size={26} />
        </span>
        {verified ? (
          <div className="mt-5 anim-fade-up">
            <span className="mx-auto w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center">
              <Check size={26} strokeWidth={3} />
            </span>
            <p className="mt-4 font-semibold text-ink">Email Verified Successfully!</p>
            <p className="text-sm text-ink-muted mt-1">{email}</p>
            <Button className="mt-6 w-full" onClick={onClose}>
              Continue
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-ink-muted">
              We sent a 6-digit code to
              <span className="block font-semibold text-ink mt-1">{email}</span>
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  className="w-11 h-14 text-center text-lg font-bold font-mono text-ink border-[1.5px] border-line rounded-[8px] focus:border-secondary focus:shadow-[var(--shadow-input)] outline-none transition-all"
                />
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <Timer size={14} className="text-warning-dark" />
              Code expires in: <span className="font-mono font-bold text-ink">{mm}:{ss}</span>
            </p>
            <Button className="mt-6 w-full" disabled={!complete} onClick={submit}>
              Verify Code
            </Button>
            <div className="mt-4 flex items-center justify-center gap-5 text-xs">
              <button
                onClick={() => setSeconds(272)}
                className="inline-flex items-center gap-1 font-medium text-secondary hover:text-primary transition-colors"
              >
                <RefreshCw size={13} /> Resend Code
              </button>
              <span className="text-line">|</span>
              <button onClick={onClose} className="font-medium text-ink-muted hover:text-ink transition-colors">
                Change Email
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default function RegisterStep1() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullName: '', designation: '', email: '', mobile: '', altPhone: '',
    password: '', confirmPassword: '', language: 'English',
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [touched, setTouched] = useState({})
  const [otpOpen, setOtpOpen] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [agreed, setAgreed] = useState({ t1: false, t2: false, t3: true })
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const passwordMatch = form.confirmPassword !== '' && form.password === form.confirmPassword
  const passwordMismatch = form.confirmPassword !== '' && form.password !== form.confirmPassword
  const nameOk = form.fullName.trim().length >= 3
  const mobileOk = /^[0-9]{9}$/.test(form.mobile.replace(/\s/g, ''))

  const requiredFilled =
    nameOk &&
    form.designation.trim() !== '' &&
    emailValid &&
    emailVerified &&
    mobileOk &&
    form.password.length >= 8 &&
    passwordMatch &&
    agreed.t1 &&
    agreed.t2

  const allOk = requiredFilled

  const handleSubmit = async () => {
    if (!allOk) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTouched({
        fullName: true, designation: true, email: true, mobile: true,
        password: true, confirmPassword: true,
      })
      setToast({ type: 'error', message: 'Please complete all required fields correctly.' })
      return
    }
    setSubmitting(true)
    try {
      await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        designation: form.designation,
        mobile: form.mobile.replace(/\s/g, ''),
        altPhone: form.altPhone,
        language: form.language,
      })
      setToast({ type: 'success', message: 'Account created! Proceeding to Company Information.' })
      setTimeout(() => navigate('/register/step-2'), 900)
    } catch (err) {
      setToast({ type: 'error', message: err.message })
      setSubmitting(false)
    }
  }

  return (
    <RegistrationLayout
      activeStep={1}
      title="Create Your Account"
      subtitle="Step 1 of 6 - Enter your login credentials"
      progress={16}
      crumb="Step 1: Account"
    >
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <OtpModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        email={form.email}
        onVerified={() => {
          setEmailVerified(true)
          setOtpOpen(false)
          setToast({ type: 'success', message: 'Email verified successfully!' })
        }}
      />

      <div
        className={`bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-line-soft p-6 sm:p-10 ${shake ? 'anim-shake' : ''}`}
      >
        <SectionLabel icon={User}>Personal Details</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field
              label="Full Name" required icon={User} placeholder="Enter your full name"
              value={form.fullName} onChange={set('fullName')}
              error={touched.fullName && !nameOk ? 'Full name must be at least 3 characters' : ''}
              valid={nameOk}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Designation" required icon={Briefcase} placeholder="e.g., Managing Director, CEO"
              value={form.designation} onChange={set('designation')}
              error={touched.designation && form.designation === '' ? 'Designation is required' : ''}
              valid={form.designation !== ''}
            />
          </div>
          <Field label="First Name" placeholder="Your first name" value={form.firstName} onChange={set('firstName')} />
          <Field label="Last Name" placeholder="Your last name" value={form.lastName} onChange={set('lastName')} />
        </div>

        <div className="mt-10">
          <SectionLabel icon={Mail}>Contact Details</SectionLabel>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Field
                label="Business Email Address" required icon={Mail}
                placeholder="yourname@company.lk"
                helper={!form.email ? 'Use your official company email' : ''}
                value={form.email} onChange={set('email')}
                type="email"
                state={form.email === '' ? undefined : emailValid ? 'valid' : 'error'}
                error={form.email !== '' && !emailValid ? 'Please enter a valid email address' : ''}
                valid={emailValid}
              />
              {emailValid && (
                <div className="mt-3 anim-fade-up">
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-success-dark bg-success-light px-4 py-2 rounded-full">
                      <Check size={15} strokeWidth={3} /> Email Verified
                    </span>
                  ) : (
                    <Button size="sm" onClick={() => setOtpOpen(true)}>
                      Send Verification Code <ArrowRight size={14} />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
              <Field
                label="Mobile Number" required icon={Smartphone}
                placeholder="7X XXX XXXX" value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/[^\d ]/g, '').slice(0, 11) })}
                helper="Enter 9 digits after +94"
                error={touched.mobile && !mobileOk ? 'Enter a valid 9-digit mobile number' : ''}
                valid={mobileOk}
              />
              <div className="flex items-end">
                <div className="w-full h-[48px] bg-white rounded-[8px] border-[1.5px] border-line flex items-center gap-2 px-4 text-sm">
                  <span className="text-lg" aria-hidden>🇱🇰</span>
                  <span className="font-semibold text-ink">+94</span>
                  <span className="text-ink-faint text-[13px]">{form.mobile || 'your number'}</span>
                </div>
              </div>
            </div>
            <Field
              label="Office / Alternative Phone" icon={Phone} placeholder="+94 11 XXX XXXX"
              value={form.altPhone} onChange={set('altPhone')}
              helper="Optional"
            />
          </div>
        </div>

        <div className="mt-10">
          <SectionLabel icon={Lock}>Security</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Field
                label="Create Password" required icon={Lock}
                placeholder="Create a strong password"
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={set('password')}
                rightIcon={showPw ? EyeOff : Eye}
                onRightIconClick={() => setShowPw(!showPw)}
                rightIconLabel={showPw ? 'Hide password' : 'Show password'}
              />
              <PasswordStrength password={form.password} />
            </div>
            <Field
              label="Confirm Password" required icon={Lock}
              placeholder="Re-enter your password"
              type={showConfirmPw ? 'text' : 'password'}
              value={form.confirmPassword} onChange={set('confirmPassword')}
              rightIcon={showConfirmPw ? EyeOff : Eye}
              onRightIconClick={() => setShowConfirmPw(!showConfirmPw)}
              rightIconLabel={showConfirmPw ? 'Hide password' : 'Show password'}
              state={passwordMatch ? 'valid' : passwordMismatch ? 'error' : 'default'}
              error={passwordMismatch ? "Passwords don't match" : ''}
              valid={passwordMatch}
            />
          </div>
        </div>

        <div className="mt-10">
          <SectionLabel>Preferences</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {[
              { flag: '🇬🇧', label: 'English' },
              { flag: '🇱🇰', label: 'සිංහල (Sinhala)' },
              { flag: '🇱🇰', label: 'தமிழ் (Tamil)' },
            ].map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => setForm({ ...form, language: l.label })}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] border-2 transition-all ${
                  form.language === l.label
                    ? 'border-accent bg-accent/10 text-accent-hover'
                    : 'border-line-soft text-ink-muted hover:border-secondary/50'
                }`}
              >
                <span className="text-lg" aria-hidden>{l.flag}</span>
                <span className="text-sm font-medium">{l.label}</span>
                {form.language === l.label && <Check size={15} strokeWidth={3} className="text-accent" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-3.5">
          <SectionLabel>Terms &amp; Conditions</SectionLabel>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed.t1}
              onChange={(e) => setAgreed({ ...agreed, t1: e.target.checked })}
              className="mt-0.5 w-5 h-5 accent-accent cursor-pointer"
            />
            <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">
              I have read and agree to the{' '}
              <button type="button" className="text-secondary font-semibold underline decoration-dotted hover:text-primary">
                Terms &amp; Conditions
              </button>{' '}
              and{' '}
              <button type="button" className="text-secondary font-semibold underline decoration-dotted hover:text-primary">
                Privacy Policy
              </button>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed.t2}
              onChange={(e) => setAgreed({ ...agreed, t2: e.target.checked })}
              className="mt-0.5 w-5 h-5 accent-accent cursor-pointer"
            />
            <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">
              I confirm I am authorized to register on behalf of my company
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed.t3}
              onChange={(e) => setAgreed({ ...agreed, t3: e.target.checked })}
              className="mt-0.5 w-5 h-5 accent-accent cursor-pointer"
            />
            <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">
              I agree to receive email communications about my registration{' '}
              <span className="text-ink-faint">(Optional)</span>
            </span>
          </label>
        </div>

        <div className="mt-9">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>Next: Company Information <ArrowRight size={18} /></>
            )}
          </Button>
          <p className="mt-4 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-secondary hover:text-primary transition-colors">
              Login here →
            </Link>
          </p>
        </div>

        {/* Social proof */}
        <div className="mt-9 pt-7 border-t border-line-soft flex flex-col sm:flex-row items-center gap-4">
          <div className="flex -space-x-2.5">
            {['AB', 'XY', 'DE', 'GH', 'IJ'].map((ini, i) => (
              <span
                key={ini}
                className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white ${['bg-primary', 'bg-secondary', 'bg-accent', 'bg-info', 'bg-success'][i]}`}
              >
                {ini}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-ink-muted">
            Join <strong className="text-ink">500+</strong> verified suppliers
            <span className="block sm:inline sm:ml-1">
              - ABC Trading, XYZ Ltd, and 498 others
            </span>
          </p>
        </div>
      </div>
    </RegistrationLayout>
  )
}
