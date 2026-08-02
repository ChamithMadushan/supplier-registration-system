import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu, Bell, RefreshCw, HelpCircle, ChevronDown, User, Settings, Lock, ScrollText, LogOut,
  Search, FileText, AlertTriangle, CheckCircle2, ClipboardList, ArrowRight,
} from 'lucide-react'
import { adminApi, getAdminUser, setAdminToken, setAdminUser } from '../../api/adminClient'

const typeColor = {
  danger: 'bg-danger-light text-danger',
  info: 'bg-secondary/10 text-secondary',
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
}

function typeFor(notif) {
  const type = notif.type || ''
  const priority = notif.priority || ''
  if (type === 'alert' || priority === 'high') return 'danger'
  if (type === 'approval' || type === 'account') return 'success'
  if (type === 'document' || type === 'performance' || type === 'report') return 'warning'
  return 'info'
}

function useClickOutside(handler) {
  const ref = useRef(null)
  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])
  return ref
}

export default function AdminTopNav({ collapsed, onToggle }) {
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)

  const notifRef = useClickOutside(() => setNotifOpen(false))
  const userRef = useClickOutside(() => setUserOpen(false))

  const user = getAdminUser()
  const initials = (user?.fullName || 'A')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const loadNotifications = () => {
    adminApi
      .notifications()
      .then((data) => {
        setNotifications(data.data || [])
        setUnread(data.unread || 0)
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    if (notifOpen) loadNotifications()
  }, [notifOpen])

  const handleSignOut = () => {
    adminApi.logout().catch(() => {})
    setAdminToken(null)
    setAdminUser(null)
    navigate('/admin/login')
  }

  const userMenu = [
    { icon: User, label: 'My Profile' },
    { icon: Settings, label: 'Settings' },
    { icon: Lock, label: 'Change Password' },
    { icon: ScrollText, label: 'Activity Log' },
  ]

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b border-admin-border flex items-center gap-4 px-4 sm:px-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      {/* Hamburger */}
      <button
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className="w-9 h-9 rounded-[8px] flex items-center justify-center text-admin-medium hover:bg-table-hover hover:text-admin-text transition-colors"
      >
        <Menu size={19} />
      </button>

      {/* Logo */}
      <div className="hidden md:flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-[8px] bg-navy-800 text-white flex items-center justify-center font-heading font-bold text-[13px]">
          S
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-bold font-heading text-admin-text leading-none">SRS Admin</p>
          <p className="text-[10px] text-admin-muted">Supplier Portal</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="hidden lg:flex items-center gap-1.5 text-[12px] text-admin-muted">
        <span>Home</span>
        <span className="text-admin-muted/50">/</span>
        <span className="text-admin-text font-semibold">Dashboard</span>
      </nav>

      {/* Center search */}
      <div className="flex-1 flex justify-center px-2">
        <div className="relative w-full max-w-[300px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            placeholder="Search suppliers, applications..."
            className="w-full h-9 rounded-[8px] bg-table-header border border-transparent pl-9 pr-16 text-[13px] placeholder:text-admin-muted focus:border-secondary focus:bg-white focus:outline-none transition-colors"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-admin-muted bg-white border border-admin-border rounded-[5px] px-1.5 py-0.5">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button aria-label="Refresh data" title="Refresh data" onClick={loadNotifications} className="w-9 h-9 rounded-full flex items-center justify-center text-admin-medium hover:bg-table-hover transition-colors">
          <RefreshCw size={17} />
        </button>

        <span className="hidden xl:block text-[12px] font-medium text-admin-muted px-2 whitespace-nowrap">
          {today}
        </span>

        <button aria-label="Help" title="Help" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-admin-medium hover:bg-table-hover transition-colors">
          <HelpCircle size={17} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-admin-medium hover:bg-table-hover transition-colors"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-[48px] w-[340px] bg-white rounded-[12px] border border-admin-border shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden anim-modal-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-admin-border">
                <p className="text-[13px] font-bold text-admin-text">Notifications</p>
                {unread > 0 && (
                  <button
                    className="text-[11px] font-semibold text-secondary hover:text-primary"
                    onClick={() => {
                      adminApi.readAllNotifications().then(loadNotifications).catch(() => {})
                    }}
                  >
                    Mark All Read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-4 py-6 text-center text-[12px] text-admin-muted">No notifications yet</p>
                )}
                {notifications.slice(0, 10).map((n) => {
                  const Icon = typeFor(n) === 'danger' ? AlertTriangle : typeFor(n) === 'success' ? CheckCircle2 : typeFor(n) === 'warning' ? FileText : ClipboardList
                  return (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-table-hover transition-colors ${!n.isRead ? 'bg-secondary/[0.03]' : ''}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeColor[typeFor(n)]}`}>
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-admin-text leading-snug">{n.title}</p>
                        {n.description && <p className="text-[11px] text-admin-light mt-0.5 truncate">{n.description}</p>}
                      </div>
                      <span className="text-[10px] text-admin-muted whitespace-nowrap">{n.time?.slice(5, 16) || ''}</span>
                    </div>
                  )
                })}
              </div>
              <Link
                to="/admin/notifications"
                onClick={() => setNotifOpen(false)}
                className="w-full flex items-center justify-center gap-1 py-3 text-[12px] font-semibold text-secondary hover:text-primary hover:bg-table-hover transition-colors border-t border-admin-border"
              >
                View All Notifications <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-[10px] hover:bg-table-hover transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[13px] font-bold">
              {initials}
            </span>
            <span className="hidden md:block text-left leading-tight">
              <span className="block text-[12px] font-semibold text-admin-text">{user?.fullName || 'Admin'}</span>
              <span className="block text-[10px] text-admin-muted">{user?.role || 'Admin'}</span>
            </span>
            <ChevronDown size={14} className={`hidden md:block text-admin-muted transition-transform ${userOpen ? 'rotate-180' : ''}`} />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-[50px] w-[220px] bg-white rounded-[12px] border border-admin-border shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 anim-modal-in z-50">
              <div className="px-4 py-2.5 border-b border-admin-border mb-1">
                <p className="text-[13px] font-bold text-admin-text">{user?.fullName || 'Admin'}</p>
                <p className="text-[11px] text-admin-muted">{user?.email || ''}</p>
              </div>
              {userMenu.map((m) => (
                <button
                  key={m.label}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-admin-medium hover:bg-table-hover hover:text-admin-text transition-colors"
                >
                  <m.icon size={15} className="text-admin-muted" /> {m.label}
                </button>
              ))}
              <div className="my-1.5 h-px bg-admin-border" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-danger hover:bg-danger-light/40 transition-colors"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
