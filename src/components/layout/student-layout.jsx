import React from 'react'
import { Outlet } from 'react-router-dom'
import StudentSidebar from './student-sidebar'
import StudentHeader from './student-header'

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <StudentSidebar />
        <div className="flex-1 lg:ml-64">
          <StudentHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
