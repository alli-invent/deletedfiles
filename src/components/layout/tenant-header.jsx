import React from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useTheme } from '../../context/theme-context'
import TenantBranding from '../tenant/tenant-branding'
import { Button } from '../ui/button'
import { Moon, Sun, Bell, User, Settings } from 'lucide-react'

export default function TenantHeader() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <TenantBranding />

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name}</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
