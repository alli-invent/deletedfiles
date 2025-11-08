import React from 'react'
import { useTenant } from '../../hooks/use-tenant'

export default function TenantBranding() {
  const { currentTenant } = useTenant()

  if (!currentTenant) {
    return null
  }

  return (
    <div className="flex items-center space-x-3">
      {currentTenant.logo_url && (
        <img
          src={currentTenant.logo_url}
          alt={currentTenant.name}
          className="h-8 w-8 rounded"
        />
      )}
      <div>
        <h1 className="text-lg font-semibold">{currentTenant.name}</h1>
        {currentTenant.tagline && (
          <p className="text-sm text-muted-foreground">{currentTenant.tagline}</p>
        )}
      </div>
    </div>
  )
}
