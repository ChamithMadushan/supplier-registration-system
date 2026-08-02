import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Printer, Star, MapPin, Globe, Phone, MessageSquareText,
  Building2, Wallet, Users, FileText, BarChart3, History, ShieldCheck, CalendarDays,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle, Clock3, Award, Download,
  Mail as MailIcon, CheckCheck, Ban,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import { SupplierStatusBadge, DocStatusBadge } from '../../components/admin/Badges'
import { Sparkline, HBarChart } from '../../components/admin/Charts'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'orders', label: 'Orders & Spend', icon: Wallet },
  { id: 'comms', label: 'Communications', icon: MessageSquareText },
  { id: 'history', label: 'Activity', icon: History },
]

const perfData = [
  { label: 'Q1', value: 82 },
  { label: 'Q2', value: 86 },
  { label: 'Q3', value: 88 },
  { label: 'Q4', value: 92 },
]

const criteria = [
  { label: 'Quality', score: 95 },
  { label: 'Delivery', score: 88 },
  { label: 'Pricing', score: 78 },
  { label: 'Responsiveness', score: 92 },
  { label: 'Compliance', score: 90 },
]

const orders = [
  { po: 'PO-2025-0012', item: 'Industrial raw materials', date: '04 Jan 2025', value: 'LKR 2,450,000', status: 'Delivered' },
  { po: 'PO-2024-1188', item: 'Packaging consumables', date: '18 Dec 2024', value: 'LKR 860,000', status: 'Delivered' },
  { po: 'PO-2024-1142', item: 'Office IT equipment', date: '30 Nov 2024', value: 'LKR 1,230,000', status: 'In Transit' },
  { po: 'PO-2024-1090', item: 'Safety equipment', date: '12 Nov 2024', value: 'LKR 540,000', status: 'Delivered' },
]

export default function SupplierDetail() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [toast, setToast] = useState(null)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="ABC Trading (Pvt) Ltd"
        subtitle="SRS-APR-001 · Registered since 08 Jan 2020"
        breadcrumb={[
          { label: 'Home', to: '/admin/dashboard' },
          { label: 'Suppliers', to: '/admin/suppliers' },
          { label: 'Supplier Database', to: '/admin/suppliers' },
          { label: 'ABC Trading (Pvt) Ltd' },
        ]}
        actions={
          <>
            <Link to="/admin/suppliers" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-admin-medium hover:text-admin-text">
              <ArrowLeft size={15} /> Back to Suppliers
            </Link>
            <span className="w-px h-6 bg-admin-border" />
            <SupplierStatusBadge status="strategic" />
            <Button variant="ghost" size="sm" onClick={() => setToast({ type: 'info', message: 'Compose modal opened' })}><Mail size={15} /> Email</Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}><Printer size={15} /> Print</Button>
            <Button variant="ghost" size="sm" onClick={() => setSuspendOpen(true)} className="!text-danger"><Ban size={15} /> Suspend</Button>
          </>
        }
      />

      {/* Profile hero card */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex items-center gap-5">
            <span className="w-20 h-20 rounded-[16px] bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[24px] font-bold font-heading">
              ABC
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[20px] font-bold font-heading text-admin-text">ABC Trading (Pvt) Ltd</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-dark bg-success-light px-2.5 py-1 rounded-full"><Star size={11} /> STRATEGIC SUPPLIER</span>
              </div>
              <p className="text-[12px] text-admin-muted mt-1 font-mono">Supplier Code: SRS-APR-001</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['🏭 Raw Materials', '💻 IT & Technology', '📦 Consumables'].map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-hover text-[12px] font-semibold">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:ml-auto grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-8">
            <div>
              <p className="text-[11px] text-admin-muted">Performance Score</p>
              <p className="text-[22px] font-bold font-heading text-admin-text">92<span className="text-[12px] text-admin-muted font-normal"> / 100</span></p>
            </div>
            <div>
              <p className="text-[11px] text-admin-muted">YTD Spend</p>
              <p className="text-[22px] font-bold font-heading text-admin-text">LKR 5.1M</p>
            </div>
            <div>
              <p className="text-[11px] text-admin-muted">On-time Delivery</p>
              <p className="text-[22px] font-bold font-heading text-admin-text">96%</p>
            </div>
            <div>
              <p className="text-[11px] text-admin-muted">Quality Compliance</p>
              <p className="text-[22px] font-bold font-heading text-admin-text">98%</p>
            </div>
            <div>
              <p className="text-[11px] text-admin-muted">Docs Status</p>
              <p className="text-[22px] font-bold font-heading text-success-dark">12/12</p>
            </div>
            <div>
              <p className="text-[11px] text-admin-muted">Registration Valid</p>
              <p className="text-[16px] font-bold font-heading text-admin-text">31 Dec 2025</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-admin-border flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] text-admin-medium">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-admin-muted" /> 123 Main Street, Colombo 03</span>
          <span className="inline-flex items-center gap-1.5"><Phone size={14} className="text-admin-muted" /> +94 11 234 5678</span>
          <span className="inline-flex items-center gap-1.5"><MailIcon size={14} className="text-admin-muted" /> john@abctrading.lk</span>
          <span className="inline-flex items-center gap-1.5"><Globe size={14} className="text-admin-muted" /> www.abctrading.lk</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-success-dark font-semibold"><ShieldCheck size={14} /> All verifications passed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-1.5 mb-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] text-[13px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'text-admin-light hover:text-admin-text hover:bg-table-header'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-6 items-start">
          <div className="min-w-0 space-y-5">
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">Company Profile</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
                {[
                  ['Legal Name', 'ABC Trading (Pvt) Ltd'],
                  ['Business Reg. No', 'PV/00123456'],
                  ['Incorporation Date', '15 March 2010'],
                  ['Business Type', 'Private Limited Company'],
                  ['Supplier Type', 'Authorized Distributor'],
                  ['Employees', '51 - 200'],
                  ['Annual Turnover', 'LKR 100M - 500M'],
                  ['Geographic Coverage', 'Island-wide'],
                  ['TIN', '123456789'],
                  ['VAT No', 'VAT/123/45678'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between border-b border-admin-border/60 pb-2">
                    <span className="text-admin-muted">{l}</span>
                    <span className="font-semibold text-admin-text text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[15px] font-semibold font-heading text-admin-text mb-2">Key Contacts</p>
              <p className="text-[11px] text-admin-muted mb-4">Primary contacts on file</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'John Kamal Perera', role: 'Managing Director', email: 'john@abctrading.lk', phone: '+94 77 123 4567' },
                  { name: 'Nimali Perera', role: 'Finance Manager', email: 'nimali@abctrading.lk', phone: '+94 77 234 5678' },
                  { name: 'Roshan Silva', role: 'Operations Head', email: 'roshan@abctrading.lk', phone: '+94 77 345 6789' },
                ].map((c) => (
                  <div key={c.name} className="rounded-[10px] border border-admin-border p-4">
                    <p className="text-[13px] font-bold text-admin-text">{c.name}</p>
                    <p className="text-[11px] text-admin-muted">{c.role}</p>
                    <div className="mt-3 space-y-1 text-[11px] text-admin-medium">
                      <p>📧 {c.email}</p>
                      <p>📱 {c.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[15px] font-semibold font-heading text-admin-text">Certifications</p>
                <button onClick={() => setToast({ type: 'info', message: 'Viewing certifications' })} className="text-[12px] font-semibold text-secondary hover:text-primary">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'ISO 9001 Quality Management', status: 'valid', exp: 'Exp: Dec 2026' },
                  { name: 'SLSI Certification', status: 'valid', exp: 'Exp: Mar 2025' },
                  { name: 'ISO 14001 Environmental', status: 'expiring', exp: 'Expires in 12 days' },
                  { name: 'Public Liability Insurance', status: 'valid', exp: 'Exp: Dec 2025' },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-[10px] border border-admin-border px-4 py-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.status === 'valid' ? 'bg-success' : 'bg-warning'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-admin-text truncate">{c.name}</p>
                      <p className={`text-[11px] ${c.status === 'valid' ? 'text-admin-muted' : 'text-warning-dark font-semibold'}`}>{c.exp}</p>
                    </div>
                    {c.status === 'valid' ? <CheckCircle2 size={16} className="text-success" /> : <AlertTriangle size={16} className="text-warning" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5 xl:sticky xl:top-[76px]">
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">Score Trend</p>
              <div className="flex items-end gap-3">
                <span className="text-[30px] font-bold font-heading text-admin-text leading-none">92</span>
                <span className="text-[11px] font-bold text-success-dark bg-success-light px-2 py-0.5 rounded-full mb-1">▲ +10 vs last year</span>
              </div>
              <div className="mt-4">
                <Sparkline data={[70, 74, 78, 80, 82, 86, 88, 92]} width={250} height={60} color="#F18F01" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-admin-muted">
                <span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">Status Overview</p>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle2, label: 'Registration', val: 'Active', color: 'text-success' },
                  { icon: CalendarDays, label: 'Valid Until', val: '31 Dec 2025', color: 'text-admin-text' },
                  { icon: TrendingUp, label: 'Performance Band', val: 'A (90+)', color: 'text-accent-hover' },
                  { icon: FileText, label: 'Documents', val: '12 / 12 verified', color: 'text-success' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <r.icon size={16} className={r.color} />
                    <span className="flex-1 text-[12px] text-admin-medium">{r.label}</span>
                    <span className={`text-[12px] font-bold ${r.color}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">Quick Actions</p>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => setToast({ type: 'success', message: 'Renewal initiated' })}><RefreshCwIcon size={15} /> Trigger Renewal</Button>
                <Button variant="secondary" className="w-full" onClick={() => navigate('/admin/communications')}><MailIcon size={15} /> Compose Email</Button>
                <Button variant="ghost" className="w-full" onClick={() => setToast({ type: 'info', message: 'Performance review started' })}><Star size={15} /> Start Review</Button>
                <Button variant="ghost" className="w-full" onClick={() => setToast({ type: 'info', message: 'Profile archived' })}><ArchiveIcon size={15} /> Archive Profile</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      {tab === 'documents' && (
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
            <div>
              <p className="text-[15px] font-semibold font-heading text-admin-text">Documents Registry</p>
              <p className="text-[11px] text-admin-muted">12 documents · all verified</p>
            </div>
            <button onClick={() => setToast({ type: 'info', message: 'Requesting re-upload' })} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:text-primary"><RefreshCwIcon size={14} /> Request Update</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                  <th className="px-6 py-3">Document</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Business Registration Certificate', 'Legal', '08 Jan 2025', '—', 'accepted'],
                  ['Certificate of Incorporation', 'Legal', '08 Jan 2025', '—', 'accepted'],
                  ['Tax Clearance Certificate', 'Financial', '08 Jan 2025', '31 Jan 2025', 'accepted'],
                  ['VAT Registration Certificate', 'Financial', '08 Jan 2025', '—', 'accepted'],
                  ['TIN Certificate', 'Financial', '08 Jan 2025', '—', 'accepted'],
                  ['Bank Statement (HNB)', 'Financial', '08 Jan 2025', '—', 'accepted'],
                  ['Public Liability Insurance', 'Insurance', '08 Jan 2025', '31 Dec 2025', 'accepted'],
                  ['Workmen\'s Compensation', 'Insurance', '08 Jan 2025', '30 Jun 2025', 'accepted'],
                  ['ISO 9001 Certificate', 'Certification', '08 Jan 2025', '30 Nov 2026', 'accepted'],
                  ['EPF / ETF Registration', 'Statutory', '08 Jan 2025', '—', 'accepted'],
                  ['Director ID Copies', 'Legal', '08 Jan 2025', '—', 'accepted'],
                  ['Reference Letters', 'Other', '08 Jan 2025', '—', 'accepted'],
                ].map(([name, type, up, exp, status]) => (
                  <tr key={name} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-2.5">
                        <FileText size={16} className="text-secondary shrink-0" />
                        <span className="text-[12px] font-medium text-admin-text">{name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{type}</td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{up}</td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{exp}</td>
                    <td className="px-4 py-3.5"><DocStatusBadge status={status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setToast({ type: 'info', message: `Opening ${name}` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View"><EyeIcon size={14} /></button>
                        <button onClick={() => setToast({ type: 'success', message: `${name} downloaded` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Download"><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PERFORMANCE */}
      {tab === 'performance' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[15px] font-semibold font-heading text-admin-text">Quarterly Score Trend</p>
              <span className="text-[12px] font-bold text-success-dark bg-success-light px-2.5 py-1 rounded-full">▲ Improving</span>
            </div>
            <div className="flex items-end gap-4 h-[180px]">
              {perfData.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-admin-text">{d.value}</span>
                  <div className="relative w-full h-[140px] flex justify-center">
                    <div className="absolute bottom-0 w-full max-w-[44px] bg-[#E9ECEF] rounded-t-[8px]" style={{ height: '100%' }} />
                    <div className="absolute bottom-0 w-full max-w-[44px] rounded-t-[8px] bg-gradient-to-t from-accent to-accent-hover" style={{ height: `${d.value}%` }} />
                  </div>
                  <span className="text-[11px] text-admin-muted">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <p className="text-[15px] font-semibold font-heading text-admin-text mb-5">Scorecard Criteria</p>
            <HBarChart
              data={criteria.map((c) => ({ label: c.label, value: `${c.score}`, color: c.score >= 90 ? 'bg-gradient-to-r from-success to-teal' : c.score >= 80 ? 'bg-gradient-to-r from-info to-info' : 'bg-gradient-to-r from-warning to-accent' }))}
              max="100"
            />
          </div>

          <div className="xl:col-span-2 bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[15px] font-semibold font-heading text-admin-text">Review History</p>
              <button onClick={() => setToast({ type: 'info', message: 'Viewing full review history' })} className="text-[12px] font-semibold text-secondary hover:text-primary">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { cycle: 'Annual Review 2024', date: '15 Dec 2024', score: 92, by: 'K. Perera', note: 'Exceptional delivery performance. Recommended for Strategic tier renewal.', badge: 'bg-success-light text-success-dark' },
                { cycle: 'Quarterly Review Q3 2024', date: '30 Sep 2024', score: 88, by: 'A. Dias', note: 'Slight delay in 2 orders. Quality remained high.', badge: 'bg-info-light text-info' },
                { cycle: 'Quarterly Review Q2 2024', date: '30 Jun 2024', score: 86, by: 'S. Fernando', note: 'Pricing became more competitive. No compliance issues.', badge: 'bg-info-light text-info' },
              ].map((r) => (
                <div key={r.cycle} className="flex flex-wrap items-center gap-4 rounded-[10px] border border-admin-border p-4">
                  <span className="w-10 h-10 rounded-full bg-table-header text-admin-medium flex items-center justify-center"><Award size={18} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-admin-text">{r.cycle}</p>
                    <p className="text-[11px] text-admin-muted">{r.date} · Reviewed by {r.by}</p>
                    <p className="text-[12px] text-admin-medium mt-1.5">"{r.note}"</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[20px] font-bold font-heading text-admin-text">{r.score}<span className="text-[11px] text-admin-muted font-normal"> / 100</span></span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.badge}`}>BAND {r.score >= 90 ? 'A' : r.score >= 80 ? 'B' : 'C'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
            <div>
              <p className="text-[15px] font-semibold font-heading text-admin-text">Purchase Orders</p>
              <p className="text-[11px] text-admin-muted">LKR 5.1M total spend this year</p>
            </div>
            <button onClick={() => setToast({ type: 'info', message: 'Creating new PO' })} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:text-primary">+ New Purchase Order</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                  <th className="px-6 py-3">PO Number</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.po} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                    <td className="px-6 py-3.5 text-[12px] font-mono font-semibold text-secondary">{o.po}</td>
                    <td className="px-4 py-3.5 text-[13px] text-admin-text">{o.item}</td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{o.date}</td>
                    <td className="px-4 py-3.5 text-[12px] font-mono font-bold text-admin-text">{o.value}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${o.status === 'Delivered' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMMS */}
      {tab === 'comms' && (
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[15px] font-semibold font-heading text-admin-text">Recent Communications</p>
            <Button size="sm" onClick={() => navigate('/admin/communications')}><MailIcon size={14} /> Open Comms Center</Button>
          </div>
          <div className="space-y-4">
            {[
              { subject: 'Renewal Reminder - Registration expiring soon', to: 'To supplier · 15 Jan 2025', badge: 'SENT', badgeColor: 'bg-success-light text-success-dark' },
              { subject: 'Document Request: Updated Tax Clearance', to: 'To supplier · 08 Jan 2025', badge: 'SENT', badgeColor: 'bg-success-light text-success-dark' },
              { subject: 'Quarterly Performance Scorecard 2024', to: 'To supplier · 16 Dec 2024', badge: 'SENT', badgeColor: 'bg-success-light text-success-dark' },
              { subject: 'Welcome to Strategic Supplier Tier', to: 'To supplier · 02 Dec 2024', badge: 'SENT', badgeColor: 'bg-success-light text-success-dark' },
            ].map((m) => (
              <div key={m.subject} className="rounded-[10px] border border-admin-border p-4 flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0"><MailIcon size={16} /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-admin-text truncate">{m.subject}</p>
                  <p className="text-[11px] text-admin-muted">{m.to}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`}>{m.badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[15px] font-semibold font-heading text-admin-text mb-6">Activity Timeline</p>
          <div className="space-y-0">
            {[
              { color: 'bg-success', icon: CheckCheck, text: 'Annual review completed · Score 92/100', who: 'K. Perera', date: '15 Dec 2024' },
              { color: 'bg-info', icon: MailIcon, text: 'Renewal notice sent', who: 'System', date: '10 Dec 2024' },
              { color: 'bg-success', icon: CheckCircle2, text: 'Documents reverified (12/12)', who: 'A. Dias', date: '02 Dec 2024' },
              { color: 'bg-accent', icon: Award, text: 'Promoted to Strategic Supplier tier', who: 'Committee', date: '02 Dec 2024' },
              { color: 'bg-info', icon: FileText, text: 'Profile last updated', who: 'Supplier', date: '28 Nov 2024' },
              { color: 'bg-warning', icon: Clock3, text: 'Renewal reminder (30-day) sent', who: 'System', date: '01 Dec 2024' },
            ].map((t, i) => (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {i < 5 && <span className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-admin-border" />}
                <span className={`relative z-10 w-8 h-8 rounded-full ${t.color} text-white flex items-center justify-center shrink-0 border-[3px] border-white shadow`}>
                  <t.icon size={14} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-admin-text">{t.text}</p>
                  <p className="text-[11px] text-admin-muted mt-0.5">{t.who} · {t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suspend modal */}
      <Modal open={suspendOpen} onClose={() => setSuspendOpen(false)} title="Suspend Supplier" subtitle="This will remove the supplier from the Approved Vendor List">
        <div className="rounded-[10px] bg-table-header border border-admin-border px-4 py-3 mb-5">
          <p className="text-[13px] font-semibold text-admin-text">ABC Trading (Pvt) Ltd</p>
          <p className="text-[11px] text-admin-muted font-mono">SRS-APR-001</p>
        </div>
        <p className="text-[12px] font-semibold text-admin-text mb-1.5">Reason for suspension (required)</p>
        <textarea rows={3} placeholder="Select reason or type custom..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none mb-4" />
        <div className="space-y-2 mb-5">
          {['Compliance violation', 'Quality issues', 'Delivery failure', 'Fraudulent documentation', 'At supplier request'].map((r) => (
            <label key={r} className="flex items-center gap-2.5 rounded-[8px] border border-admin-border px-3.5 py-2.5 cursor-pointer hover:bg-table-header transition-colors">
              <input type="checkbox" className="accent-primary" />
              <span className="text-[13px] text-admin-text">{r}</span>
            </label>
          ))}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> Notify supplier via email</label>
          <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> Add to blacklist register</label>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-admin-border pt-4">
          <Button variant="ghost" size="sm" onClick={() => setSuspendOpen(false)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => { setSuspendOpen(false); setToast({ type: 'danger', message: 'Supplier suspended' }) }}><Ban size={14} /> Confirm Suspension</Button>
        </div>
      </Modal>
    </div>
  )
}

function RefreshCwIcon(p) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg> }
function EyeIcon(p) { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg> }
function ArchiveIcon(p) { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg> }
