import React from 'react'
import { Outlet } from 'react-router-dom'
import TenantHeader from './tenant-header'
import TenantSidebar from './tenant-sidebar'

export default function TenantLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <TenantSidebar />
        <div className="flex-1 lg:ml-64">
          <TenantHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
