import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Info, Package, Tag, FileText, MapPin, Trophy, ClipboardList, ArrowLeft, ArrowRight,
  Plus, X, Check, Sparkles, Factory, ScrollText, Medal, ShoppingCart, Wrench, Briefcase,
} from 'lucide-react'
import RegistrationLayout from '../components/RegistrationLayout'
import SectionLabel from '../components/ui/SectionLabel'
import Field from '../components/ui/Field'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import RadioCard from '../components/ui/RadioCard'
import { useSaveStep } from '../hooks/useSaveStep'

const categories = [
  {
    name: 'Raw Materials', emoji: '🏭', subs: ['Agricultural', 'Chemical', 'Metal', 'Plastic', 'Other'], count: 45,
  },
  {
    name: 'IT & Technology', emoji: '💻', subs: ['Hardware Supply', 'Software & Licensing', 'Network Infrastructure', 'IT Support Services', 'Cybersecurity'], count: 38,
  },
  {
    name: 'Consumables', emoji: '📦', subs: ['Office Supplies', 'Cleaning Materials', 'Safety Products', 'Printing'], count: 52,
  },
  {
    name: 'Vehicles & Equipment', emoji: '🚗', subs: ['Fleet Vehicles', 'Spare Parts', 'Fuel & Lubricants', 'Heavy Equipment'], count: 22,
  },
  {
    name: 'Logistics & Transport', emoji: '🚚', subs: ['Freight & Forwarding', 'Courier Services', 'Crane & Lifting', 'Warehousing'], count: 28,
  },
  {
    name: 'Construction Services', emoji: '🏗️', subs: ['Civil Works', 'Electrical Works', 'Plumbing', 'Painting'], count: 35,
  },
  {
    name: 'Professional Services', emoji: '👔', subs: ['Legal Services', 'Audit & Tax', 'Consulting', 'HR & Training'], count: 29,
  },
  {
    name: 'Facilities & General', emoji: '🧹', subs: ['Cleaning Services', 'Security Services', 'Catering', 'Gardening'], count: 41,
  },
]

const supplierTypes = [
  { icon: Factory, title: 'Manufacturer', desc: 'You directly manufacture products' },
  { icon: ScrollText, title: 'Authorized Distributor', desc: 'Official distributor of brands' },
  { icon: Medal, title: 'Sole Agent', desc: 'Exclusive agent for Sri Lanka' },
  { icon: ShoppingCart, title: 'Dealer / Trader', desc: 'General trading' },
  { icon: Wrench, title: 'Service Provider', desc: 'Provide specific services' },
  { icon: Briefcase, title: 'Professional Consultant', desc: 'Advisory & consulting services' },
]

const provinces = [
  { name: 'Western Province', cities: 'Colombo, Gampaha, Kalutara' },
  { name: 'Central Province', cities: 'Kandy, Matale, Nuwara Eliya' },
  { name: 'Southern Province', cities: 'Galle, Matara, Hambantota' },
  { name: 'Northern Province', cities: 'Jaffna, Kilinochchi, Mannar' },
  { name: 'Eastern Province', cities: 'Trincomalee, Batticaloa, Ampara' },
  { name: 'North Western Province', cities: 'Kurunegala, Puttalam' },
  { name: 'North Central Province', cities: 'Anuradhapura, Polonnaruwa' },
  { name: 'Sabaragamuwa Province', cities: 'Ratnapura, Kegalle' },
  { name: 'Uva Province', cities: 'Badulla, Monaragala' },
]

const years = ['< 1 Year', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years']

const certifications = [
  { code: 'ISO 9001', desc: 'Quality Management' },
  { code: 'ISO 14001', desc: 'Environmental' },
  { code: 'ISO 45001', desc: 'Occupational Safety' },
  { code: 'SLSI / SLS', desc: 'Sri Lanka Standards' },
  { code: 'HACCP', desc: 'Food Safety' },
  { code: 'Other', desc: 'Specify' },
]

const defaultRef = () => ({ company: '', person: '', phone: '', email: '', nature: '', period: '' })

function ReferenceCard({ idx, value, onChange, onRemove }) {
  return (
    <div className="rounded-[12px] border border-line-soft bg-surface/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm text-ink">Reference {idx + 1}</p>
        {idx > 0 && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs font-medium text-danger hover:text-danger/70 transition-colors"
          >
            <X size={14} /> Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company Name" required placeholder="Client company" value={value.company} onChange={(e) => onChange({ ...value, company: e.target.value })} />
        <Field label="Contact Person" required placeholder="Contact name" value={value.person} onChange={(e) => onChange({ ...value, person: e.target.value })} />
        <Field label="Contact Number" required placeholder="+94 7X XXX XXXX" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
        <Field label="Email" placeholder="client@company.lk" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
        <Field label="Nature of Supply" required placeholder="e.g., Office stationery" value={value.nature} onChange={(e) => onChange({ ...value, nature: e.target.value })} />
        <Field label="Period" required placeholder="e.g., 2021 - Present" value={value.period} onChange={(e) => onChange({ ...value, period: e.target.value })} />
      </div>
    </div>
  )
}

export default function RegisterStep3() {
  const navigate = useNavigate()
  const { save, saving, error } = useSaveStep(3)
  const [selected, setSelected] = useState({ 'IT & Technology': true })
  const [subs, setSubs] = useState({ 'IT & Technology': ['Hardware Supply', 'Software & Licensing'] })
  const [expanded, setExpanded] = useState('IT & Technology')
  const [supplierType, setSupplierType] = useState('Manufacturer')
  const [desc, setDesc] = useState('')
  const [uvp, setUvp] = useState('')
  const [coverage, setCoverage] = useState(['Western Province'])
  const [yearsExp, setYearsExp] = useState('5-10 Years')
  const [turnover, setTurnover] = useState('')
  const [certs, setCerts] = useState({ 'ISO 9001': true })
  const [otherCert, setOtherCert] = useState('')
  const [refs, setRefs] = useState([defaultRef(), defaultRef()])

  const toggleCategory = (name) => {
    const next = { ...selected }
    if (next[name]) {
      delete next[name]
    } else {
      next[name] = true
      setExpanded(name)
    }
    setSelected(next)
  }

  const toggleSub = (cat, sub) => {
    const list = subs[cat] || []
    setSubs({
      ...subs,
      [cat]: list.includes(sub) ? list.filter((s) => s !== sub) : [...list, sub],
    })
  }

  const toggleProvince = (name) => {
    setCoverage((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]))
  }

  const quickCoverage = (names) => setCoverage(names)

  const toggleCert = (code) => setCerts((c) => ({ ...c, [code]: !c[code] }))

  const addRef = () => setRefs([...refs, defaultRef()])
  const updateRef = (i, val) => setRefs(refs.map((r, j) => (j === i ? val : r)))
  const removeRef = (i) => setRefs(refs.filter((_, j) => j !== i))

  const selectedCount = Object.keys(selected).length

  return (
    <RegistrationLayout
      activeStep={3}
      title="Business Details"
      subtitle="Step 3 of 6 - Your capabilities and supply categories"
      progress={50}
      crumb="Step 3: Business Details"
    >
      {/* Info alert */}
      <div className="flex items-start gap-3 rounded-[12px] bg-info-light border border-info/20 p-4 mb-6">
        <Info size={19} className="text-info shrink-0 mt-0.5" />
        <p className="text-[13px] text-info-dark leading-relaxed">
          <strong>Important:</strong> Select all categories that accurately describe your business.
          This determines which tenders you'll be invited to.
        </p>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-line-soft p-6 sm:p-10">
        {/* SECTION A: SUPPLY CATEGORIES */}
        <SectionLabel icon={Package}>Supply Categories</SectionLabel>
        <p className="text-xs text-ink-muted -mt-1 mb-5">Select all that apply to your business</p>

        {/* Selected summary bar */}
        {selectedCount > 0 && (
          <div className="sticky top-0 z-10 mb-6 rounded-[12px] bg-accent/10 border border-accent/30 px-4 py-3 flex flex-wrap items-center gap-2 anim-fade-in">
            <span className="text-sm font-semibold text-ink mr-1">Selected:</span>
            {Object.keys(selected).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleCategory(name)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
              >
                {name} <X size={12} />
              </button>
            ))}
            <span className="ml-auto text-xs font-bold text-accent-hover">
              {selectedCount} categor{selectedCount === 1 ? 'y' : 'ies'} selected
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const isSel = !!selected[cat.name]
            return (
              <div
                key={cat.name}
                className={`rounded-[12px] border-2 p-5 transition-all duration-200 cursor-pointer ${
                  isSel
                    ? 'border-accent bg-accent/10'
                    : 'border-line-soft bg-white hover:border-secondary/50 hover:shadow-[var(--shadow-card)]'
                }`}
                onClick={() => toggleCategory(cat.name)}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[40px] leading-none" aria-hidden>{cat.emoji}</span>
                  <span
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isSel ? 'bg-accent border-accent text-white' : 'border-line bg-white'
                    }`}
                  >
                    {isSel && <Check size={14} strokeWidth={3} />}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-[16px] text-ink">{cat.name}</h3>
                <p className="mt-1 text-[13px] text-ink-muted">{cat.subs.join(' • ')}</p>
                <p className="mt-2 text-[13px] font-bold text-accent">{cat.count} suppliers</p>
              </div>
            )
          })}
        </div>

        {/* Expanded sub-categories */}
        {expanded && selected[expanded] && (
          <div className="mt-5 rounded-[12px] border border-line bg-surface p-5 anim-fade-up">
            <p className="font-semibold text-sm text-ink mb-3">
              {expanded} - Select sub-categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categories.find((c) => c.name === expanded)?.subs.map((sub) => {
                const on = (subs[expanded] || []).includes(sub)
                return (
                  <label key={sub} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleSub(expanded, sub)}
                      className="w-4.5 h-4.5 accent-accent"
                    />
                    <span className="text-sm text-ink">{sub}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* SECTION B: SUPPLIER TYPE */}
        <div className="mt-12">
          <SectionLabel icon={Tag}>Type of Supplier</SectionLabel>
          <p className="text-xs text-ink-muted -mt-1 mb-5">How do you supply products/services?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplierTypes.map((t) => (
              <RadioCard
                key={t.title}
                selected={supplierType === t.title}
                onClick={() => setSupplierType(t.title)}
                icon={t.icon}
                title={t.title}
                description={t.desc}
              />
            ))}
          </div>
        </div>

        {/* SECTION C: BUSINESS DESCRIPTION */}
        <div className="mt-12">
          <SectionLabel icon={FileText}>Business Description</SectionLabel>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Field
                as="textarea" textareaRows={5}
                label="Main Products / Services" required
                placeholder="Describe your main products or services, your specialization, and what makes your business unique..."
                value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 500))}
                helper={`${desc.length}/500 characters`}
                valid={desc.trim().length >= 50}
              />
            </div>
            <div>
              <Field
                as="textarea" textareaRows={3}
                label="Unique Value Proposition"
                placeholder="What sets you apart from other suppliers? (Optional)"
                value={uvp} onChange={(e) => setUvp(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION D: GEOGRAPHIC COVERAGE */}
        <div className="mt-12">
          <SectionLabel icon={MapPin}>Geographic Coverage</SectionLabel>
          <p className="text-xs text-ink-muted -mt-1 mb-4">Where can you deliver/provide services?</p>

          <div className="flex flex-wrap gap-2 mb-5">
            <Button size="sm" variant={coverage.length === 9 ? 'primary' : 'ghost'} onClick={() => quickCoverage(provinces.map((p) => p.name))}>
              Island-wide
            </Button>
            <Button size="sm" variant={coverage.length === 1 && coverage[0] === 'Western Province' ? 'primary' : 'ghost'} onClick={() => quickCoverage(['Western Province'])}>
              Western Province Only
            </Button>
            <Button size="sm" variant={coverage.length === 5 ? 'primary' : 'ghost'} onClick={() => quickCoverage(['Western Province', 'Central Province', 'Southern Province', 'North Western Province', 'Sabaragamuwa Province'])}>
              Major Cities
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCoverage([])}>
              Custom Selection
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {provinces.map((p) => {
              const on = coverage.includes(p.name)
              return (
                <label
                  key={p.name}
                  className={`flex items-start gap-3 rounded-[10px] border p-3.5 cursor-pointer transition-all ${
                    on ? 'border-accent bg-accent/10' : 'border-line-soft hover:border-secondary/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleProvince(p.name)}
                    className="mt-0.5 w-4.5 h-4.5 accent-accent"
                  />
                  <span>
                    <span className={`block text-sm font-medium ${on ? 'text-accent-hover' : 'text-ink'}`}>{p.name}</span>
                    <span className="block text-xs text-ink-muted mt-0.5">{p.cities}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* SECTION E: EXPERIENCE & CERTS */}
        <div className="mt-12">
          <SectionLabel icon={Trophy}>Experience &amp; Certifications</SectionLabel>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <p className="mb-3 text-[13px] font-semibold text-ink">Years in Business <span className="text-danger">*</span></p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {years.map((y) => (
                  <RadioCard key={y} selected={yearsExp === y} onClick={() => setYearsExp(y)} title={y} />
                ))}
              </div>
            </div>
            <div>
              <Select
                label="Annual Turnover Range" required
                placeholder="Select turnover range"
                value={turnover} onChange={(e) => setTurnover(e.target.value)}
                options={['Below LKR 25 Million', 'LKR 25M - 100M', 'LKR 100M - 500M', 'LKR 500M - 1 Billion', 'Above LKR 1 Billion']}
              />
            </div>
            <div>
              <p className="mb-3 text-[13px] font-semibold text-ink">Quality Certifications</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {certifications.map((c) => {
                  const on = !!certs[c.code]
                  return (
                    <label
                      key={c.code}
                      className={`rounded-[10px] border p-3.5 cursor-pointer text-center transition-all ${
                        on ? 'border-accent bg-accent/10' : 'border-line-soft hover:border-secondary/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleCert(c.code)}
                        className="hidden"
                      />
                      <span className={`flex items-center justify-center gap-1 font-bold text-sm ${on ? 'text-accent-hover' : 'text-ink'}`}>
                        {on && <Check size={14} strokeWidth={3} />}
                        {c.code}
                      </span>
                      <span className="block text-[11px] text-ink-muted mt-0.5">{c.desc}</span>
                    </label>
                  )
                })}
              </div>
              {certs.Other && (
                <div className="mt-3 anim-fade-up">
                  <Field label="Specify Other Certification" placeholder="e.g., SA8000, CE Marking" value={otherCert} onChange={(e) => setOtherCert(e.target.value)} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CLIENT REFERENCES */}
        <div className="mt-12">
          <SectionLabel icon={ClipboardList}>Client References (Minimum 3)</SectionLabel>
          <p className="text-xs text-ink-muted -mt-1 mb-5">
            Companies you have supplied in the past
          </p>
          <div className="space-y-4">
            {refs.map((r, i) => (
              <ReferenceCard
                key={i}
                idx={i}
                value={r}
                onChange={(v) => updateRef(i, v)}
                onRemove={() => removeRef(i)}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={addRef}>
              <Plus size={15} /> Add Another Reference
            </Button>
            <span className={`text-xs font-bold ${refs.length >= 3 ? 'text-success-dark' : 'text-ink-muted'}`}>
              {refs.length}/3
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-10 pt-7 border-t border-line-soft flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate('/register/step-2')}>
            <ArrowLeft size={17} /> Back
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              save(
                {
                  categories: selected,
                  subCategories: subs,
                  supplierType,
                  description: desc,
                  uniqueValue: uvp,
                  coverage,
                  yearsExperience: yearsExp,
                  turnover,
                  certifications: certs,
                  otherCertification: otherCert,
                  references: refs,
                },
                '/register/step-4',
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
              <>Next: Financial Information <ArrowRight size={17} /></>
            )}
          </Button>
        </div>
        {error && <p className="mt-3 text-center text-sm font-semibold text-danger">{error}</p>}
      </div>
    </RegistrationLayout>
  )
}
