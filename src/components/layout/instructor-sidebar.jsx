import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Users,
  BarChart3,
  User
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Course Management', href: '/courses' },
  { icon: FileText, label: 'Course Builder', href: '/course-builder' },
  { icon: ClipboardList, label: 'Assessments', href: '/assessment-builder' },
  { icon: Users, label: 'Gradebook', href: '/gradebook' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export default function InstructorSidebar() {
  const location = useLocation()

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-background z-30">
      <div className="flex h-14 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">Instructor Portal</span>
        </Link>
      </div>

      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
