import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu, Bell, HelpCircle, Search, ChevronDown, X, Building2, Settings,
  MessageSquare, LogOut, FileText, ClipboardList, LifeBuoy, CornerDownLeft,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

const statusLabel = {
  in_progress: 'In Progress',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

const docLabel = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
  expired: 'Expired',
}

export default function PortalTopNav({ collapsed, onToggle, onSearch }) {
  const navigate = useNavigate()
  const { user, company, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [userMenu, setUserMenu] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const menuRef = useRef(null)
  const notifRef = useRef(null)
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    api.notifications().then((d) => setNotifs(d.notifications || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    const value = query.trim()
    if (value.length < 2) {
      setResults(null)
      setSearching(false)
      setSearchError(null)
      return
    }
    setSearching(true)
    debounceRef.current = setTimeout(() => {
      api.search(value)
        .then((data) => {
          setResults(data.results)
          setSearchError(null)
        })
        .catch((err) => setSearchError(err.message || 'Search failed'))
        .finally(() => setSearching(false))
    }, 250)
  }, [query])

  const unread = notifs.filter((n) => !n.isRead).length
  const initials = (user?.fullName || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const submitSearch = (e) => {
    e.preventDefault()
    const value = query.trim()
    if (!value) return
    const first = firstResult()
    if (first) {
      first.onClick()
    } else {
      onSearch?.(value)
    }
  }

  const go = (path) => {
    setSearchOpen(false)
    inputRef.current?.blur()
    navigate(path)
  }

  const buildGroups = () => {
    if (!results) return []
    const groups = []
    const apps = results.applications || []
    const docs = results.documents || []
    const notifsList = results.notifications || []
    const tix = results.tickets || []
    if (apps.length) {
      groups.push({
        label: 'Applications',
        icon: ClipboardList,
        items: apps.map((a) => ({
          title: a.referenceNo || a.companyName || 'Application',
          sub: [a.companyName, statusLabel[a.status] || a.status].filter(Boolean).join(' · '),
          onClick: () => go(`/portal/application`),
        })),
      })
    }
    if (docs.length) {
      groups.push({
        label: 'Documents',
        icon: FileText,
        items: docs.map((d) => ({
          title: d.label || d.originalName,
          sub: docLabel[d.status] || d.status || '',
          onClick: () => go(`/portal/documents`),
        })),
      })
    }
    if (notifsList.length) {
      groups.push({
        label: 'Notifications',
        icon: MessageSquare,
        items: notifsList.map((n) => ({
          title: n.title,
          sub: n.message,
          onClick: () => go(`/portal/notifications`),
        })),
      })
    }
    if (tix.length) {
      groups.push({
        label: 'Tickets',
        icon: LifeBuoy,
        items: tix.map((t) => ({
          title: t.subject,
          sub: [t.category, t.status].filter(Boolean).join(' · '),
          onClick: () => go(`/portal/support`),
        })),
      })
    }
    return groups
  }

  const firstResult = () => {
    const groups = buildGroups()
    if (groups.length) return groups[0].items[0]
    return null
  }

  const groups = buildGroups()
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[var(--shadow-nav)] h-16 flex items-center gap-3 px-4 lg:px-6">
      {/* Left */}
      <button
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className="w-10 h-10 flex items-center justify-center rounded-[8px] text-ink-muted hover:bg-surface hover:text-ink transition-colors"
      >
        <Menu size={20} />
      </button>
      <Link to="/portal/dashboard" className="flex items-center gap-2.5 shrink-0">
        <span className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" />
            <path d="M3 9h18M7 17v2M12 17v2M17 17v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <span className="hidden sm:block font-heading font-bold text-[16px] text-primary leading-tight">
          Supplier Portal
        </span>
      </Link>

      {/* Search */}
      <div className="flex-1 flex justify-center px-2">
        <div className="relative w-full max-w-[420px]" ref={searchRef}>
          <form
            onSubmit={submitSearch}
            className={`flex items-center rounded-[8px] border transition-all duration-300 overflow-hidden ${
              searchOpen
                ? 'border-secondary shadow-[var(--shadow-input)]'
                : 'border-line focus-within:border-secondary'
            }`}
          >
            <span className="pl-3 text-ink-faint">
              <Search size={17} />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search applications, documents..."
              aria-label="Search"
              className="flex-1 h-10 bg-transparent px-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
            {searching && (
              <span className="pr-3">
                <svg className="animate-spin w-4 h-4 text-ink-faint" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              </span>
            )}
            {query && !searching && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="pr-3 text-ink-faint hover:text-ink">
                <X size={15} />
              </button>
            )}
          </form>

          {searchOpen && query.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-12 bg-white rounded-[12px] shadow-[var(--shadow-modal)] border border-line-soft overflow-hidden anim-fade-in z-50">
              {searchError ? (
                <div className="px-5 py-8 text-center text-sm text-danger">Search failed. Please try again.</div>
              ) : searching && !results ? (
                <div className="px-5 py-8 text-center text-sm text-ink-muted">Searching…</div>
              ) : total === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-ink">No results for “{query.trim()}”</p>
                  <p className="text-xs text-ink-muted mt-1">Try searching by reference, document name or keyword</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  {groups.map((g) => (
                    <div key={g.label} className="py-1.5">
                      <p className="flex items-center gap-1.5 px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        <g.icon size={12} /> {g.label}
                      </p>
                      {g.items.map((item, i) => (
                        <button
                          key={g.label + i}
                          onClick={item.onClick}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface transition-colors"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-semibold text-ink truncate">{item.title}</span>
                            {item.sub && <span className="block text-xs text-ink-muted truncate mt-0.5">{item.sub}</span>}
                          </span>
                          <CornerDownLeft size={13} className="text-ink-faint shrink-0" />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Help */}
        <button
          onClick={() => navigate('/portal/support')}
          aria-label="Help center"
          title="Help center"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-[8px] text-ink-muted hover:bg-surface hover:text-ink transition-colors"
        >
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-[8px] text-ink-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 min-w-[18px] rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-[340px] max-w-[90vw] bg-white rounded-[12px] shadow-[var(--shadow-modal)] border border-line-soft overflow-hidden anim-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
                <p className="font-semibold text-sm text-ink">Notifications</p>
                <button
                  onClick={() => { setNotifOpen(false); navigate('/portal/notifications') }}
                  className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
                >
                  View all
                </button>
              </div>
              {(notifs.length ? notifs.slice(0, 3) : [{ title: 'No notifications yet', detail: 'Updates about your application will appear here', tag: 'info', isRead: true }]).map((n, i) => (
                <button
                  key={i}
                  onClick={() => setNotifOpen(false)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface transition-colors border-b border-line-soft/60 last:border-0"
                >
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-ink-faint/50' : n.type === 'error' || n.tag === 'danger' ? 'bg-danger' : n.type === 'warning' ? 'bg-warning' : 'bg-success'}`} />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-ink truncate">{n.title}</span>
                    <span className="block text-xs text-ink-muted truncate">{n.message || n.detail}</span>
                  </span>
                  {!n.isRead && <span className="ml-auto text-[9px] font-bold text-white bg-accent px-1.5 py-0.5 rounded-full shrink-0">NEW</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenu(!userMenu)}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-[8px] hover:bg-surface transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[13px] font-bold">
              {initials}
            </span>
            <span className="hidden md:block text-left">
              <span className="block text-[13px] font-semibold text-ink leading-tight">{user?.fullName || 'Supplier'}</span>
              <span className="block text-[11px] text-ink-muted">{company?.legalName || company?.tradingName || 'Supplier Account'}</span>
            </span>
            <ChevronDown size={15} className={`hidden md:block text-ink-muted transition-transform ${userMenu ? 'rotate-180' : ''}`} />
          </button>
          {userMenu && (
            <div
              role="menu"
              className="absolute right-0 top-12 w-56 bg-white rounded-[12px] shadow-[var(--shadow-modal)] border border-line-soft py-1.5 anim-fade-in"
            >
              <div className="px-4 py-2.5 border-b border-line-soft mb-1">
                <p className="text-sm font-semibold text-ink">{user?.fullName}</p>
                <p className="text-xs text-ink-muted">{user?.email}</p>
              </div>
              {[
                { label: 'My Profile', icon: Building2, to: '/portal/profile' },
                { label: 'Settings', icon: Settings },
                { label: 'Switch Language', icon: MessageSquare },
              ].map((m) => (
                <button
                  key={m.label}
                  role="menuitem"
                  onClick={() => { setUserMenu(false); m.to && navigate(m.to) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-ink hover:bg-surface transition-colors"
                >
                  <m.icon size={16} className="text-ink-muted" /> {m.label}
                </button>
              ))}
              <div className="my-1 border-t border-line-soft" />
              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-danger hover:bg-danger-light/40 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
