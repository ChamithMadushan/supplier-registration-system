import React, { useState, useEffect } from 'react'
import {
  BellRing, AlertTriangle, CheckCircle2, Info, MessageSquareText, Clock3, Settings2,
  FileText, ShieldAlert, ArrowRight, CheckCheck, Megaphone,
} from 'lucide-react'
import Toggle from '../../components/ui/Toggle'
import Button from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { api } from '../../api/client'

const typeMeta = {
  error: { icon: ShieldAlert, bg: 'bg-danger-light text-danger' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-light text-warning-dark' },
  info: { icon: Clock3, bg: 'bg-secondary/10 text-secondary' },
  success: { icon: CheckCircle2, bg: 'bg-success-light text-success-dark' },
  default: { icon: Info, bg: 'bg-info-light text-info' },
}

const filters = ['All', 'Unread', 'Alerts', 'Updates']

function groupLabel(dateStr) {
  if (!dateStr) return 'Recent'
  const d = new Date(dateStr + 'Z')
  const today = new Date()
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((startToday - startDay) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Notifications() {
  const [toast, setToast] = useState(null)
  const [filter, setFilter] = useState('All')
  const [settings, setSettings] = useState({ alerts: true, updates: true, messages: true, marketing: false })
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.notifications().then((d) => setNotifs(d.notifications || [])).catch(() => {}).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const readIds = new Set(notifs.filter((n) => n.isRead).map((n) => n.id))
  const unread = notifs.filter((n) => !n.isRead)
  const totalUnread = unread.length

  const groups = ['Today', 'Yesterday', 'Recent'].concat(
    Array.from(new Set(notifs.map((n) => groupLabel(n.createdAt)))).filter((g) => !['Today', 'Yesterday', 'Recent'].includes(g)),
  )
  const uniqueGroups = Array.from(new Set(groups)).slice(0, 8)

  const visible = uniqueGroups
    .map((label) => ({
      label,
      items: notifs
        .filter((n) => groupLabel(n.createdAt) === label)
        .filter((n) => {
          if (filter === 'All') return true
          if (filter === 'Unread') return !n.isRead
          if (filter === 'Alerts') return n.type === 'error' || n.type === 'warning'
          if (filter === 'Updates') return n.type === 'success' || n.type === 'info'
          return true
        }),
    }))
    .filter((g) => g.items.length > 0)

  const markRead = async (id) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: 1 } : n)))
    api.markNotificationRead(id).catch(() => {})
    setToast({ type: 'success', message: 'Marked as read' })
  }

  const markAll = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: 1 })))
    api.readAllNotifications().catch(() => {})
    setToast({ type: 'success', message: 'All notifications marked as read' })
  }

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold font-heading text-ink">Notifications</h1>
          <p className="text-sm text-ink-muted mt-1">
            {totalUnread > 0 ? `${totalUnread} unread notification${totalUnread > 1 ? 's' : ''}` : 'You are all caught up'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={markAll} disabled={totalUnread === 0}>
          <CheckCheck size={15} /> Mark all as read
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              filter === f ? 'bg-primary text-white shadow' : 'bg-white text-ink-muted hover:text-ink border border-line-soft'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* List */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-12 text-center">
              <p className="text-sm text-ink-muted">Loading notifications...</p>
            </div>
          )}
          {!loading && visible.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-3">{g.label}</p>
              <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden divide-y divide-line-soft/70">
                {g.items.map((n) => {
                  const meta = typeMeta[n.type] || typeMeta.default
                  const isUnread = !n.isRead
                  return (
                    <div key={n.id} className={`flex items-start gap-4 p-5 ${isUnread ? 'bg-secondary/[0.03]' : ''}`}>
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.bg}`}>
                        <meta.icon size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-[14px] font-semibold text-ink ${isUnread ? 'font-bold' : ''}`}>{n.title}</p>
                          {isUnread && <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-label="Unread" />}
                        </div>
                        <p className={`mt-1 text-[13px] leading-relaxed ${isUnread ? 'text-ink' : 'text-ink-muted'}`}>{n.message}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-4">
                          <span className="text-[11px] text-ink-faint">{n.createdAt}</span>
                          {isUnread && (
                            <button onClick={() => markRead(n.id)} className="text-[11px] font-semibold text-ink-muted hover:text-ink transition-colors">
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {!loading && visible.length === 0 && (
            <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-12 text-center">
              <BellRing size={36} className="mx-auto text-ink-faint" />
              <p className="mt-3 text-sm font-semibold text-ink">No notifications</p>
              <p className="text-xs text-ink-muted mt-1">You are all caught up in this view.</p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-5">
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink mb-5">
              <Settings2 size={17} className="text-secondary" /> Notification Settings
            </p>
            <div className="space-y-5">
              {[
                ['alerts', 'Action alerts', 'Deadlines, expired docs, rejections'],
                ['updates', 'Application updates', 'Stage changes and milestones'],
                ['messages', 'Messages', 'Messages from evaluators'],
                ['marketing', 'News & promotions', 'Announcements and onboarding tips'],
              ].map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-medium text-ink">{label}</p>
                    <p className="text-[11px] text-ink-muted">{desc}</p>
                  </div>
                  <Toggle checked={settings[key]} onChange={(v) => setSettings((s) => ({ ...s, [key]: v }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
              <Megaphone size={17} className="text-accent" /> Notifications Summary
            </p>
            <div className="mt-4 space-y-3">
              {[
                { icon: AlertTriangle, color: 'text-danger', label: 'Action alerts', value: notifs.filter((n) => n.type === 'error' || n.type === 'warning').length },
                { icon: Clock3, color: 'text-warning-dark', label: 'Unread', value: totalUnread },
                { icon: FileText, color: 'text-secondary', label: 'Total notifications', value: notifs.length },
                { icon: CheckCircle2, color: 'text-success-dark', label: 'Read', value: notifs.length - totalUnread },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon size={16} className={s.color} />
                  <span className="flex-1 text-[13px] text-ink-muted">{s.label}</span>
                  <span className="text-[13px] font-bold text-ink font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
