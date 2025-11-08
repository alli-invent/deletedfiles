import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import { TenantProvider } from './context/tenant-context'
import { ThemeProvider } from './context/theme-context'
import { ToastProvider } from './components/ui/toast'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <TenantProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </TenantProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
