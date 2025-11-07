import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTenant } from './contexts/TenantContext'
import PublicLayout from './layouts/PublicLayout'
import TenantLayout from './layouts/TenantLayout'
import TenantOnboarding from './pages/tenant/Onboarding'

function AppRoutes() {
  const { currentTenant, loading, getSubdomain } = useTenant()

  if (loading) {
    return <div>Loading...</div>
  }

  const subdomain = getSubdomain()

  return (
    <Routes>
      {/* Main domain routes */}
      {!subdomain && (
        <Route path="/*" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="onboarding" element={<TenantOnboarding />} />
          <Route path="login" element={<Login />} />
        </Route>
      )}

      {/* Tenant-specific routes */}
      {subdomain && currentTenant && (
        <Route path="/*" element={<TenantLayout />}>
          <Route index element={<TenantDashboard />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="login" element={<Login />} />
        </Route>
      )}

      {/* Tenant not found */}
      {subdomain && !currentTenant && (
        <Route path="*" element={<TenantNotFound />} />
      )}
    </Routes>
  )
}

export default AppRoutes
