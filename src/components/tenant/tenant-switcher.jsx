import React, { useState } from 'react'
import { useTenant } from '../../hooks/use-tenant'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Check, Building, ChevronDown } from 'lucide-react'

export default function TenantSwitcher() {
  const { currentTenant, tenants, switchTenant } = useTenant()
  const [open, setOpen] = useState(false)

  if (!currentTenant || tenants.length === 0) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Building className="h-4 w-4" />
          <span className="font-semibold">{currentTenant.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => switchTenant(tenant.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              {tenant.logo_url && (
                <img
                  src={tenant.logo_url}
                  alt={tenant.name}
                  className="h-4 w-4 rounded"
                />
              )}
              <span>{tenant.name}</span>
            </div>
            {tenant.id === currentTenant.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
