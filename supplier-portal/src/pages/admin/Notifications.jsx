import React, { useState } from 'react'
import {
  Bell, CheckCheck, AlertTriangle, CheckCircle2, Info, Clock3, Star, Mail, X,
  CalendarDays, ShieldAlert, FileClock, UserPlus, Trash2, Settings as SettingsIcon,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { Toast } from '../../components/ui/Toast'

const notifications = [
  { id: 1, icon: AlertTriangle, color: 'bg-danger-light text-danger', title: '5 suppliers have expired documents', desc: 'Compliance breach detected - immediate action required', time: '2h ago', unread: true, type: 'alert', priority: 'high' },
  { id: 2, icon: CheckCircle2, color: 'bg-success-light text-success-dark', title: 'Application SRS-2024-001234 approved', desc: 'ABC Trading (Pvt) Ltd has been approved as Preferred Supplier', time: '3h ago', unread: true, type: 'approval', priority: 'normal' },
  { id: 3, icon: FileClock, color: 'bg-warning-light text-warning-dark', title: '18 suppliers expiring within 30 days', desc: 'Renewal reminders prepared - send before 31 Jan', time: '5h ago', unread: true, type: 'renewal', priority: 'medium' },
  { id: 4, icon: Info, color: 'bg-info-light text-info', title: 'New support ticket #TS-2045', desc: 'DEF Services reported an issue with document upload', time: 'Today, 9:15 AM', unread: false, type: 'support', priority: 'normal' },
  { id: 5, icon: UserPlus, color: 'bg-purple-light text-purple', title: 'New user joined the platform', desc: 'S. Fernando was assigned the Verification Officer role', time: 'Today, 8:30 AM', unread: false, type: 'system', priority: 'low' },
  { id: 6, icon: ShieldAlert, color: 'bg-danger-light text-danger', title: 'Failed login attempt detected', desc: '3 failed attempts for admin@company.lk from IP 192.168.1.44', time: 'Yesterday', unread: false, type: 'security', priority: 'high' },
  { id: 7, icon: Star, color: 'bg-accent/15 text-accent-hover', title: 'Performance review completed', desc: 'Q4 review cycle closed with 405 of 412 suppliers scored', time: 'Yesterday', unread: false, type: 'performance', priority: 'normal' },
  { id: 8, icon: CalendarDays, color: 'bg-info-light text-info', title: 'Committee review scheduled', desc: 'Review meeting set for 20 Jan 2025 at 10:00 AM', time: '2 days ago', unread: false, type: 'system', priority: 'normal' },
  { id: 9, icon: Mail, color: 'bg-warning-light text-warning-dark', title: 'Bulk email campaign completed', desc: 'Renewal reminders sent to 18 suppliers · 94% opened', time: '2 days ago', unread: false, type: 'campaign', priority: 'normal' },
  { id: 10, icon: Clock3, color: 'bg-warning-light text-warning-dark', title: 'Application over SLA', desc: 'SRS-2024-001237 has exceeded the 10-day SLA threshold', time: '3 days ago', unread: false, type: 'alert', priority: 'high' },
]

const tabs = [
  { key: 'all', label: 'All', count: 12 },
  { key: 'unread', label: 'Unread', count: 3 },
  { key: 'alerts', label: 'Alerts', count: 2 },
  { key: 'approvals', label: 'Approvals', count: 1 },
  { key: 'renewals', label: 'Renewals', count: 1 },
  { key: 'system', label: 'System', count: 3 },
]

export default function Notifications() {
  const [tab, setTab] = useState('all')
  const [toast, setToast] = useState(null)
  const [items, setItems] = useState(notifications)

  const filtered = tab === 'all' ? items : tab === 'unread' ? items.filter((n) => n.unread) : items.filter((n) => n.type === tab.slice(0, -1))

  const markAll = () => {
    setItems(items.map((n) => ({ ...n, unread: false })))
    setToast({ type: 'success', message: 'All notifications marked as read' })
  }

  const priorityMap = {
    high: 'bg-danger-light text-danger',
    medium: 'bg-warning-light text-warning-dark',
    normal: 'bg-info-light text-info',
    low: 'bg-table-header text-admin-muted',
  }

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="Notifications"
        subtitle="System alerts, updates and activity"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'System' }, { label: 'Notifications' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <SettingsIcon size={15} /> Preferences
            </button>
            <button onClick={markAll} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <CheckCheck size={15} /> Mark All Read
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <AdminStatCard icon={Bell} iconBg="bg-primary/10 text-primary" border="border-primary" label="Total Notifications" value="48" sub="Last 30 days" />
        <AdminStatCard icon={AlertTriangle} iconBg="bg-danger-light text-danger" border="border-danger" label="Unread" value="3" sub="2 high priority" />
        <AdminStatCard icon={Clock3} iconBg="bg-warning-light text-warning-dark" border="border-warning" label="Action Required" value="7" sub="Expiry & SLA alerts" />
        <AdminStatCard icon={CheckCircle2} iconBg="bg-success-light text-success-dark" border="border-success" label="Resolved (7d)" value="36" sub="75% resolution rate" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-white text-admin-text shadow border-b-2 border-accent' : 'text-admin-light hover:text-admin-text hover:bg-white/70'
            }`}
          >
            {t.label}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-primary text-white' : 'bg-table-header text-admin-muted'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-[#F0F0F0]">
          {filtered.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 px-6 py-4 transition-colors ${n.unread ? 'bg-info-light/20' : 'hover:bg-table-header'}`}>
              {n.unread && <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />}
              <span className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 ${n.color}`}>
                <n.icon size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-[14px] ${n.unread ? 'font-bold' : 'font-semibold'} text-admin-text`}>{n.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${priorityMap[n.priority]}`}>{n.priority}</span>
                </div>
                <p className="text-[12px] text-admin-medium mt-1">{n.desc}</p>
                <p className="text-[11px] text-admin-muted mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {n.unread && (
                  <button onClick={() => setItems(items.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))} aria-label="Mark read" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-success-light hover:text-success-dark transition-colors" title="Mark as read">
                    <CheckCheck size={15} />
                  </button>
                )}
                <button onClick={() => setToast({ type: 'info', message: 'Opening details' })} aria-label="View" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="View">
                  <Info size={15} />
                </button>
                <button onClick={() => setToast({ type: 'danger', message: 'Notification removed' })} aria-label="Delete" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-danger-light hover:text-danger transition-colors" title="Dismiss">
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-admin-border flex items-center justify-between">
          <span className="text-[12px] text-admin-muted">Showing {filtered.length} of 48 notifications</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover">‹</button>
            <button className="w-8 h-8 rounded-[8px] bg-accent text-white text-[12px] font-semibold">1</button>
            <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium hover:bg-table-hover">›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
