import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, FileText, TrendingUp, Building2, Shield, Lock, ArrowLeft, ArrowRight,
  Search, Loader2, BadgeCheck, XCircle, Wallet, Receipt, Landmark, Users,
} from 'lucide-react'
import RegistrationLayout from '../components/RegistrationLayout'
import Field from '../components/ui/Field'
import Select from '../components/ui/Select'
import SectionLabel from '../components/ui/SectionLabel'
import Button from '../components/ui/Button'
import RadioCard from '../components/ui/RadioCard'
import { Toast } from '../components/ui/Toast'
import { useSaveStep } from '../hooks/useSaveStep'

const banks = [
  'Bank of Ceylon', "People's Bank", 'Commercial Bank', 'Sampath Bank',
  'Hatton National Bank (HNB)', 'National Savings Bank', 'DFCC Bank',
  'NDB Bank', 'Seylan Bank', 'Pan Asia Bank', 'Union Bank', 'Amana Bank',
]

const branchesByBank = {
  'Bank of Ceylon': ['Colombo Fort', 'Kandy Main', 'Negombo', 'Galle', 'Jaffna'],
  "People's Bank": ['Colombo Fort', 'Kandy Main', 'Gampaha', 'Matara'],
  'Commercial Bank': ['Union Place', 'Kandy', 'Kurunegala', 'Nugegoda'],
  'Sampath Bank': ['Colombo 02', 'Colombo 04', 'Battaramulla', 'Kandy'],
  'Hatton National Bank (HNB)': ['Head Office', 'Colombo 03', 'Negombo', 'Galle'],
  'National Savings Bank': ['Colombo 01', 'Kandy', 'Jaffna', 'Ratnapura'],
  'DFCC Bank': ['Colombo 03', 'Kandy', 'Kurunegala'],
  'NDB Bank': ['Colombo 07', 'Colombo 02', 'Kandy'],
  'Seylan Bank': ['Colombo 02', 'Colombo 10', 'Gampaha'],
  'Pan Asia Bank': ['Colombo 03', 'Colombo 06'],
  'Union Bank': ['Colombo 03', 'Kandy'],
  'Amana Bank': ['Colombo 05', 'Kandy'],
}

const insuranceTypes = [
  { title: 'Public Liability Insurance', hasNotApplicable: false },
  { title: "Workmen's Compensation", hasNotApplicable: false },
  { title: 'Professional Indemnity', hasNotApplicable: true },
  { title: 'Product Liability', hasNotApplicable: true },
]

function VerifyBtn({ status, onClick, children }) {
  const config = {
    idle: { cls: 'border-2 border-primary text-primary hover:bg-primary hover:text-white', Icon: Search, spin: '' },
    loading: { cls: 'border border-line bg-surface text-ink-muted', Icon: Loader2, spin: 'animate-spin' },
    verified: { cls: 'bg-success-light text-success-dark border-success-light', Icon: BadgeCheck, spin: '' },
    notfound: { cls: 'bg-danger-light text-danger-dark border-danger-light', Icon: XCircle, spin: '' },
  }
  const { cls, Icon, spin } = config[status]
  return (
    <button
      type="button"
      disabled={status === 'loading' || status === 'verified'}
      onClick={onClick}
      className={`h-[48px] inline-flex items-center gap-2 px-5 rounded-[8px] text-sm font-semibold transition-colors shrink-0 ${cls}`}
    >
      <Icon size={17} className={spin} />
      {children}
    </button>
  )
}

function InsuranceCard({ data, onChange }) {
  const opt = data.opt || 'no'
  return (
    <div className="rounded-[12px] border border-line-soft bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="flex items-center gap-2 font-semibold text-[15px] text-ink">
          <Shield size={17} className="text-info" /> {data.title}
        </p>
        <div className="flex gap-4 text-[13px] font-medium">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name={data.title} checked={opt === 'yes'} onChange={() => onChange({ ...data, opt: 'yes' })} className="accent-accent" />
            Have
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name={data.title} checked={opt === 'no'} onChange={() => onChange({ ...data, opt: 'no' })} className="accent-accent" />
            Don't Have
          </label>
          {data.hasNotApplicable && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name={data.title} checked={opt === 'na'} onChange={() => onChange({ ...data, opt: 'na' })} className="accent-accent" />
              Not Applicable
            </label>
          )}
        </div>
      </div>
      {opt === 'yes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 anim-fade-up">
          <Select label="Insurer" options={['Ceylinco General', 'SLIC General', 'Allianz Insurance', 'Continental Insurance', 'Union Assurance', 'Softlogic Life', 'Hemas Insure', 'Janashakthi Insurance']} placeholder="Select insurer" value={data.insurer || ''} onChange={(e) => onChange({ ...data, insurer: e.target.value })} />
          <Field label="Policy No" placeholder="Policy number" value={data.policy || ''} onChange={(e) => onChange({ ...data, policy: e.target.value })} />
          <Field label="Coverage (LKR)" placeholder="Amount" value={data.coverage || ''} onChange={(e) => onChange({ ...data, coverage: e.target.value })} />
          <Field label="Expiry Date" type="date" value={data.expiry || ''} onChange={(e) => onChange({ ...data, expiry: e.target.value })} />
        </div>
      )}
    </div>
  )
}

export default function RegisterStep4() {
  const navigate = useNavigate()
  const { save, saving, error } = useSaveStep(4)
  const [vatStatus, setVatStatus] = useState('vat')
  const [vatNumber, setVatNumber] = useState('')
  const [vatVerify, setVatVerify] = useState('idle')
  const [tin, setTin] = useState('')
  const [tinVerify, setTinVerify] = useState('idle')
  const [epf, setEpf] = useState('registered')
  const [epfNo, setEpfNo] = useState('')
  const [etf, setEtf] = useState('registered')
  const [etfNo, setEtfNo] = useState('')
  const [yearsData, setYearsData] = useState({ y1: '', y2: '', y3: '' })
  const [bank, setBank] = useState('')
  const [branch, setBranch] = useState('')
  const [acctName, setAcctName] = useState('')
  const [acctNumber, setAcctNumber] = useState('')
  const [acctType, setAcctType] = useState('Current Account')
  const [swift, setSwift] = useState('')
  const [insurances, setInsurances] = useState(insuranceTypes.map((i) => ({ ...i, opt: 'yes' })))
  const [customer, setCustomer] = useState('')
  const [custPeriod, setCustPeriod] = useState('')
  const [custValue, setCustValue] = useState('')
  const [supplier, setSupplier] = useState('')
  const [supplierPeriod, setSupplierPeriod] = useState('')
  const [toast, setToast] = useState(null)

  const values = Object.values(yearsData).map((v) => parseFloat(v) || 0).filter(Boolean)
  const trend = values.length < 2 ? 'stable' : values[values.length - 1] > values[0] ? 'up' : values[values.length - 1] < values[0] ? 'down' : 'stable'

  const verifyVat = () => {
    if (!vatNumber.trim()) return
    setVatVerify('loading')
    setTimeout(() => setVatVerify(vatNumber.trim().length >= 8 ? 'verified' : 'notfound'), 1300)
  }
  const verifyTin = () => {
    if (!tin.trim()) return
    setTinVerify('loading')
    setTimeout(() => setTinVerify(/^\d{9}$/.test(tin.trim()) ? 'verified' : 'notfound'), 1300)
  }

  const setIns = (i, val) => setInsurances(insurances.map((x, j) => (j === i ? val : x)))

  const maxVal = Math.max(...values, 1)
  const bars = values.map((v) => ({ v, p: (v / maxVal) * 100 }))

  return (
    <RegistrationLayout
      activeStep={4}
      title="Financial Information"
      subtitle="Step 4 of 6 - Tax and banking details"
      progress={67}
      crumb="Step 4: Financial"
    >
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Security assurance card */}
      <div className="mb-6 rounded-[16px] bg-gradient-to-br from-primary to-primary-dark text-white p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <span className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
          <ShieldCheck size={30} />
        </span>
        <div className="flex-1">
          <h2 className="font-heading font-semibold text-[18px]">Your Information is Secure</h2>
          <p className="mt-1.5 text-[14px] text-white/70 leading-relaxed">
            Financial information is encrypted with 256-bit SSL and used only for pre-qualification
            purposes. We never share your data with third parties.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { icon: Lock, label: 'SSL Encrypted' },
              { icon: ShieldCheck, label: 'GDPR Compliant' },
              { icon: Shield, label: 'Confidential' },
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12px] font-medium text-white/85">
                <b.icon size={13} className="text-accent" /> {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-line-soft p-6 sm:p-10">
        {/* SECTION A: TAX */}
        <SectionLabel icon={Receipt}>Tax Registration Details</SectionLabel>

        <div className="flex gap-2 mb-6">
          {['vat', 'notvat'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setVatStatus(t)}
              className={`px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all ${
                vatStatus === t
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface text-ink-muted hover:text-ink'
              }`}
            >
              {t === 'vat' ? 'VAT Registered' : 'Not VAT Registered'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {vatStatus === 'vat' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Field label="VAT Registration Number" placeholder="VAT/XXX/XXXXX" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} valid={vatVerify === 'verified'} />
                </div>
                <div className="sm:self-end">
                  <VerifyBtn status={vatVerify} onClick={verifyVat}>
                    {vatVerify === 'idle' && 'Verify with IRD'}
                    {vatVerify === 'loading' && 'Verifying...'}
                    {vatVerify === 'verified' && 'Verified'}
                    {vatVerify === 'notfound' && 'Not Found'}
                  </VerifyBtn>
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Field
                  label="TIN (Tax Identification Number)" required
                  placeholder="XXXXXXXXX (9 digits)"
                  value={tin}
                  onChange={(e) => setTin(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  valid={tinVerify === 'verified'}
                />
              </div>
              <div className="sm:self-end">
                <VerifyBtn status={tinVerify} onClick={verifyTin}>
                  {tinVerify === 'idle' && 'Verify with IRD'}
                  {tinVerify === 'loading' && 'Verifying...'}
                  {tinVerify === 'verified' && 'Verified'}
                  {tinVerify === 'notfound' && 'Not Found'}
                </VerifyBtn>
              </div>
            </div>
          </div>
        </div>

        {/* EPF */}
        <div className="mt-7 rounded-[12px] border border-line-soft p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-sm text-ink">
              EPF Registration Number <span className="text-xs font-normal text-ink-muted">(Employees Provident Fund)</span>
            </p>
            <div className="flex gap-4 text-[13px]">
              {[
                ['registered', 'Registered'],
                ['notyet', 'Not Yet Registered'],
                ['na', 'Not Applicable'],
              ].map(([v, l]) => (
                <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="epf" checked={epf === v} onChange={() => setEpf(v)} className="accent-accent" />
                  {l}
                </label>
              ))}
            </div>
          </div>
          {epf === 'registered' && (
            <div className="mt-4 sm:max-w-xs anim-fade-up">
              <Field label="EPF Number" placeholder="EPF/XXXXXXXX" value={epfNo} onChange={(e) => setEpfNo(e.target.value)} />
            </div>
          )}
        </div>

        {/* ETF */}
        <div className="mt-4 rounded-[12px] border border-line-soft p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-sm text-ink">
              ETF Registration Number <span className="text-xs font-normal text-ink-muted">(Employees Trust Fund)</span>
            </p>
            <div className="flex gap-4 text-[13px]">
              {[
                ['registered', 'Registered'],
                ['notyet', 'Not Yet Registered'],
                ['na', 'Not Applicable'],
              ].map(([v, l]) => (
                <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="etf" checked={etf === v} onChange={() => setEtf(v)} className="accent-accent" />
                  {l}
                </label>
              ))}
            </div>
          </div>
          {etf === 'registered' && (
            <div className="mt-4 sm:max-w-xs anim-fade-up">
              <Field label="ETF Number" placeholder="XXXXXXXXX" value={etfNo} onChange={(e) => setEtfNo(e.target.value)} />
            </div>
          )}
        </div>

        {/* SECTION B: ANNUAL TURNOVER */}
        <div className="mt-12">
          <SectionLabel icon={TrendingUp}>Annual Financial Information</SectionLabel>
          <p className="text-xs text-ink-muted -mt-1 mb-5">Required for financial assessment</p>

          <div className="rounded-[12px] border border-line-soft overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] bg-[#F8F9FA] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              <span>Financial Year</span>
              <span>Annual Turnover (LKR)</span>
            </div>
            {[
              ['y1', '2022 / 2023'],
              ['y2', '2023 / 2024'],
              ['y3', '2024 / 2025'],
            ].map(([key, label]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center border-t border-line-soft px-5 py-3">
                <span className="text-sm font-medium text-ink">{label}</span>
                <Field
                  placeholder="0.00"
                  value={yearsData[key]}
                  onChange={(e) => setYearsData({ ...yearsData, [key]: e.target.value.replace(/[^\d.]/g, '') })}
                  prefix="LKR"
                />
              </div>
            ))}
          </div>

          {values.length >= 2 && (
            <div className="mt-5 rounded-[12px] bg-surface border border-line-soft p-5 anim-fade-up">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                Trend:{' '}
                {trend === 'up' && <span className="text-success inline-flex items-center gap-1"><TrendingUp size={15} /> Growing</span>}
                {trend === 'down' && <span className="text-danger inline-flex items-center gap-1"><TrendingUp size={15} className="rotate-180" /> Declining</span>}
                {trend === 'stable' && <span className="text-ink-muted">Stable</span>}
              </div>
              <div className="mt-4 flex items-end gap-6 h-24">
                {bars.map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-bold text-ink">{(b.v / 1000000).toFixed(1)}M</span>
                    <div
                      className="w-14 rounded-t-[6px] bg-gradient-to-t from-accent to-accent-hover"
                      style={{ height: `${Math.max(b.p, 6)}px` }}
                    />
                    <span className="text-[11px] text-ink-muted">Yr {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
            <FileText size={14} className="shrink-0" />
            Supported by audited financial statements to be uploaded in Step 5
          </p>
        </div>

        {/* SECTION C: BANK */}
        <div className="mt-12">
          <SectionLabel icon={Landmark}>Banking Information</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select label="Bank Name" required options={banks} placeholder="Search or select your bank" value={bank} onChange={(e) => { setBank(e.target.value); setBranch('') }} />
            <Select
              label="Branch Name" required
              placeholder="e.g., Colombo Fort, Kandy Main"
              options={branchesByBank[bank] || []}
              value={branch} onChange={(e) => setBranch(e.target.value)}
              helper={bank ? '' : 'Select a bank first'}
            />
            <Field label="Account Name" required placeholder="Exact name as in bank account" helper="Must match your company legal name" value={acctName} onChange={(e) => setAcctName(e.target.value)} />
            <Field label="Account Number" required placeholder="XXXXXXXXXXXXXXXXXX" value={acctNumber} onChange={(e) => setAcctNumber(e.target.value)} helper="Only the last 4 digits will be shown after entry" />
            <div className="sm:col-span-2">
              <p className="mb-3 text-[13px] font-semibold text-ink">Account Type</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RadioCard
                  selected={acctType === 'Current Account'}
                  onClick={() => setAcctType('Current Account')}
                  icon={Wallet}
                  title="Current Account"
                  description="Recommended for businesses"
                />
                <RadioCard
                  selected={acctType === 'Savings Account'}
                  onClick={() => setAcctType('Savings Account')}
                  icon={Wallet}
                  title="Savings Account"
                />
              </div>
            </div>
            <Field label="SWIFT / BIC Code" placeholder="XXXXXXXX" helper="For international payments (optional)" value={swift} onChange={(e) => setSwift(e.target.value)} />
          </div>
        </div>

        {/* SECTION D: INSURANCE */}
        <div className="mt-12">
          <SectionLabel icon={Shield}>Insurance Coverage</SectionLabel>
          <div className="space-y-4">
            {insurances.map((ins, i) => (
              <InsuranceCard key={ins.title} data={ins} onChange={(v) => setIns(i, v)} />
            ))}
          </div>
        </div>

        {/* SECTION E: FINANCIAL REFERENCES */}
        <div className="mt-12">
          <SectionLabel icon={Users}>Financial References</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Major Customer (Largest client)" placeholder="Company name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            <Field label="Relationship Period" placeholder="e.g., 3 years" value={custPeriod} onChange={(e) => setCustPeriod(e.target.value)} />
            <Field label="Annual Value (LKR)" placeholder="Approx. annual value" value={custValue} onChange={(e) => setCustValue(e.target.value)} />
            <Field label="Major Supplier (Main supplier)" placeholder="Company name" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            <Field label="Supplier Relationship Period" placeholder="e.g., 2 years" value={supplierPeriod} onChange={(e) => setSupplierPeriod(e.target.value)} />
          </div>
        </div>

        {/* SUMMARY BOX */}
        <div className="mt-10 rounded-[16px] bg-success-light/60 border border-success/30 p-6">
          <p className="flex items-center gap-2 font-heading font-semibold text-[16px] text-ink mb-4">
            <Building2 size={19} className="text-success" /> Financial Summary
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
            <div className="flex justify-between gap-3"><span className="text-ink-muted">VAT Status:</span><span className="font-semibold text-success-dark inline-flex items-center gap-1"><BadgeCheck size={15} /> Registered</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-muted">Tax Compliance:</span><span className="font-semibold text-success-dark inline-flex items-center gap-1"><BadgeCheck size={15} /> TIN Verified</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-muted">EPF Status:</span><span className="font-semibold text-success-dark inline-flex items-center gap-1"><BadgeCheck size={15} /> Registered</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-muted">Banking:</span><span className="font-semibold text-ink">{bank || '—'}</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-muted">Insurance:</span><span className="font-semibold text-success-dark inline-flex items-center gap-1"><BadgeCheck size={15} /> Provided</span></div>
          </div>
          <p className="mt-4 pt-4 border-t border-success/20 text-sm font-semibold text-success-dark">
            ✓ All required financial details provided
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="mt-10 pt-7 border-t border-line-soft flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate('/register/step-3')}>
            <ArrowLeft size={17} /> Back
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              save(
                {
                  vatStatus,
                  vatNumber,
                  vatVerified: vatVerify === 'verified',
                  tin,
                  tinVerified: tinVerify === 'verified',
                  epf: epfNo,
                  etf: etfNo,
                  yearsData,
                  bank,
                  branch,
                  acctName,
                  acctNumber,
                  acctType,
                  swift,
                  insurances,
                  customer,
                  custPeriod,
                  custValue,
                  supplier,
                  supplierPeriod,
                },
                '/register/step-5',
              )
            }
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>Next: Upload Documents <ArrowRight size={17} /></>
            )}
          </Button>
        </div>
        {error && <p className="mt-3 text-center text-sm font-semibold text-danger">{error}</p>}
      </div>
    </RegistrationLayout>
  )
}
