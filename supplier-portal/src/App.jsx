import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import RegisterStep1 from './pages/RegisterStep1'
import RegisterStep2 from './pages/RegisterStep2'
import RegisterStep3 from './pages/RegisterStep3'
import RegisterStep4 from './pages/RegisterStep4'
import RegisterStep5 from './pages/RegisterStep5'
import RegisterStep6 from './pages/RegisterStep6'
import Success from './pages/Success'
import ScrollToTop from './components/ScrollToTop'
import PortalLayout from './components/portal/PortalLayout'
import Dashboard from './pages/portal/Dashboard'
import Profile from './pages/portal/Profile'
import Documents from './pages/portal/Documents'
import ApplicationTracking from './pages/portal/ApplicationTracking'
import Performance from './pages/portal/Performance'
import Notifications from './pages/portal/Notifications'
import Support from './pages/portal/Support'
import Renewal from './pages/portal/Renewal'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import Applications from './pages/admin/Applications'
import ApplicationReview from './pages/admin/ApplicationReview'
import Suppliers from './pages/admin/Suppliers'
import SupplierDetail from './pages/admin/SupplierDetail'
import AdminDocuments from './pages/admin/Documents'
import AdminPerformance from './pages/admin/Performance'
import Blacklist from './pages/admin/Blacklist'
import Reports from './pages/admin/Reports'
import Communications from './pages/admin/Communications'
import Settings from './pages/admin/Settings'
import AdminNotifications from './pages/admin/Notifications'
import AuditLogs from './pages/admin/AuditLogs'
import Tickets from './pages/admin/Tickets'

export default function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/step-1" element={<RegisterStep1 />} />
        <Route path="/register/step-2" element={<RegisterStep2 />} />
        <Route path="/register/step-3" element={<RegisterStep3 />} />
        <Route path="/register/step-4" element={<RegisterStep4 />} />
        <Route path="/register/step-5" element={<RegisterStep5 />} />
        <Route path="/register/step-6" element={<RegisterStep6 />} />
        <Route path="/register/success" element={<Success />} />

        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="documents" element={<Documents />} />
          <Route path="application" element={<ApplicationTracking />} />
          <Route path="performance" element={<Performance />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="renewal" element={<Renewal />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/review" element={<ApplicationReview />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/:id" element={<SupplierDetail />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="performance" element={<AdminPerformance />} />
          <Route path="blacklist" element={<Blacklist />} />
          <Route path="reports" element={<Reports />} />
          <Route path="communications" element={<Communications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>

        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
