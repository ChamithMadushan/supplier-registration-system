import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Mail, Printer, MoreHorizontal, CalendarDays, Clock3, User, FileText,
  CheckCircle2, XCircle, AlertCircle, Eye, PencilLine, Download, Info, Star, Phone,
  Building2, Wallet, Users, MapPin, TrendingUp, ShieldCheck, Lock, MessageSquareText,
  CheckCheck, Send, History, StickyNote, BadgeCheck,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import { AppStatusBadge, PriorityBadge, DocStatusBadge } from '../../components/admin/Badges'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'

const metaCards = [
  { icon: CalendarDays, label: 'Submitted', value: '08 Jan' },
  { icon: Clock3, label: 'Days Open', value: '7 days' },
  { icon: User, label: 'Assigned', value: 'K. Perera' },
  { icon: FileText, label: 'Documents', value: '10 / 12' },
]

const docs = [
  { name: 'Business Registration Certificate.pdf', size: '1.2 MB', status: 'accepted', note: '' },
  { name: 'Tax Clearance Certificate.pdf', size: '720 KB', status: 'rejected', note: 'Expired - needs re-upload' },
  { name: 'Bank Statement - HNB.pdf', size: '1.8 MB', status: 'rejected', note: 'Not legible' },
  { name: 'Public Liability Insurance.pdf', size: '940 KB', status: 'pending', note: '' },
  { name: 'ISO 9001 Certificate.pdf', size: '1.1 MB', status: 'review', note: '' },
  { name: 'EPF / ETF Registration.pdf', size: '380 KB', status: 'accepted', note: '' },
  { name: 'Certificate of Incorporation.pdf', size: '890 KB', status: 'accepted', note: '' },
  { name: 'VAT Registration Certificate.pdf', size: '610 KB', status: 'accepted', note: '' },
]

const checklist = [
  ['Company registration verified', true],
  ['VAT registration verified', true],
  ['TIN verified', true],
  ['Tax clearance (expired - action req)', false],
  ['Bank details verified', true],
  ['Insurance check pending', 'pending'],
  ['Director IDs verified', true],
  ['Bank statement needs re-upload', false],
  ['References verified (3/3)', true],
]

const criteria = [
  { name: 'Industry Experience', weight: '10pts', score: '10/10', pct: 100, note: '14 years exp ✓' },
  { name: 'Technical Capability', weight: '10pts', score: '8/10', pct: 80, note: 'Good' },
  { name: 'Quality Systems', weight: '8pts', score: '7/8', pct: 88, note: 'ISO 9001 + SLSI ✓' },
  { name: 'Key Personnel', weight: '7pts', score: '5/7', pct: 71, note: 'Acceptable' },
  { name: 'HSE Standards', weight: '5pts', score: '2/5', pct: 40, note: 'No HSE policy' },
]

const pillars = [
  { name: 'Technical', score: '32/40', pct: 80 },
  { name: 'Financial', score: '24/30', pct: 80 },
  { name: 'Compliance', score: '16/20', pct: 80 },
  { name: 'Management', score: '8/10', pct: 80 },
]

const timeline = [
  { date: '15 Jan 2025, 10:30 AM', who: 'K. Perera', color: 'bg-danger', icon: XCircle, text: 'Tax clearance requested from supplier' },
  { date: '13 Jan 2025, 2:15 PM', who: 'System', color: 'bg-warning', icon: RefreshCwIcon, text: 'Document verification stage started' },
  { date: '10 Jan 2025, 11:00 AM', who: 'A. Dias', color: 'bg-success', icon: CheckCircle2, text: 'Initial screening passed' },
  { date: '08 Jan 2025, 3:45 PM', who: 'System', color: 'bg-info', icon: FileText, text: 'Application received. Ref: SRS-2024-001234' },
]

function RefreshCwIcon(p) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg> }

const tabs = [
  { id: 'details', label: 'Details', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'evaluation', label: 'Evaluation', icon: Star },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'history', label: 'History', icon: History },
  { id: 'comms', label: 'Communications', icon: MessageSquareText },
]

function InfoRow({ label, value, sub }) {
  return (
    <div className="flex justify-between gap-4 border-b border-admin-border/70 pb-2.5">
      <dt className="text-[12px] text-admin-muted">{label}</dt>
      <dd className="text-[13px] font-semibold text-admin-text text-right">
        {value}
        {sub && <span className="block text-[11px] font-normal text-success-dark mt-0.5">{sub}</span>}
      </dd>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children, right }) {
  return (
    <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-admin-border">
        <Icon size={18} className="text-accent" />
        <p className="text-[15px] font-semibold font-heading text-admin-text">{title}</p>
        {right && <span className="ml-auto">{right}</span>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function ApplicationReview() {
  const [tab, setTab] = useState('details')
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [toast, setToast] = useState(null)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="ABC Trading (Pvt) Ltd"
        subtitle="Submitted: 08 January 2025 (7 days ago)"
        breadcrumb={[
          { label: 'Home', to: '/admin/dashboard' },
          { label: 'Applications', to: '/admin/applications' },
          { label: 'All Applications', to: '/admin/applications' },
          { label: 'ABC Trading (Pvt) Ltd' },
        ]}
        actions={
          <>
            <Link to="/admin/applications" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-admin-medium hover:text-admin-text">
              <ArrowLeft size={15} /> Back to Applications
            </Link>
            <span className="w-px h-6 bg-admin-border" />
            <AppStatusBadge status="verification" />
            <PriorityBadge priority="medium" />
            <Button variant="ghost" size="sm"><Mail size={15} /> Email Supplier</Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}><Printer size={15} /> Print</Button>
            <Button variant="ghost" size="sm"><MoreHorizontal size={15} /></Button>
          </>
        }
      />

      {/* Meta cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metaCards.map((m) => (
          <div key={m.label} className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-[10px] bg-table-header text-admin-medium flex items-center justify-center shrink-0">
              <m.icon size={20} />
            </span>
            <div>
              <p className="text-[16px] font-bold font-heading text-admin-text leading-none">{m.value}</p>
              <p className="text-[11px] text-admin-muted mt-1">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-6 items-start">
        {/* LEFT */}
        <div className="min-w-0">
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

          {/* DETAILS TAB */}
          {tab === 'details' && (
            <div>
              <SectionCard title="Company Information" icon={Building2} right={<span className="text-[11px] font-bold text-success-dark bg-success-light px-2.5 py-1 rounded-full">✓ Verified</span>}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted mb-3">Basic Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-5">
                  <InfoRow label="Legal Company Name" value="ABC Trading (Pvt) Ltd" />
                  <InfoRow label="Business Reg. Number" value="PV/00123456" sub="✅ Verified at ROC" />
                  <InfoRow label="Trading Name" value="ABC Traders" />
                  <InfoRow label="Date Incorporated" value="15 March 2010" sub="14 years 10 months" />
                  <InfoRow label="Business Type" value="Private Limited Company" />
                  <InfoRow label="Employees" value="51-200" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted mb-3">Contact Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  <div>
                    <p className="text-[13px] font-semibold text-admin-text">John Kamal Perera</p>
                    <p className="text-[11px] text-admin-muted">Managing Director</p>
                    <p className="text-[12px] text-admin-medium mt-1">john@abctrading.lk</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-admin-medium">📞 +94 11 234 5678</p>
                    <p className="text-[12px] text-admin-medium mt-1">📱 +94 77 123 4567</p>
                    <p className="text-[12px] text-admin-medium mt-1">🌐 www.abctrading.lk</p>
                  </div>
                </div>
                <div className="mt-5 rounded-[10px] bg-table-header border border-admin-border px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold text-admin-text">Registered Address</p>
                    <p className="text-[12px] text-admin-medium mt-0.5">123 Main Street, Colombo 03, Western Province, Sri Lanka</p>
                  </div>
                  <button onClick={() => setToast({ type: 'info', message: 'Opening map' })} className="text-[12px] font-semibold text-secondary hover:underline shrink-0">📍 View on Map</button>
                </div>
              </SectionCard>

              <SectionCard title="Supply Categories & Business Details" icon={PackageIcon}>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['🏭 Raw Materials', '💻 IT & Technology', '📦 Consumables'].map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-hover text-[12px] font-semibold">{c}</span>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-5">
                  <InfoRow label="Supplier Type" value="Authorized Distributor" />
                  <InfoRow label="Years in Business" value="14 Years (Since 2010)" />
                  <InfoRow label="Geographic Coverage" value="Island-wide" />
                  <InfoRow label="Annual Turnover" value="LKR 100M - 500M" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted mb-2">Certifications</p>
                <div className="space-y-1.5 mb-5">
                  <p className="text-[13px] text-success-dark">✅ ISO 9001 Quality Management</p>
                  <p className="text-[13px] text-success-dark">✅ SLSI Certification</p>
                  <p className="text-[13px] text-danger">❌ ISO 14001 (Not certified)</p>
                </div>
                <p className="text-[13px] text-admin-medium leading-relaxed">"ABC Trading is a leading authorized distributor of industrial raw materials and IT equipment in Sri Lanka, serving over 200 corporate clients since 2010."</p>
              </SectionCard>

              <SectionCard title="Financial Information" icon={Wallet}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-5">
                  <InfoRow label="VAT" value="VAT/123/45678" sub="✅ Verified with IRD" />
                  <InfoRow label="TIN" value="123456789" sub="✅ Verified with IRD" />
                  <InfoRow label="EPF" value="EPF/00123456" sub="✅ Registered" />
                  <InfoRow label="ETF" value="987654321" sub="✅ Registered" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted mb-2">Annual Turnover Trend</p>
                <div className="flex items-end gap-4 h-[120px] rounded-[10px] bg-table-header border border-admin-border p-4 mb-5">
                  {[['2022/23', 'LKR 45M', 45], ['2023/24', 'LKR 62M', 62], ['2024/25', 'LKR 78M', 78]].map(([y, v, h]) => (
                    <div key={y} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[11px] font-mono font-bold text-admin-text">{v}</span>
                      <div className="w-full bg-white rounded-t-[6px]" style={{ height: `${h}%` }}>
                        <div className="w-full h-full bg-gradient-to-t from-secondary to-info rounded-t-[6px]" />
                      </div>
                      <span className="text-[11px] text-admin-muted">{y}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[12px] text-admin-medium">Bank: Commercial Bank of Ceylon · Colombo Fort Branch · Current Account</p>
                  <p className="text-[12px] text-admin-medium">Account: ●●●●●●●●●●●●●7891</p>
                  <p className="text-[13px] text-success-dark mt-2">✅ Public Liability - LKR 10M - Exp: Dec 2025</p>
                  <p className="text-[13px] text-success-dark">✅ Workmen's Compensation - Exp: June 2025</p>
                </div>
              </SectionCard>

              <SectionCard title="Directors / Partners" icon={Users}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">NIC</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">ID Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Kamal Perera', '851234567V', 'Director', true],
                        ['Nimal Silva', '901234567V', 'Director', true],
                        ['Mala Fernando', '781234567V', 'Director', false],
                      ].map(([n, nic, r, ok]) => (
                        <tr key={n} className="border-t border-[#F0F0F0]">
                          <td className="px-4 py-3 text-[13px] font-semibold text-admin-text">{n}</td>
                          <td className="px-4 py-3 text-[12px] font-mono text-admin-medium">{nic}</td>
                          <td className="px-4 py-3 text-[12px] text-admin-medium">{r}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ok ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                              {ok ? '✅ Verified' : '⚠️ Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {tab === 'documents' && (
            <SectionCard title="Submitted Documents" icon={FileText}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] text-admin-medium">10 of 12 documents submitted</p>
                <span className="text-[12px] font-bold text-accent-hover font-mono">83%</span>
              </div>
              <div className="h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden mb-6">
                <div className="h-full rounded-full bg-gradient-to-r from-success to-info" style={{ width: '83%' }} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                      <th className="px-4 py-3">Document Name</th>
                      <th className="px-4 py-3">Upload Date</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Reviewer Note</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.name} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2.5">
                            <FileText size={16} className="text-secondary shrink-0" />
                            <span className="text-[12px] font-medium text-admin-text">{d.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-admin-medium">08 Jan 2025</td>
                        <td className="px-4 py-3 text-[12px] text-admin-medium">{d.size}</td>
                        <td className="px-4 py-3"><DocStatusBadge status={d.status} /></td>
                        <td className="px-4 py-3 text-[11px] text-admin-medium">{d.note || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setToast({ type: 'info', message: 'Opening preview' })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info" title="View"><Eye size={14} /></button>
                            {d.status === 'pending' && (
                              <button onClick={() => setToast({ type: 'success', message: `${d.name} approved` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-success-dark hover:bg-success-light" title="Approve"><CheckCircle2 size={14} /></button>
                            )}
                            <button onClick={() => setToast({ type: 'danger', message: `${d.name} rejected` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-danger hover:bg-danger-light" title="Reject"><XCircle size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {/* EVALUATION TAB */}
          {tab === 'evaluation' && (
            <div>
              <SectionCard title="Supplier Evaluation Scorecard" icon={Star} right={<span className="text-[11px] font-semibold text-admin-muted">Evaluator: K. Perera · 15 Jan 2025</span>}>
                <div className="flex items-center gap-8">
                  <div className="relative w-[130px] h-[130px] shrink-0">
                    <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
                      <circle cx="65" cy="65" r="54" fill="none" stroke="#E9ECEF" strokeWidth="12" />
                      <circle cx="65" cy="65" r="54" fill="none" stroke="#28A745" strokeWidth="12" strokeLinecap="round" strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * 0.2} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[26px] font-bold font-heading text-admin-text">80</span>
                      <span className="text-[10px] text-admin-muted">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-admin-text">TOTAL SCORE</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-success-dark bg-success-light px-3 py-1.5 rounded-full">
                      <CheckCircle2 size={14} /> APPROVED - Preferred Supplier
                    </p>
                    <p className="mt-2 text-[11px] text-admin-muted">Score Range: 80-89 = Approved - Preferred Supplier</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Pillar 1: Technical (40 Points)" icon={SettingsIcon}>
                <div className="space-y-4">
                  {criteria.map((c) => (
                    <div key={c.name}>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <p className="text-[13px] font-semibold text-admin-text">{c.name}</p>
                        <span className="text-[11px] text-admin-muted font-mono">{c.weight}</span>
                        <span className="ml-auto text-[12px] font-bold text-admin-text font-mono">{c.score} ({c.pct}%)</span>
                      </div>
                      <div className="h-2 bg-[#E9ECEF] rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full bg-gradient-to-r from-secondary to-info" style={{ width: `${c.pct}%` }} />
                      </div>
                      <p className="text-[11px] text-admin-muted">{c.note}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Evaluation Summary" icon={BarIcon}>
                <div className="space-y-2.5">
                  {pillars.map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="w-32 text-[12px] font-medium text-admin-text">Pillar {p.name}:</span>
                      <span className="text-[12px] font-mono font-bold text-admin-text w-14">{p.score}</span>
                      <div className="flex-1 h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-success to-info" style={{ width: `${p.pct}%` }} />
                      </div>
                      <span className="text-[11px] font-mono text-admin-muted w-9">{p.pct}%</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-admin-border flex items-center gap-3">
                    <span className="w-32 text-[13px] font-bold text-admin-text">TOTAL:</span>
                    <span className="text-[13px] font-mono font-bold text-accent-hover w-14">80/100</span>
                    <div className="flex-1 h-3 bg-[#E9ECEF] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: '80%' }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-accent-hover w-9">80%</span>
                  </div>
                </div>
                <div className="mt-5 rounded-[10px] bg-success-light border border-success/25 px-4 py-3">
                  <p className="text-[13px] font-bold text-success-dark">🎯 RECOMMENDATION: ✅ APPROVED (Preferred Supplier)</p>
                </div>
              </SectionCard>
            </div>
          )}

          {/* NOTES TAB */}
          {tab === 'notes' && (
            <SectionCard title="Internal Notes" icon={StickyNote} right={<span className="text-[11px] font-semibold text-admin-muted">Not visible to supplier</span>}>
              <div className="rounded-[10px] border border-admin-border p-4">
                <p className="text-[12px] font-semibold text-admin-text mb-2">Add Internal Note</p>
                <textarea rows={3} placeholder="Type your note here..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none" />
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <button className="h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium">Tag: General ▾</button>
                  <button className="h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium">Priority: Normal ▾</button>
                  <button className="h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium">📎 Attach File</button>
                  <Button size="sm" className="ml-auto"><Send size={13} /> Add Note</Button>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <div className="rounded-[10px] border border-admin-border p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold">KP</span>
                    <div>
                      <p className="text-[13px] font-semibold text-admin-text">K. Perera <span className="text-admin-muted font-normal">· Procurement Manager</span></p>
                      <p className="text-[11px] text-admin-muted">15 Jan 2025, 10:30 AM</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full">⚠️ ACTION REQUIRED</span>
                  </div>
                  <p className="mt-3 text-[13px] text-admin-medium leading-relaxed">"Tax clearance certificate is expired. Need to request supplier to upload a new one before we can proceed with verification."</p>
                  <div className="mt-3 flex gap-3 text-[12px] font-semibold text-admin-medium">
                    <button className="hover:text-admin-text">✏️ Edit</button>
                    <button className="hover:text-danger">🗑️ Delete</button>
                    <button className="hover:text-secondary">↩️ Reply</button>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <SectionCard title="Activity Timeline" icon={History}>
              <div className="space-y-0">
                {timeline.map((t, i) => (
                  <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < timeline.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-admin-border" />}
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
            </SectionCard>
          )}

          {/* COMMS TAB */}
          {tab === 'comms' && (
            <SectionCard title="Email Communications" icon={MessageSquareText} right={<Button size="sm" onClick={() => setToast({ type: 'success', message: 'Compose modal opened' })}><Mail size={14} /> Send New Email</Button>}>
              <div className="rounded-[10px] border border-admin-border p-5">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center"><Mail size={16} /></span>
                  <div>
                    <p className="text-[13px] font-semibold text-admin-text">Document Request — Sent</p>
                    <p className="text-[11px] text-admin-muted">To: john@abctrading.lk · 15 Jan 2025, 10:35 AM</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-success-dark bg-success-light px-2 py-0.5 rounded-full">SENT</span>
                </div>
                <p className="mt-3 text-[12px] font-semibold text-admin-text">Subject: Additional Documents Required</p>
                <p className="mt-1.5 text-[13px] text-admin-medium leading-relaxed">"Dear Mr. Perera, We note that your tax clearance certificate has expired..."</p>
                <button onClick={() => setToast({ type: 'info', message: 'Expanding email' })} className="mt-2 text-[12px] font-semibold text-secondary hover:underline">View Full Email ▾</button>
              </div>
            </SectionCard>
          )}
        </div>

        {/* RIGHT ACTION PANEL */}
        <div className="space-y-5 xl:sticky xl:top-[76px]">
          {/* Assignment */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">👤 Assignment</p>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-bold">KP</span>
              <div>
                <p className="text-[13px] font-semibold text-admin-text">Kamal Perera</p>
                <p className="text-[11px] text-admin-muted">Procurement Manager</p>
              </div>
            </div>
            <button className="mt-4 w-full h-[36px] rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors">
              🔄 Reassign Application
            </button>
            <div className="mt-3">
              <p className="text-[11px] text-admin-muted mb-1.5">Review Stage</p>
              <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">
                📄 Document Verification <span className="text-admin-muted">▼</span>
              </button>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">📊 Application Progress</p>
            {[
              ['Submitted', '08 Jan', 'done'],
              ['Initial Screening', '10 Jan', 'done'],
              ['Verification', 'Today', 'active'],
              ['Evaluation', 'Pending', 'todo'],
              ['Committee Review', 'Pending', 'todo'],
              ['Decision', 'Pending', 'todo'],
            ].map(([label, date, state]) => (
              <div key={label} className="flex items-center gap-3 py-1.5">
                {state === 'done' ? (
                  <span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center shrink-0"><CheckCircle2 size={12} /></span>
                ) : state === 'active' ? (
                  <span className="w-5 h-5 rounded-full border-[3px] border-accent bg-white shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-admin-border bg-white shrink-0" />
                )}
                <span className={`flex-1 text-[13px] ${state === 'active' ? 'font-bold text-accent-hover' : state === 'done' ? 'text-admin-text' : 'text-admin-muted'}`}>{label}</span>
                <span className="text-[11px] text-admin-muted font-mono">{date}</span>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">✅ Review Checklist</p>
            <ul className="space-y-2.5">
              {checklist.map(([label, ok]) => (
                <li key={label} className="flex items-start gap-2.5">
                  {ok === true ? (
                    <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                  ) : ok === 'pending' ? (
                    <Info size={16} className="text-admin-muted shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-danger shrink-0 mt-0.5" />
                  )}
                  <span className={`text-[12px] ${ok === true ? 'text-admin-text' : ok === 'pending' ? 'text-admin-muted' : 'text-danger-dark font-medium'}`}>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decision panel */}
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <p className="text-[15px] font-semibold font-heading text-admin-text mb-1">⚖️ Make Decision</p>
            <p className="text-[12px] text-admin-muted mb-4">Current Score: 80/100 · Recommendation: <span className="font-bold text-success-dark">✅ Approve</span></p>
            <div className="space-y-2">
              <button onClick={() => setApproveOpen(true)} className="w-full h-[42px] rounded-[8px] bg-success hover:bg-success-dark text-white text-[13px] font-bold transition-colors">✅ APPROVE APPLICATION</button>
              <button onClick={() => setToast({ type: 'info', message: 'Conditional approve modal' })} className="w-full h-[42px] rounded-[8px] bg-teal hover:opacity-90 text-white text-[13px] font-bold transition-colors">⚠️ CONDITIONAL APPROVE</button>
              <button onClick={() => setToast({ type: 'info', message: 'Request info modal' })} className="w-full h-[42px] rounded-[8px] bg-accent hover:bg-accent-hover text-white text-[13px] font-bold transition-colors">📤 REQUEST INFORMATION</button>
              <button onClick={() => setToast({ type: 'info', message: 'Return for more info' })} className="w-full h-[42px] rounded-[8px] bg-[#6C757D] hover:opacity-90 text-white text-[13px] font-bold transition-colors">🔄 RETURN FOR MORE INFO</button>
              <button onClick={() => setRejectOpen(true)} className="w-full h-[42px] rounded-[8px] bg-danger hover:opacity-90 text-white text-[13px] font-bold transition-colors">❌ REJECT APPLICATION</button>
            </div>
            <div className="mt-4 pt-4 border-t border-admin-border space-y-3">
              <div>
                <p className="text-[11px] text-admin-muted mb-1.5">Forward to next stage</p>
                <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">
                  Select Reviewer <span className="text-admin-muted">▼</span>
                </button>
              </div>
              <div>
                <p className="text-[11px] text-admin-muted mb-1.5">Decision Note (required)</p>
                <textarea rows={3} placeholder="Add decision note/reason..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none" />
              </div>
              <Button className="w-full">Submit Decision</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Approve modal */}
      <Modal open={approveOpen} onClose={() => setApproveOpen(false)} title="Confirm Approval" subtitle="Approve the supplier application">
        <div className="rounded-[10px] bg-table-header border border-admin-border px-4 py-3 mb-5">
          <p className="text-[13px] font-semibold text-admin-text">ABC Trading (Pvt) Ltd</p>
          <p className="text-[11px] text-admin-muted font-mono">SRS-2024-001234</p>
        </div>
        <p className="text-[12px] font-semibold text-admin-text mb-2">Approval Type</p>
        <div className="space-y-2 mb-5">
          {['Approved - Preferred Supplier (80+)', 'Approved - Standard', 'Conditionally Approved'].map((a, i) => (
            <label key={a} className="flex items-center gap-2.5 rounded-[8px] border border-admin-border px-3.5 py-2.5 cursor-pointer hover:bg-table-header transition-colors">
              <input type="radio" name="aptype" defaultChecked={i === 0} className="accent-primary" />
              <span className="text-[13px] text-admin-text">{a}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Registration Valid Until</p>
            <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">📅 31 Dec 2025 <span className="text-admin-muted">▼</span></button>
          </div>
          <div>
            <p className="text-[11px] text-admin-muted mb-1.5">Supplier Code</p>
            <input value="SRS-APR-412" className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-[13px] font-mono font-semibold text-admin-text" />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-primary" /> Send notification email
        </label>
      </Modal>

      {/* Reject modal */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Confirm Rejection" subtitle="Reject the supplier application">
        <p className="text-[12px] font-semibold text-admin-text mb-1.5">Rejection Reason (required)</p>
        <textarea rows={3} placeholder="Select reason or type custom..." className="w-full rounded-[8px] border-[1.5px] border-admin-border p-3 text-[13px] placeholder:text-admin-muted focus:border-primary focus:outline-none resize-none mb-5" />
        <p className="text-[12px] font-semibold text-admin-text mb-2">Common Reasons</p>
        <div className="space-y-2">
          {['Insufficient financial stability', 'Failed compliance checks', 'Incomplete documentation', 'Below minimum score threshold', 'Conflict of interest'].map((r) => (
            <label key={r} className="flex items-center gap-2.5 rounded-[8px] border border-admin-border px-3.5 py-2.5 cursor-pointer hover:bg-table-header transition-colors">
              <input type="checkbox" className="accent-primary" />
              <span className="text-[13px] text-admin-text">{r}</span>
            </label>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> Inform supplier of rejection reason</label>
          <label className="flex items-center gap-2 text-[12px] text-admin-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> Allow reapplication after 6 months</label>
        </div>
      </Modal>
    </div>
  )
}

function PackageIcon(p) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg> }
function SettingsIcon(p) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg> }
function BarIcon(p) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 16h8" /><path d="M7 11h12" /><path d="M7 6h3" /></svg> }
