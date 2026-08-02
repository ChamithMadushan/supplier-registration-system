import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, FolderOpen, Building2, BarChart3, Bell,
  MessageSquare, LifeBuoy, Settings, LogOut, Clock, RefreshCw, Lock, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function initialsOf(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function statusMeta(status = '') {
  const key = (status || 'draft').toLowerCase()
  if (['approved', 'active'].includes(key)) {
    return { label: 'Approved', cls: 'text-success-dark bg-success-light', dot: 'bg-success', pulse: false }
  }
  if (['rejected', 'blacklisted'].includes(key)) {
    return { label: 'Rejected', cls: 'text-danger bg-danger-light', dot: 'bg-danger', pulse: false }
  }
  if (['submitted', 'under_review', 'review', 'evaluation'].includes(key)) {
    return { label: 'Under Review', cls: 'text-info bg-info-light', dot: 'bg-info', pulse: true }
  }
  return { label: 'In Progress', cls: 'text-warning-dark bg-warning-light/90', dot: 'bg-warning', pulse: true }
}

const menuTop = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/portal/dashboard' },
  { label: 'My Application', icon: FileText, to: '/portal/application' },
  { label: 'My Documents', icon: FolderOpen, to: '/portal/documents' },
  { label: 'Company Profile', icon: Building2, to: '/portal/profile' },
  { label: 'Performance', icon: BarChart3, to: '/portal/performance', soon: true },
  { label: 'Notifications', icon: Bell, to: '/portal/notifications', badge: 3 },
  { label: 'Messages', icon: MessageSquare, to: '/portal/dashboard' },
  { label: 'Support & Help', icon: LifeBuoy, to: '/portal/support' },
]

const menuBottom = [
  { label: 'Settings', icon: Settings, to: '/portal/dashboard' },
]

export default function PortalSidebar({ collapsed, onNavigate }) {
  const navigate = useNavigate()
  const [userMenu, setUserMenu] = useState(false)
  const { user, company, application } = useAuth()

  const companyName = company?.legalName || company?.tradingName || 'Your Company'
  const companyInitials = initialsOf(companyName)
  const companyLogo = company?.logo || company?.logoPath ? `/${String(company?.logo || company?.logoPath).replace(/^\/+/, '')}` : null
  const reference = application?.referenceNo || company?.code || ''
  const status = statusMeta(application?.status)
  const userInitials = initialsOf(user?.fullName) || 'U'
  const userName = user?.fullName || 'User'
  const designation = user?.designation || 'Supplier'

  const CompanyAvatar = ({ sizeClass }) =>
    companyLogo ? (
      <img src={companyLogo} alt={companyName} className={`${sizeClass} rounded-full object-cover bg-white`} />
    ) : (
      <span className={`${sizeClass} rounded-full bg-accent text-white flex items-center justify-center font-heading font-bold`}>
        {companyInitials}
      </span>
    )

  const Item = ({ item, isBottom }) => (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-[8px] text-left transition-all duration-200 ${
          collapsed ? 'justify-center px-0 h-[48px] w-[48px] mx-auto' : 'px-4 h-[48px]'
        } ${
          isActive
            ? 'bg-accent/15 text-accent border-l-[3px] border-accent'
            : 'text-white/70 hover:bg-white/8 hover:text-white border-l-[3px] border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
          {!collapsed && (
            <span className="flex-1 text-[14px] font-medium truncate">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span className="w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
              {item.badge}
            </span>
          )}
          {!collapsed && item.soon && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
              <Lock size={9} className="inline mr-0.5" />Soon
            </span>
          )}
          {collapsed && item.badge && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center">
              {item.badge}
            </span>
          )}
          {isBottom && !isActive && !collapsed && (
            <span className="text-ink-faint/40">{item.label.toLowerCase().startsWith('logout') ? '' : ''}</span>
          )}
        </>
      )}
    </NavLink>
  )

  const ItemSimple = ({ item, isBottom }) => (
    <button
      onClick={() => (item.to ? navigate(item.to) : undefined)}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center gap-3 rounded-[8px] text-left transition-all duration-200 w-full ${
        collapsed ? 'justify-center px-0 h-[48px] w-[48px] mx-auto' : 'px-4 h-[48px]'
      } text-white/70 hover:bg-white/8 hover:text-white`}
    >
      <item.icon size={20} />
      {!collapsed && <span className="flex-1 text-[14px] font-medium truncate">{item.label}</span>}
    </button>
  )

  return (
    <aside
      className={`hidden md:flex flex-col bg-gradient-to-b from-primary to-primary-dark text-white shadow-[var(--shadow-sidebar)] transition-[width] duration-300 ease sticky top-0 h-screen overflow-hidden ${
        collapsed ? 'w-[70px]' : 'w-[260px]'
      }`}
    >
      {/* Company section */}
      <div className={`${collapsed ? 'px-0 py-4 flex justify-center' : 'px-4 py-5'} border-b border-white/10`}>
        {collapsed ? (
          <CompanyAvatar sizeClass="w-10 h-10 shrink-0" />
        ) : (
          <div className="flex items-center gap-3">
            <CompanyAvatar sizeClass="w-11 h-11 shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white truncate leading-tight">
                {companyName}
              </p>
              <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold ${status.cls} px-2 py-0.5 rounded-full`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} /> {status.label}
              </span>
              {reference && <p className="mt-1.5 font-mono text-[10px] text-white/45">{reference}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuTop.map((item) => (
          <Item key={item.label} item={item} />
        ))}

        <div className={`my-3 border-t border-white/10 ${collapsed ? 'mx-auto w-8' : ''}`} />

        {menuBottom.map((item) => (
          <ItemSimple key={item.label} item={item} />
        ))}
      </nav>

      {/* Bottom: registration validity */}
      <div className={`border-t border-white/10 p-3 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? (
          <button
            title="Renew registration"
            onClick={() => navigate('/portal/renewal')}
            className="mx-auto w-[48px] h-[48px] rounded-[8px] bg-accent/20 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        ) : (
          <div className="rounded-[10px] bg-white/8 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] text-white/60">
              <Clock size={13} className="text-accent" /> Registration valid until:
            </p>
            <p className="text-[13px] font-semibold text-white mt-0.5">28 February 2025</p>
            <button
              onClick={() => navigate('/portal/renewal')}
              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-colors"
            >
              <RefreshCw size={13} /> Renew Now
            </button>
          </div>
        )}
      </div>

      {/* User switch */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => setUserMenu(!userMenu)}
          className={`relative w-full flex items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-white/8 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <span className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-sm font-bold text-white shrink-0">
            {userInitials}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">
                <span className="block text-[13px] font-semibold text-white leading-tight">{userName}</span>
                <span className="block text-[11px] text-white/45">{designation}</span>
              </span>
              <ChevronDown size={15} className={`text-white/50 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
        {userMenu && !collapsed && (
          <div className="absolute bottom-14 left-3 right-3 z-50 bg-white text-ink rounded-[10px] shadow-[var(--shadow-modal)] py-1.5 anim-fade-in">
            {[
              { label: 'My Profile', icon: Building2, to: '/portal/profile' },
              { label: 'Settings', icon: Settings },
              { label: 'Switch Language', icon: MessageSquare },
              { label: 'Logout', icon: LogOut, danger: true },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => m.to && navigate(m.to)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium hover:bg-surface transition-colors ${
                  m.danger ? 'text-danger' : 'text-ink'
                }`}
              >
                <m.icon size={16} /> {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
