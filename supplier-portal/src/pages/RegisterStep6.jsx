import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, User, Building2, Package, Wallet, FileUp, PencilLine,
  ArrowLeft, Send, Check, PenLine, ShieldCheck, Lock,
} from 'lucide-react'
import RegistrationLayout from '../components/RegistrationLayout'
import Accordion from '../components/ui/Accordion'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Modal from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

const docs = [
  'Business Registration Certificate',
  'Certificate of Incorporation',
  'VAT Registration Certificate',
  'Tax Clearance Certificate',
  'Audited Accounts 2022/23',
  'Audited Accounts 2023/24',
  'Audited Accounts 2024/25',
  'Bank Reference Letter',
  'Bank Statement (6 months)',
  'Public Liability Insurance',
  'Company Profile',
  'Director ID - K. Perera',
]

const declarations = [
  'All information provided is true, accurate and complete to the best of my knowledge',
  'We are not currently blacklisted by any organization or government body',
  'We agree to comply with the Supplier Code of Conduct of [Company Name]',
  'We authorize [Company Name] to verify all submitted information with relevant authorities',
  'We understand that providing false information will result in immediate disqualification and potential legal action',
  'We accept the Terms & Conditions of the Supplier Registration Program',
]

const successBanner = {
  account: 'Account verified',
  company: 'Registration verified',
  business: '3 categories selected',
  financial: 'All details provided',
  documents: '12/12 uploaded',
}

export default function RegisterStep6() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [checks, setChecks] = useState(Array(6).fill(true))
  const [signature, setSignature] = useState('')
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [agreedModal, setAgreedModal] = useState(false)

  const allChecked = checks.every(Boolean)
  const allFilled = signature.trim().length > 0 && name.trim().length > 0 && designation.trim().length > 0

  const sections = [
    { icon: User, title: 'Account Information', ok: 'success', color: 'text-primary', label: successBanner.account },
    { icon: Building2, title: 'Company Information', ok: 'success', color: 'text-primary', label: successBanner.company },
    { icon: Package, title: 'Business Details', ok: 'success', color: 'text-primary', label: successBanner.business },
    { icon: Wallet, title: 'Financial Information', ok: 'success', color: 'text-primary', label: successBanner.financial },
    { icon: FileUp, title: 'Documents', ok: 'success', color: 'text-primary', label: successBanner.documents },
  ]

  const submit = async () => {
    if (!allChecked) {
      setToast({ type: 'error', message: 'Please confirm all declarations before submitting.' })
      return
    }
    if (!allFilled) {
      setToast({ type: 'warning', message: 'Please sign and confirm the authorized signatory details.' })
      return
    }
    setSubmitting(true)
    try {
      await api.saveStep(6, {
        declarationsConfirmed: allChecked,
        signature,
        signatories: [{ name, designation }],
      })
      await api.submitApplication()
      await refresh().catch(() => {})
      navigate('/register/success')
    } catch (err) {
      setToast({ type: 'error', message: err.message })
      setSubmitting(false)
    }
  }

  return (
    <RegistrationLayout
      activeStep={6}
      title="Review & Submit"
      subtitle="Step 6 of 6 - Review all details then submit"
      progress={100}
      crumb="Step 6: Review"
    >
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <Modal
        open={agreedModal}
        onClose={() => setAgreedModal(false)}
        size="md"
        title="Declaration Confirmation"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAgreedModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setAgreedModal(false); setToast({ type: 'success', message: 'Declarations confirmed.' }) }}>
              Confirm All
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          By proceeding, you confirm that all declarations in the agreement are truthful and
          accurate to the best of your knowledge.
        </p>
      </Modal>

      {/* Success check banner */}
      <div className="mb-6 rounded-[16px] bg-success-light/70 border border-success/30 p-5 flex items-center gap-4">
        <span className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center shrink-0">
          <CheckCircle2 size={24} />
        </span>
        <div>
          <h2 className="font-heading font-semibold text-[17px] text-success-dark">All Information Complete</h2>
          <p className="text-sm text-success-dark/80">Your application is ready to submit! Please review all details before submitting.</p>
        </div>
      </div>

      {/* Review accordions */}
      <div className="space-y-4">
        {sections.map((s) => (
          <Accordion
            key={s.title}
            icon={s.icon}
            title={s.title}
            subtitle={s.label}
            defaultOpen={s.title === 'Account Information'}
            activeColor={s.color}
            meta={
              <span className="mr-2 inline-flex items-center gap-1 text-xs font-semibold text-success-dark bg-success-light px-2.5 py-1 rounded-full">
                <Check size={12} strokeWidth={3} /> Complete
              </span>
            }
          >
            {s.title === 'Account Information' && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['Full Name', 'John Kamal Perera'],
                  ['Designation', 'Managing Director'],
                  ['Email', 'john@abctrading.lk ✓ Verified'],
                  ['Mobile', '+94 77 123 4567'],
                  ['Language', 'English'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line-soft pb-2">
                    <dt className="text-[13px] text-ink-muted">{k}</dt>
                    <dd className="text-[13px] font-semibold text-ink text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {s.title === 'Company Information' && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['Legal Name', 'ABC Trading (Pvt) Ltd'],
                  ['Reg. Number', 'PV/00123456 ✓ Verified'],
                  ['Business Type', 'Private Limited Company'],
                  ['Incorporated', '15 March 2010 (14 years)'],
                  ['Employees', '51-200 employees'],
                  ['BOI Company', 'No'],
                  ['Address', '123 Main Street, Colombo 03, Western Province'],
                  ['Company Phone', '+94 11 234 5678'],
                  ['Company Email', 'info@abctrading.lk'],
                  ['Website', 'www.abctrading.lk'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line-soft pb-2">
                    <dt className="text-[13px] text-ink-muted">{k}</dt>
                    <dd className="text-[13px] font-semibold text-ink text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {(s.title === 'Business Details' || s.title === 'Financial Information') && (
              <p className="text-sm text-ink-muted">
                All details captured in previous steps are complete and verified. Click{' '}
                <button onClick={() => navigate(`/register/${s.title === 'Business Details' ? 'step-3' : 'step-4'}`)} className="text-secondary font-semibold underline">
                  Edit
                </button>{' '}
                to make changes.
              </p>
            )}
            {s.title === 'Documents' && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {docs.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-[13px] text-ink">
                    <CheckCircle2 size={15} className="text-success shrink-0" /> {d}
                  </li>
                ))}
              </ul>
            )}
          </Accordion>
        ))}
      </div>

      {/* Declaration */}
      <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-8">
        <h3 className="flex items-center gap-2 font-heading font-semibold text-[18px] text-ink mb-1">
          <ShieldCheck size={20} className="text-accent" /> Declaration &amp; Agreement
        </h3>
        <p className="text-sm text-ink-muted mb-5">By submitting this application, I/We confirm that:</p>

        <div className="space-y-3">
          {declarations.map((d, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={(e) => setChecks(checks.map((c, j) => (j === i ? e.target.checked : c)))}
                className="mt-0.5 w-5 h-5 accent-accent cursor-pointer"
              />
              <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{d}</span>
            </label>
          ))}
        </div>

        {/* Digital signature box */}
        <div className="mt-7 rounded-[12px] border-2 border-dashed border-line p-5">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink mb-3">
            <PenLine size={16} className="text-accent" /> Digital Signature
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setSignature('John Kamal Perera')}
              className="flex-1 w-full h-[84px] rounded-[10px] bg-surface hover:bg-secondary/10 border border-line transition-colors flex items-center justify-center"
            >
              {signature ? (
                <span className="font-heading text-3xl text-primary italic">{signature}</span>
              ) : (
                <span className="text-xs text-ink-muted inline-flex items-center gap-1.5">
                  <PencilLine size={14} /> Click to sign - Type full name as signature
                </span>
              )}
            </button>
          </div>
          <p className="text-[11px] text-ink-faint mt-2">Click the box to type your full name as your signature</p>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Name" required placeholder="Authorized signatory name" value={name} onChange={(e) => setName(e.target.value)} />
          <Field label="Designation" required placeholder="e.g., Managing Director" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          <Field label="Date" required value="15 January 2025" onChange={() => {}} />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6 sm:p-8">
        <Button
          variant="primary"
          size="lg"
          className="w-full !py-4"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <Send size={18} /> SUBMIT APPLICATION
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-xs text-ink-muted flex items-center justify-center gap-1.5">
          <Lock size={12} /> This cannot be undone after submission
        </p>
      </div>

      <div className="mt-6">
        <Button variant="ghost" onClick={() => navigate('/register/step-5')}>
          <ArrowLeft size={17} /> Back to Documents
        </Button>
      </div>
    </RegistrationLayout>
  )
}
