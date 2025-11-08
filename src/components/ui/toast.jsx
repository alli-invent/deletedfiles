import React, { createContext, useContext, useState } from 'react'
import { cn } from '../../../lib/utils'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast }
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "p-4 rounded-lg shadow-lg border max-w-sm",
              toast.variant === 'destructive'
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "bg-background text-foreground border-border"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {toast.title && (
                  <h4 className="font-semibold mb-1">{toast.title}</h4>
                )}
                {toast.description && (
                  <p className="text-sm">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function Toaster() {
  return null // The actual toaster is rendered in ToastProvider
}
