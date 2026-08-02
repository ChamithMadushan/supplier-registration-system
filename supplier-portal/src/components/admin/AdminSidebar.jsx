import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Building2, BarChart3, FolderOpen,
  FileBarChart, Mail, LifeBuoy, Settings, ChevronLeft, ChevronRight, ChevronDown,
  Ban, BadgeCheck, FileClock,
} from 'lucide-react'

const menu = [
  {
    label: 'Main Menu',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard', badge: null },
    ],
  },
  {
    label: 'Applications',
    items: [
      { label: 'All Applications', icon: ClipboardList, to: '/admin/applications', badge: '75' },
    ],
  },
  {
    label: 'Suppliers',
    items: [
      { label: 'Supplier Database', icon: Building2, to: '/admin/suppliers', badge: null },
      { label: 'Approved Vendors', icon: BadgeCheck, to: '/admin/suppliers?status=approved', badge: '412' },
      { label: 'Blacklist', icon: Ban, to: '/admin/blacklist', badge: null },
    ],
  },
  {
    label: 'Performance',
    items: [
      { label: 'Performance Management', icon: BarChart3, to: '/admin/performance', badge: null },
      { label: 'Document Center', icon: FolderOpen, to: '/admin/documents', badge: '48' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Reports & Analytics', icon: FileBarChart, to: '/admin/reports', badge: null },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Communications', icon: Mail, to: '/admin/communications', badge: null },
      { label: 'Support Tickets', icon: LifeBuoy, to: '/admin/tickets', badge: '3' },
      { label: 'Notifications', icon: BellIcon, to: '/admin/notifications', badge: '12' },
      { label: 'Audit Logs', icon: FileClock, to: '/admin/audit-logs', badge: null },
      { label: 'System Settings', icon: Settings, to: '/admin/settings', badge: null },
    ],
  },
]

function BellIcon(p) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function MenuItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `group relative flex items-center gap-3 mx-3 rounded-[8px] text-[13px] font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-accent/15 text-white before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:h-[22px] before:w-[3px] before:rounded-r before:bg-accent'
            : 'text-sidebar-text hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex items-center justify-center shrink-0 transition-colors ${collapsed ? 'mx-auto' : ''} ${
              isActive ? 'text-accent' : 'text-sidebar-icon group-hover:text-white'
            }`}
            style={{ width: collapsed ? 'auto' : undefined }}
          >
            <item.icon size={18} />
          </span>
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {!collapsed && item.badge && (
            <span className="min-w-[20px] h-[18px] px-1.5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function AdminSidebar({ collapsed, onToggle }) {
  const [expanded, setExpanded] = useState({})

  const toggle = (label) => setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <aside
      className={`no-print fixed left-0 top-[60px] bottom-0 z-40 flex flex-col bg-navy-800 transition-[width] duration-300 shadow-[var(--shadow-sidebar)] border-r border-navy-700 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll py-4">
        {menu.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-sidebar-icon/80">
                {group.label}
              </p>
            )}
            {collapsed && <div className="mx-4 my-2 h-px bg-white/8" />}
            <div className="space-y-0.5">
              {group.items.map((item) =>
                item.submenu ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggle(item.label)}
                      className={`w-full flex items-center gap-3 mx-3 rounded-[8px] px-3 py-2.5 text-[13px] font-medium text-sidebar-text hover:bg-white/5 hover:text-white transition-colors ${
                        collapsed ? 'justify-center px-0 mx-2' : ''
                      }`}
                    >
                      <item.icon size={18} className="text-sidebar-icon shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span className="min-w-[20px] h-[18px] px-1.5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown size={14} className={`transition-transform ${expanded[item.label] ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    {!collapsed && expanded[item.label] && (
                      <div className="ml-[38px] mt-0.5 space-y-0.5">
                        {item.submenu.map((sub) => (
                          <NavLink
                            key={sub.label}
                            to={sub.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 rounded-[6px] text-[12px] transition-colors ${
                                isActive ? 'text-accent bg-accent/10 font-semibold' : 'text-sidebar-text hover:text-white hover:bg-white/5'
                              }`
                            }
                          >
                            <sub.icon size={14} />
                            <span className="flex-1 truncate">{sub.label}</span>
                            {sub.badge && (
                              <span className="min-w-[18px] h-[16px] px-1 rounded-full bg-accent/20 text-accent text-[9px] font-bold flex items-center justify-center">
                                {sub.badge}
                              </span>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <MenuItem key={item.label} item={item} collapsed={collapsed} />
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin info + collapse */}
      <div className="shrink-0 border-t border-white/10 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-[10px] bg-white/5 px-3 py-3">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-hover text-white flex items-center justify-center text-[13px] font-bold shrink-0">
              KP
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">Kamal Perera</p>
              <p className="text-[11px] text-sidebar-text truncate">Procurement Manager</p>
            </div>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-hover text-white flex items-center justify-center text-[13px] font-bold">
              KP
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-[8px] border border-white/10 py-2 text-[12px] font-medium text-sidebar-text hover:text-white hover:bg-white/5 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!collapsed && 'Collapse Sidebar'}
        </button>
      </div>
    </aside>
  )
}
