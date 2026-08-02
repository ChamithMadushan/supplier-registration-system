import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, CheckCircle2, RefreshCw, AlertTriangle, CalendarDays, Star, XCircle, Clock3,
  Download, Printer, SlidersHorizontal, ArrowRight, Eye, FileText, ChevronRight, ClipboardList,
  Mail, FileBarChart, Search, PackageOpen, Settings, Plus, Circle,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { AppStatusBadge, PriorityBadge } from '../../components/admin/Badges'
import { AreaChart, DonutChart, Sparkline } from '../../components/admin/Charts'

const regData = [
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

const pendingApps = [
  { ref: 'SRS-001', company: 'ABC Trading', contact: 'John Perera', cat: 'Raw Materials', days: 15, prio: 'high' },
  { ref: 'SRS-002', company: 'XYZ Supplies', contact: 'Nimali Silva', cat: 'IT Equipment', days: 12, prio: 'medium' },
  { ref: 'SRS-003', company: 'DEF Services', contact: 'Ruwan Dias', cat: 'Services', days: 8, prio: 'low' },
  { ref: 'SRS-004', company: 'GHI Constructs', contact: 'Mala Fernando', cat: 'Construction', days: 6, prio: 'low' },
  { ref: 'SRS-005', company: 'JKL Trading', contact: 'Saman Perera', cat: 'Logistics', days: 3, prio: 'low' },
]

const activity = [
  { type: 'success', icon: CheckCircle2, bg: 'bg-success-light text-success-dark', text: 'approved', company: 'ABC Trading', time: '2h ago' },
  { type: 'info', icon: FileText, bg: 'bg-info-light text-info', text: 'docs verified', company: 'DEF Services', time: '4h ago' },
  { type: 'info', icon: RefreshCw, bg: 'bg-secondary/10 text-secondary', text: 'sent for review', company: 'GHI Constructs', time: '5h ago' },
  { type: 'info', icon: ClipboardList, bg: 'bg-purple-light text-purple', text: 'new application', company: 'MNO Ltd', time: 'Today' },
  { type: 'danger', icon: XCircle, bg: 'bg-danger-light text-danger', text: 'rejected', company: 'PQR Trading', time: 'Yesterday' },
  { type: 'warning', icon: Mail, bg: 'bg-warning-light text-warning-dark', text: 'renewal reminder sent (18)', company: 'Bulk', time: 'Yesterday' },
  { type: 'danger', icon: AlertTriangle, bg: 'bg-danger-light text-danger', text: 'documents expired', company: 'STU Ltd', time: '2d ago' },
]

const tasks = [
  { label: 'Review 5 new applications', prio: 'HIGH', done: false },
  { label: 'Approve 3 evaluation-complete apps', prio: 'HIGH', done: false },
  { label: 'Send expiry notices (18 suppliers)', prio: 'MED', done: false },
  { label: 'Monthly performance review meeting', prio: 'MED', done: false },
  { label: 'Morning briefing report', prio: 'LOW', done: true },
  { label: 'Update blacklist register', prio: 'LOW', done: true },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Wednesday, 15 January 2025 • 9:30 AM"
        breadcrumb={[{ label: 'Home' }, { label: 'Dashboard' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export Report
            </button>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Printer size={15} /> Print
            </button>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <SlidersHorizontal size={15} /> Customize
            </button>
          </>
        }
      />

      {/* Alert banner */}
      <div className="mb-6 rounded-[12px] border border-danger/30 bg-danger-light px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-danger text-white flex items-center justify-center shrink-0">
          <AlertTriangle size={20} />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-danger-dark">CRITICAL: 5 suppliers have expired documents</p>
          <p className="text-[12px] text-danger/80 mt-0.5">Immediate action required to maintain compliance</p>
        </div>
        <button
          onClick={() => navigate('/admin/documents')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-danger hover:text-danger-dark transition-colors shrink-0"
        >
          View Expired Suppliers <ArrowRight size={15} />
        </button>
      </div>

      {/* Row 1 stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <AdminStatCard
          icon={Building2} iconBg="bg-primary/10 text-primary" border="border-primary"
          label="Total Registered Suppliers" value="487" trend="+12%" trendUp sub="▲ +34 this month"
          onClick={() => navigate('/admin/suppliers')}
        />
        <AdminStatCard
          icon={CheckCircle2} iconBg="bg-success-light text-success-dark" border="border-success"
          label="Approved Suppliers" value="412" trend="+2%" trendUp sub="84.4% of total · +8 this month"
        />
        <AdminStatCard
          icon={RefreshCw} iconBg="bg-accent/15 text-accent-hover" border="border-accent"
          label="Pending Applications" value="52" sub="⚠️ 23 overdue (>10 days) · Avg wait 8.5d"
          onClick={() => navigate('/admin/applications')}
        />
        <AdminStatCard
          icon={AlertTriangle} iconBg="bg-danger-light text-danger" border="border-danger"
          label="Action Required" value="23" sub="5 expired docs · 18 expiring in 30 days"
        />
      </div>

      {/* Row 2 stats */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <AdminStatCard icon={CalendarDays} iconBg="bg-info-light text-info" label="New This Month" value="34" trend="+18%" trendUp sub="Registrations received in Jan" />
        <AdminStatCard icon={XCircle} iconBg="bg-danger-light text-danger" label="Rejected This Month" value="8" sub="Rejection rate: 19%" />
        <AdminStatCard icon={Clock3} iconBg="bg-warning-light text-warning-dark" label="Expiring (30 days)" value="18" sub="Registrations to renew" onClick={() => navigate('/admin/documents')} />
        <AdminStatCard icon={Star} iconBg="bg-accent/15 text-accent-hover" label="Average Performance Score" value="4.2 / 5.0" sub="Based on 412 suppliers" />
      </div>

      {/* Charts row */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-[60%_40%] gap-5">
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <p className="text-[16px] font-semibold font-heading text-admin-text">Registration Trend (Last 12 Months)</p>
            <div className="flex gap-2">
              {['This Year', 'By Month'].map((x) => (
                <button key={x} className="px-3 py-1.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:bg-table-header transition-colors">
                  {x} <span className="text-admin-muted">▼</span>
                </button>
              ))}
              <button className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-secondary hover:bg-info-light transition-colors">Export</button>
            </div>
          </div>
          <div className="relative">
            <AreaChart
              data={regData}
              series={[
                { key: 'new', label: 'New applications' },
                { key: 'approved', label: 'Approvals' },
                { key: 'rejected', label: 'Rejections' },
              ]}
            />
          </div>
        </div>

        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Suppliers by Category</p>
          <DonutChart segments={categoryData} center="487" />
        </div>
      </div>

      {/* Tables row */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-[55%_45%] gap-5">
        {/* Pending applications */}
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
            <div>
              <p className="text-[16px] font-semibold font-heading text-admin-text">Applications Requiring Action</p>
              <p className="text-[12px] text-admin-muted">Sorted by priority</p>
            </div>
            <button onClick={() => navigate('/admin/applications')} className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                  <th className="px-6 py-3">Ref #</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.map((a) => (
                  <tr key={a.ref} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                    <td className="px-6 py-3.5 text-[12px] font-mono font-semibold text-secondary">{a.ref}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] font-semibold text-admin-text">{a.company}</p>
                      <p className="text-[11px] text-admin-muted">{a.contact}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">{a.cat}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[12px] font-semibold font-mono ${a.days > 10 ? 'text-danger' : a.days > 5 ? 'text-accent-hover' : 'text-admin-medium'}`}>
                        {a.days}d
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><PriorityBadge priority={a.prio} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => navigate('/admin/applications/review')}
                        className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors"
                      >
                        <Eye size={13} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3.5 border-t border-admin-border text-[12px] text-admin-muted flex items-center justify-between">
            <span>Showing 5 of 52</span>
            <button onClick={() => navigate('/admin/applications')} className="text-[12px] font-semibold text-secondary hover:text-primary">Load More</button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
            <p className="text-[16px] font-semibold font-heading text-admin-text">Recent Activity</p>
            <button className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-table-header transition-colors">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${a.bg}`}>
                  <a.icon size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-admin-text">
                    <span className="font-semibold">{a.company}</span> <span className="text-admin-light">{a.text}</span>
                  </p>
                </div>
                <span className="text-[11px] text-admin-muted whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tasks */}
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[16px] font-semibold font-heading text-admin-text">My Tasks Today</p>
            <span className="text-[12px] font-bold text-success-dark bg-success-light px-2.5 py-1 rounded-full">3/6 done</span>
          </div>
          <p className="text-[11px] text-admin-muted mb-4">Progress: 50%</p>
          <div className="space-y-2">
            {tasks.map((t) => (
              <label key={t.label} className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 hover:bg-table-header transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked={t.done} className="w-4 h-4 rounded accent-primary" />
                <span className={`flex-1 text-[13px] ${t.done ? 'line-through text-admin-muted' : 'text-admin-text font-medium'}`}>{t.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.prio === 'HIGH' ? 'bg-danger-light text-danger' : t.prio === 'MED' ? 'bg-warning-light text-warning-dark' : 'bg-success-light text-success-dark'}`}>
                  {t.prio}
                </span>
              </label>
            ))}
          </div>
          <button className="mt-3 w-full h-[36px] rounded-[8px] border border-dashed border-admin-border-dark text-[12px] font-semibold text-admin-light hover:text-admin-text hover:border-secondary transition-colors">
            + Add Task
          </button>
        </div>

        {/* Expiry widget */}
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[16px] font-semibold font-heading text-admin-text mb-1">Expiring Soon</p>
          <p className="text-[11px] text-admin-muted mb-5">Document & registration expiry</p>
          <div className="space-y-3">
            {[
              { color: 'bg-danger', label: '5 EXPIRED', sub: 'Act now - documents invalid', count: 5 },
              { color: 'bg-warning', label: '3 expiring within 7 days', sub: 'Urgent renewal needed', count: 3 },
              { color: 'bg-accent', label: '8 expiring within 15 days', sub: 'Prepare renewal', count: 8 },
              { color: 'bg-warning', label: '18 expiring within 30 days', sub: 'Bulk reminder available', count: 18 },
            ].map((e) => (
              <div key={e.label} className="flex items-center gap-3 rounded-[10px] border border-admin-border px-3.5 py-3">
                <span className={`w-2.5 h-2.5 rounded-full ${e.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-admin-text">{e.label}</p>
                  <p className="text-[11px] text-admin-muted">{e.sub}</p>
                </div>
                <span className="text-[14px] font-bold font-heading text-admin-text">{e.count}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/admin/documents')}
            className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary transition-colors"
          >
            View Expiry Report <ArrowRight size={14} />
          </button>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[16px] font-semibold font-heading text-admin-text mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: ClipboardList, label: 'New Application Entry', to: '/admin/applications' },
              { icon: Mail, label: 'Bulk Email Suppliers', to: '/admin/communications' },
              { icon: FileBarChart, label: 'Generate Report', to: '/admin/reports' },
              { icon: Search, label: 'Search Supplier', to: '/admin/suppliers' },
              { icon: PackageOpen, label: 'Export AVL', to: '/admin/suppliers' },
              { icon: Settings, label: 'System Settings', to: '/admin/settings' },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-admin-border py-4 text-center hover:border-secondary hover:bg-info-light/30 transition-all group"
              >
                <span className="w-10 h-10 rounded-[10px] bg-table-header text-admin-medium group-hover:bg-secondary group-hover:text-white flex items-center justify-center transition-colors">
                  <a.icon size={18} />
                </span>
                <span className="text-[11px] font-semibold text-admin-text px-1">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
