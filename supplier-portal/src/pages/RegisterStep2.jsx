import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, MapPin, Phone, Mail, Search, Check, ArrowLeft, ArrowRight,
  BadgeCheck, XCircle, AlertTriangle, Loader2, Globe, Users, Calendar, Link2, Info,
} from 'lucide-react'
import RegistrationLayout from '../components/RegistrationLayout'
import Field from '../components/ui/Field'
import Select from '../components/ui/Select'
import SectionLabel from '../components/ui/SectionLabel'
import Button from '../components/ui/Button'
import Toggle from '../components/ui/Toggle'
import RadioCard from '../components/ui/RadioCard'
import { Toast } from '../components/ui/Toast'
import { useSaveStep } from '../hooks/useSaveStep'

export const districts = [
  { name: 'Colombo', province: 'Western Province' },
  { name: 'Gampaha', province: 'Western Province' },
  { name: 'Kalutara', province: 'Western Province' },
  { name: 'Kandy', province: 'Central Province' },
  { name: 'Matale', province: 'Central Province' },
  { name: 'Nuwara Eliya', province: 'Central Province' },
  { name: 'Galle', province: 'Southern Province' },
  { name: 'Matara', province: 'Southern Province' },
  { name: 'Hambantota', province: 'Southern Province' },
  { name: 'Jaffna', province: 'Northern Province' },
  { name: 'Kilinochchi', province: 'Northern Province' },
  { name: 'Mannar', province: 'Northern Province' },
  { name: 'Vavuniya', province: 'Northern Province' },
  { name: 'Mullaitivu', province: 'Northern Province' },
  { name: 'Trincomalee', province: 'Eastern Province' },
  { name: 'Batticaloa', province: 'Eastern Province' },
  { name: 'Ampara', province: 'Eastern Province' },
  { name: 'Kurunegala', province: 'North Western Province' },
  { name: 'Puttalam', province: 'North Western Province' },
  { name: 'Anuradhapura', province: 'North Central Province' },
  { name: 'Polonnaruwa', province: 'North Central Province' },
  { name: 'Ratnapura', province: 'Sabaragamuwa Province' },
  { name: 'Kegalle', province: 'Sabaragamuwa Province' },
  { name: 'Badulla', province: 'Uva Province' },
  { name: 'Monaragala', province: 'Uva Province' },
]

const citiesByDistrict = {
  Colombo: ['Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05', 'Colombo 06', 'Colombo 07', 'Colombo 08', 'Colombo 09', 'Colombo 10', 'Colombo 11', 'Colombo 12', 'Colombo 13', 'Colombo 14', 'Colombo 15', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Kesbewa', 'Maharagama', 'Kaduwela', 'Homagama', 'Battaramulla', 'Kolonnawa', 'Sri Jayawardenepura Kotte'],
  Gampaha: ['Gampaha', 'Negombo', 'Ja-Ela', 'Wattala', 'Kelaniya', 'Ragama', 'Kadawatha', 'Minuwangoda', 'Ganemulla', 'Divulapitiya', 'Mirigama'],
  Kalutara: ['Kalutara', 'Panadura', 'Beruwala', 'Horana', 'Bandaragama', 'Aluthgama', 'Wadduwa', 'Matugama'],
  Kandy: ['Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Katugastota', 'Pilimathalawa', 'Kundasale'],
  Matale: ['Matale', 'Dambulla', 'Rattota', 'Ukuwela', 'Sigiriya'],
  'Nuwara Eliya': ['Nuwara Eliya', 'Hatton', 'Nanuoya', 'Talawakelle', 'Maskeliya', 'Kotmale'],
  Galle: ['Galle', 'Ambalangoda', 'Hikkaduwa', 'Bentota', 'Baddegama', 'Elpitiya'],
  Matara: ['Matara', 'Weligama', 'Akuressa', 'Kamburugamuwa', 'Dickwella', 'Hakmana'],
  Hambantota: ['Hambantota', 'Tangalle', 'Ambalantota', 'Tissamaharama', 'Beliatta'],
  Jaffna: ['Jaffna', 'Nallur', 'Chunnakam', 'Point Pedro', 'Chavakachcheri', 'Karainagar'],
  Kilinochchi: ['Kilinochchi', 'Pooneryn'],
  Mannar: ['Mannar', 'Madhu'],
  Vavuniya: ['Vavuniya', 'Cheddikulam'],
  Mullaitivu: ['Mullaitivu', 'Puthukkudiyiruppu'],
  Trincomalee: ['Trincomalee', 'Kinniya', 'Mutur', 'Kantalai'],
  Batticaloa: ['Batticaloa', 'Kattankudy', 'Eravur', 'Valaichchenai', 'Kalkudah'],
  Ampara: ['Ampara', 'Kalmunai', 'Akkaraipattu', 'Sainthamaruthu', 'Dehiattakandiya'],
  Kurunegala: ['Kurunegala', 'Kuliyapitiya', 'Wariyapola', 'Narammala', 'Pannala', 'Ibbagamuwa', 'Nikaweratiya'],
  Puttalam: ['Puttalam', 'Chilaw', 'Wennappuwa', 'Marawila', 'Nattandiya', 'Anamaduwa'],
  Anuradhapura: ['Anuradhapura', 'Kekirawa', 'Tambuttegama', 'Medawachchiya', 'Horowpathana', 'Eppawala'],
  Polonnaruwa: ['Polonnaruwa', 'Hingurakgoda', 'Kaduruwela', 'Medirigiriya'],
  Ratnapura: ['Ratnapura', 'Embilipitiya', 'Balangoda', 'Kuruwita', 'Nivitigala'],
  Kegalle: ['Kegalle', 'Mawanella', 'Rambukkana', 'Warakapola', 'Galigamuwa'],
  Badulla: ['Badulla', 'Bandarawela', 'Haputale', 'Diyatalawa', 'Welimada', 'Passara', 'Mahiyanganaya'],
  Monaragala: ['Monaragala', 'Bibile', 'Wellawaya', 'Sella Kataragama', 'Buttala'],
}

const provinces = ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province', 'North Western Province', 'North Central Province', 'Sabaragamuwa Province', 'Uva Province']

const businessTypes = [
  'Sole Proprietorship (ව්යාපාරය)',
  'Partnership (හවුල්කාරිත්වය)',
  'Private Limited Company',
  'Public Limited Company',
  'NGO / Non-Profit',
  'Government Entity',
  'Other',
]

const employees = [
  { icon: Users, title: '1 - 10', desc: 'Micro' },
  { icon: Users, title: '11 - 50', desc: 'Small' },
  { icon: Users, title: '51 - 200', desc: 'Medium' },
  { icon: Users, title: '201 - 500', desc: 'Medium+', multi: 3 },
  { icon: Users, title: '501 - 1000', desc: 'Large' },
  { icon: Users, title: '1000+', desc: 'Enterprise' },
]

function VerifyButton({ status, onClick, children }) {
  const styles = {
    idle: 'text-primary border-2 border-primary hover:bg-primary hover:text-white',
    loading: 'text-ink-muted border border-line bg-surface cursor-wait',
    verified: 'text-success-dark bg-success-light border-success-light cursor-default',
    notfound: 'text-danger-dark bg-danger-light border-danger-light cursor-default',
    warning: 'text-warning-dark bg-warning-light border-warning-light',
  }
  const icons = {
    idle: Search,
    loading: Loader2,
    verified: BadgeCheck,
    notfound: XCircle,
    warning: AlertTriangle,
  }
  const Icon = icons[status]
  const spin = status === 'loading' ? 'animate-spin' : ''
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === 'loading' || status === 'verified'}
      className={`h-[48px] inline-flex items-center gap-2 px-5 rounded-[8px] text-sm font-semibold transition-colors shrink-0 ${styles[status]}`}
    >
      <Icon size={17} className={spin} />
      {children}
    </button>
  )
}

export default function RegisterStep2() {
  const navigate = useNavigate()
  const { save, saving, error } = useSaveStep(2)
  const [form, setForm] = useState({
    legalName: '', tradingName: '', regNumber: '', regType: '', incorpDate: '',
    country: 'Sri Lanka', employee: '51 - 200', boi: false, boiNumber: '',
    addr1: '', addr2: '', city: '', district: '', province: '', postal: '', maps: '',
    sameAddress: true, busAddr1: '', busAddr2: '', busCity: '', busDistrict: '', busProvince: '', busPostal: '',
    phone: '', fax: '', email: '', website: '', contactPerson: '', contactDesignation: '',
  })
  const [rocStatus, setRocStatus] = useState('idle')
  const [toast, setToast] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const cityOptions = form.district ? citiesByDistrict[form.district] || [] : []

  const handleCity = (e) => {
    const city = e.target.value
    const district = Object.entries(citiesByDistrict).find(([, cities]) => cities.includes(city))?.[0]
    const province = districts.find((d) => d.name === district)?.province
    setForm({ ...form, city, district: district || '', province: province || '' })
  }

  const handleDistrict = (e) => {
    const district = e.target.value
    const province = districts.find((d) => d.name === district)?.province
    setForm({ ...form, district, province: province || '', city: '' })
  }

  const verifyRoc = () => {
    if (!form.regNumber.trim()) {
      setToast({ type: 'warning', message: 'Enter your Business Registration Number first.' })
      return
    }
    setRocStatus('loading')
    setTimeout(() => {
      setRocStatus(form.regNumber.trim().length >= 6 ? 'verified' : 'notfound')
      setToast({
        type: rocStatus,
        message: rocStatus === 'verified' ? 'Registration verified with ROC.' : 'Could not verify - please check the number.',
      })
    }, 1500)
  }

  return (
    <RegistrationLayout
      activeStep={2}
      title="Company Information"
      subtitle="Step 2 of 6 - Tell us about your company"
      progress={33}
      crumb="Step 2: Company"
    >
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-line-soft p-6 sm:p-10">
        {/* SECTION A */}
        <SectionLabel icon={Building2}>Basic Company Information</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field
              label="Legal Company Name" required
              placeholder="Full legal name of your company"
              helper="Enter exact name as in registration certificate (max 200 characters)"
              maxLength={200}
              value={form.legalName} onChange={set('legalName')}
              valid={form.legalName.trim().length >= 3}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Trading Name" placeholder="Brand or trading name (optional)"
              helper="Only if different from legal name"
              value={form.tradingName} onChange={set('tradingName')}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Field
                  label="Business Registration Number" required
                  placeholder="PV/00000 or BRN XXXXXXX"
                  helper="As shown on ROC certificate"
                  value={form.regNumber} onChange={set('regNumber')}
                  valid={form.regNumber.trim().length >= 4}
                />
              </div>
              <div className="sm:self-end">
                <VerifyButton status={rocStatus} onClick={verifyRoc}>
                  {rocStatus === 'idle' && 'Verify with ROC'}
                  {rocStatus === 'loading' && 'Verifying...'}
                  {rocStatus === 'verified' && 'Verified'}
                  {rocStatus === 'notfound' && 'Not Found'}
                </VerifyButton>
              </div>
            </div>
          </div>
          <div>
            <Select
              label="Business Type" required
              placeholder="Select business type"
              options={businessTypes}
              value={form.regType} onChange={set('regType')}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <Field
              label="Date of Incorporation" required type="date"
              placeholder="DD/MM/YYYY"
              value={form.incorpDate} onChange={set('incorpDate')}
            />
          </div>
          <div>
            <Select
              label="Country of Registration" required
              options={['Sri Lanka 🇱🇰', 'India 🇮🇳', 'United Kingdom 🇬🇧', 'United Arab Emirates 🇦🇪', 'Singapore 🇸🇬', 'China 🇨🇳', 'Other']}
              value={form.country} onChange={set('country')}
            />
          </div>
        </div>

        {/* Employees */}
        <p className="mt-8 mb-3 text-[13px] font-semibold text-ink">
          Number of Employees <span className="text-danger">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {employees.map((emp, i) => (
            <RadioCard
              key={emp.title}
              selected={form.employee === emp.title}
              onClick={() => setForm({ ...form, employee: emp.title })}
              icon={i < 3 ? Users : i === 3 ? Users : i === 4 ? Users : Users}
              title={emp.title}
              description={emp.desc}
            />
          ))}
        </div>

        {/* BOI toggle */}
        <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 rounded-[12px] bg-surface border border-line-soft p-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">Are you a BOI Registered Company?</p>
            <p className="text-xs text-ink-muted">Board of Investment of Sri Lanka</p>
          </div>
          <Toggle checked={form.boi} onChange={(v) => setForm({ ...form, boi: v })} />
        </div>
        {form.boi && (
          <div className="mt-4 anim-fade-up">
            <Field
              label="BOI Registration Number" required
              placeholder="BOI/XXXXXXX"
              value={form.boiNumber} onChange={set('boiNumber')}
            />
          </div>
        )}

        {/* SECTION B */}
        <div className="mt-12">
          <SectionLabel icon={MapPin}>Registered Address</SectionLabel>
          <p className="text-xs text-ink-muted -mt-1 mb-5">As per your business registration</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Field
                label="Address Line 1" required placeholder="Building/House No, Street Name"
                value={form.addr1} onChange={set('addr1')}
                valid={form.addr1.trim().length > 0}
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Address Line 2" placeholder="Area, Village, City (optional)"
                value={form.addr2} onChange={set('addr2')}
              />
            </div>
            <div>
              <Select
                label="City" required placeholder="Search your city"
                options={cityOptions}
                value={form.city} onChange={handleCity}
              />
            </div>
            <div>
              <Select
                label="District" required placeholder="Select district"
                options={districts.map((d) => d.name)}
                value={form.district} onChange={handleDistrict}
              />
            </div>
            <div>
              <Select
                label="Province" required placeholder="Auto from district"
                options={provinces}
                value={form.province} onChange={set('province')}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Field
                label="Postal Code" placeholder="XXXXX"
                maxLength={5}
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                helper="Optional"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Field
                label="Google Maps Link" placeholder="Paste your Google Maps location"
                value={form.maps} onChange={set('maps')}
                rightIcon={Link2} helper="Optional"
              />
            </div>
          </div>

          {/* Same address toggle */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-[12px] bg-surface border border-line-soft p-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Business address is the same as registered address</p>
              <p className="text-xs text-ink-muted">If no, a separate business address will be required</p>
            </div>
            <Toggle checked={form.sameAddress} onChange={(v) => setForm({ ...form, sameAddress: v })} yesLabel="Same" noLabel="Different" />
          </div>
          {!form.sameAddress && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 anim-fade-up">
              <div className="sm:col-span-2">
                <Field label="Business Address Line 1" required placeholder="Building/House No, Street Name" value={form.busAddr1} onChange={set('busAddr1')} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Business Address Line 2" placeholder="Area, Village, City" value={form.busAddr2} onChange={set('busAddr2')} />
              </div>
              <div>
                <Select label="City" required placeholder="City" options={cityOptions} value={form.busCity} onChange={handleCity} />
              </div>
              <div>
                <Select label="District" required placeholder="District" options={districts.map((d) => d.name)} value={form.busDistrict} onChange={handleDistrict} />
              </div>
            </div>
          )}
        </div>

        {/* SECTION C */}
        <div className="mt-12">
          <SectionLabel icon={Phone}>Company Contact Information</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Company Phone" required icon={Phone} placeholder="+94 11 XXX XXXX"
              value={form.phone} onChange={set('phone')}
            />
            <Field
              label="Company Fax" icon={Phone} placeholder="+94 11 XXX XXXX"
              value={form.fax} onChange={set('fax')} helper="Optional"
            />
            <Field
              label="Company Email" required icon={Mail} type="email"
              placeholder="info@yourcompany.lk"
              value={form.email} onChange={set('email')}
            />
            <Field
              label="Company Website" icon={Globe} type="url"
              placeholder="https://www.yourcompany.lk"
              value={form.website} onChange={set('website')}
            />
            <Field
              label="Primary Contact Person" required icon={Building2}
              placeholder="Who to contact about this application"
              value={form.contactPerson} onChange={set('contactPerson')}
            />
            <Field
              label="Contact Designation" required icon={Building2}
              placeholder="Their role/title"
              value={form.contactDesignation} onChange={set('contactDesignation')}
            />
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-[12px] bg-info-light border border-info/20 p-4">
            <Info size={18} className="text-info shrink-0 mt-0.5" />
            <p className="text-[13px] text-info-dark">
              Your contact details will be used for all registration communications.
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-10 pt-7 border-t border-line-soft flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate('/register/step-1')}>
            <ArrowLeft size={17} /> Back to Account
          </Button>
          <Button
            variant="primary"
            onClick={() => save(form, '/register/step-3')}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>Next: Business Details <ArrowRight size={17} /></>
            )}
          </Button>
        </div>
        {error && <p className="mt-3 text-center text-sm font-semibold text-danger">{error}</p>}
      </div>
    </RegistrationLayout>
  )
}
