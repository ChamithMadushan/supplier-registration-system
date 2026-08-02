import React, { useState } from 'react'
import { Outlet, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PortalSidebar from './PortalSidebar'
import PortalTopNav from './PortalTopNav'

export default function PortalLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  if (!loading && !user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-surface flex">
      <PortalSidebar collapsed={collapsed} />
      <div className="flex-1 min-w-0 flex flex-col">
        <PortalTopNav
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onSearch={(q) => { if (q) navigate('/portal/dashboard') }}
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-[1200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
