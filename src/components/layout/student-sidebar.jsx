import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  User,
  BarChart3,
  GraduationCap
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/my-courses' },
  { icon: FileText, label: 'Assignments', href: '/assignments' },
  { icon: BarChart3, label: 'Grades', href: '/grades' },
  { icon: Award, label: 'Certificates', href: '/certificates' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export default function StudentSidebar() {
  const location = useLocation()

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-background z-30">
      <div className="flex h-14 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold">Student Portal</span>
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
