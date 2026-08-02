import React, { useState } from 'react'
import {
  FileBarChart, Download, Printer, FileText, PieChart, BarChart3, Activity, CalendarDays,
  Clock3, Clock, CalendarClock, TrendingUp, ChevronDown, Send, FolderOpen, Eye, X,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { BarChart, AreaChart, DonutChart, HBarChart } from '../../components/admin/Charts'
import { Toast } from '../../components/ui/Toast'

const reportTypes = [
  { id: 'registrations', label: 'Registration Reports', desc: 'Registrations, approvals, rejections by period', icon: FileText, color: 'bg-primary/10 text-primary' },
  { id: 'performance', label: 'Performance Reports', desc: 'Scorecards, rankings, criteria analysis', icon: Activity, color: 'bg-success-light text-success-dark' },
  { id: 'documents', label: 'Document Reports', desc: 'Compliance, expiry, verification status', icon: FolderOpen, color: 'bg-warning-light text-warning-dark' },
  { id: 'financial', label: 'Financial Reports', desc: 'Spend analysis, category value, budgets', icon: PieChart, color: 'bg-accent/15 text-accent-hover' },
  { id: 'compliance', label: 'Compliance Reports', desc: 'Audit trails, blacklist, regulatory checks', icon: FileBarChart, color: 'bg-purple-light text-purple' },
  { id: 'summary', label: 'Executive Summary', desc: 'Board-ready portfolio snapshots', icon: BarChart3, color: 'bg-teal-light text-teal' },
]

const scheduled = [
  { id: 1, name: 'Weekly Registration Summary', type: 'Registrations', schedule: 'Every Monday · 8:00 AM', last: '13 Jan 2025', next: '20 Jan 2025', recipients: 6, active: true },
  { id: 2, name: 'Monthly Performance Report', type: 'Performance', schedule: '1st of every month · 9:00 AM', last: '01 Jan 2025', next: '01 Feb 2025', recipients: 12, active: true },
  { id: 3, name: 'Expiry Alerts Digest', type: 'Documents', schedule: 'Every Friday · 3:00 PM', last: '10 Jan 2025', next: '17 Jan 2025', recipients: 4, active: false },
  { id: 4, name: 'Quarterly Executive Summary', type: 'Summary', schedule: '01 Jan, 01 Apr, 01 Jul, 01 Oct', last: '01 Jan 2025', next: '01 Apr 2025', recipients: 3, active: true },
]

const recent = [
  { id: 1, name: 'Annual Supplier Performance 2024.pdf', type: 'Performance', generated: '15 Jan 2025 · 9:30 AM', by: 'K. Perera', size: '2.4 MB' },
  { id: 2, name: 'Q4 Registration Trend Report.pdf', type: 'Registrations', generated: '12 Jan 2025 · 2:15 PM', by: 'A. Dias', size: '1.1 MB' },
  { id: 3, name: 'Document Compliance Audit.xlsx', type: 'Documents', generated: '10 Jan 2025 · 11:00 AM', by: 'S. Fernando', size: '860 KB' },
  { id: 4, name: 'Supplier Spend Analysis 2024.xlsx', type: 'Financial', generated: '08 Jan 2025 · 4:45 PM', by: 'K. Perera', size: '3.2 MB' },
  { id: 5, name: 'Blacklist Register Snapshot.pdf', type: 'Compliance', generated: '05 Jan 2025 · 10:20 AM', by: 'System', size: '420 KB' },
]

const regTrend = [
  { label: 'Jan', new: 22, approved: 18, rejected: 2 },
  { label: 'Feb', new: 26, approved: 20, rejected: 3 },
  { label: 'Mar', new: 18, approved: 16, rejected: 4 },
  { label: 'Apr', new: 30, approved: 22, rejected: 2 },
  { label: 'May', new: 28, approved: 24, rejected: 5 },
  { label: 'Jun', new: 35, approved: 26, rejected: 3 },
  { label: 'Jul', new: 24, approved: 22, rejected: 6 },
  { label: 'Aug', new: 32, approved: 25, rejected: 4 },
  { label: 'Sep', new: 29, approved: 27, rejected: 2 },
  { label: 'Oct', new: 38, approved: 30, rejected: 5 },
  { label: 'Nov', new: 31, approved: 28, rejected: 4 },
  { label: 'Dec', new: 34, approved: 29, rejected: 3 },
]

const categoryData = [
  { label: 'Raw Materials', value: 122, color: '#2E86AB' },
  { label: 'IT & Technology', value: 98, color: '#F18F01' },
  { label: 'Services', value: 88, color: '#6F42C1' },
  { label: 'Construction', value: 73, color: '#28A745' },
  { label: 'Logistics', value: 59, color: '#20C997' },
  { label: 'Others', value: 47, color: '#A0AEC0' },
]

const monthlySpend = [
  { label: 'Jan', value: 4.2 },
  { label: 'Feb', value: 4.8 },
  { label: 'Mar', value: 4.1 },
  { label: 'Apr', value: 5.3 },
  { label: 'May', value: 4.9 },
  { label: 'Jun', value: 5.8 },
  { label: 'Jul', value: 5.2 },
  { label: 'Aug', value: 6.1 },
  { label: 'Sep', value: 5.6 },
  { label: 'Oct', value: 6.4 },
  { label: 'Nov', value: 5.9 },
  { label: 'Dec', value: 7.2 },
]

const districtShare = [
  { label: 'Colombo', value: 145 },
  { label: 'Gampaha', value: 82 },
  { label: 'Kandy', value: 61 },
  { label: 'Negombo', value: 44 },
  { label: 'Matara', value: 38 },
  { label: 'Other', value: 117 },
]

export default function Reports() {
  const [toast, setToast] = useState(null)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, schedule and analyze supplier intelligence"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Reports & Analytics' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export
            </button>
            <button onClick={() => setToast({ type: 'success', message: 'Report scheduled' })} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <Send size={15} /> Schedule Report
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={FileBarChart} iconBg="bg-primary/10 text-primary" border="border-primary" label="Reports Generated (30d)" value="47" sub="Avg 2.1 per working day" />
        <AdminStatCard icon={CalendarClock} iconBg="bg-accent/15 text-accent-hover" border="border-accent" label="Scheduled Reports" value="4" sub="2 active · 2 paused" />
        <AdminStatCard icon={Download} iconBg="bg-info-light text-info" border="border-info" label="Total Downloads (30d)" value="318" trend="+24%" trendUp sub="Across 9 report types" />
        <AdminStatCard icon={TrendingUp} iconBg="bg-success-light text-success-dark" border="border-success" label="Report Usage Score" value="92%" sub="Based on open/read rate" />
      </div>

      {/* Report type templates */}
      <div className="mb-5">
        <p className="text-[16px] font-semibold font-heading text-admin-text mb-4">Report Templates</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {reportTypes.map((r) => (
            <button
              key={r.id}
              onClick={() => setToast({ type: 'info', message: `Configuring ${r.label}` })}
              className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 text-left hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all group"
            >
              <span className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${r.color}`}>
                <r.icon size={20} />
              </span>
              <p className="mt-3 text-[14px] font-bold text-admin-text">{r.label}</p>
              <p className="text-[12px] text-admin-muted mt-1 leading-relaxed">{r.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-secondary group-hover:text-primary">
                Configure <span>→</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-5 mb-5">
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[16px] font-semibold font-heading text-admin-text">Registration Trend</p>
            <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-admin-medium border border-admin-border rounded-[8px] px-3 py-1.5 hover:border-admin-border-dark transition-colors">
              2024 <ChevronDown size={13} className="text-admin-muted" />
            </button>
          </div>
          <AreaChart
            data={regTrend}
            series={[
              { key: 'new', label: 'New applications' },
              { key: 'approved', label: 'Approvals' },
              { key: 'rejected', label: 'Rejections' },
            ]}
          />
        </div>
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Suppliers by Category</p>
          <DonutChart segments={categoryData} center="487" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Monthly Spend (LKR M)</p>
          <BarChart data={monthlySpend} color="bg-gradient-to-t from-info to-info" suffix="M" />
        </div>
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Suppliers by District</p>
          <HBarChart
            data={districtShare.map((d) => ({ label: d.label, value: `${d.value}`, color: 'bg-gradient-to-r from-secondary to-info' }))}
            max="160"
          />
        </div>
      </div>

      {/* Scheduled reports */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <div>
            <p className="text-[16px] font-semibold font-heading text-admin-text">Scheduled Reports</p>
            <p className="text-[12px] text-admin-muted">Automated delivery to recipients</p>
          </div>
          <button onClick={() => setToast({ type: 'info', message: 'Creating schedule' })} className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
            + New Schedule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                <th className="px-6 py-3">Report</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Last Run</th>
                <th className="px-4 py-3">Next Run</th>
                <th className="px-4 py-3">Recipients</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduled.map((s) => (
                <tr key={s.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                  <td className="px-6 py-3.5 text-[13px] font-semibold text-admin-text">{s.name}</td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{s.type}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-admin-medium"><CalendarDays size={13} className="text-admin-muted" /> {s.schedule}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{s.last}</td>
                  <td className="px-4 py-3.5 text-[12px] font-semibold text-admin-text">{s.next}</td>
                  <td className="px-4 py-3.5 text-[12px] text-admin-medium">{s.recipients}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.active ? 'bg-success-light text-success-dark' : 'bg-table-header text-admin-muted'}`}>{s.active ? '● Active' : 'Paused'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <div>
            <p className="text-[16px] font-semibold font-heading text-admin-text">Recently Generated</p>
            <p className="text-[12px] text-admin-muted">Latest exports from your team</p>
          </div>
          <button onClick={() => setToast({ type: 'info', message: 'Opening report library' })} className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary">View Library</button>
        </div>
        <div className="divide-y divide-[#F0F0F0]">
          {recent.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 px-6 py-3.5 hover:bg-table-header transition-colors">
              <span className="w-10 h-10 rounded-[10px] bg-table-header text-admin-medium flex items-center justify-center shrink-0"><FileBarChart size={18} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-admin-text truncate">{r.name}</p>
                <p className="text-[11px] text-admin-muted">{r.generated} · by {r.by} · {r.size}</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-table-header text-admin-medium">{r.type}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setToast({ type: 'success', message: 'Report opened' })} aria-label="Open" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Open"><Eye size={15} /></button>
                <button onClick={() => setToast({ type: 'success', message: 'Report downloaded' })} aria-label="Download" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Download"><Download size={15} /></button>
                <button onClick={() => setToast({ type: 'info', message: 'Preparing print view' })} aria-label="Print" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Print"><Printer size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
