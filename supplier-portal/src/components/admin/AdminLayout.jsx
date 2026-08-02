import React, { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopNav from './AdminTopNav'
import { getAdminToken } from '../../api/adminClient'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text">
      <AdminTopNav collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className="pt-[60px] transition-[padding] duration-300"
        style={{ paddingLeft: collapsed ? 68 : 260 }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-6 anim-fade-up">{<Outlet />}</div>
      </main>
    </div>
  )
}
