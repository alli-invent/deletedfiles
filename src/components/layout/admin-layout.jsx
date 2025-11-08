import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from './admin-header'
import AdminSidebar from './admin-sidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64">
          <AdminHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
