import React, { createContext, useContext, useState, useEffect } from 'react'
import { tenantService } from '../services/tenant-service'

const TenantContext = createContext()

export function TenantProvider({ children }) {
  const [currentTenant, setCurrentTenant] = useState(null)
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      const tenantData = await tenantService.getUserTenants()
      setTenants(tenantData)

      // Set current tenant from localStorage or first tenant
      const savedTenantId = localStorage.getItem('currentTenantId')
      const current = tenantData.find(t => t.id === savedTenantId) || tenantData[0]
      setCurrentTenant(current)
    } catch (error) {
      console.error('Error loading tenants:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchTenant = async (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant) {
      setCurrentTenant(tenant)
      localStorage.setItem('currentTenantId', tenantId)
    }
  }

  const createTenant = async (tenantData) => {
    const newTenant = await tenantService.createTenant(tenantData)
    setTenants(prev => [...prev, newTenant])
    setCurrentTenant(newTenant)
    return newTenant
  }

  const updateTenant = async (tenantId, updates) => {
    const updatedTenant = await tenantService.updateTenant(tenantId, updates)
    setTenants(prev => prev.map(t => t.id === tenantId ? updatedTenant : t))
    if (currentTenant?.id === tenantId) {
      setCurrentTenant(updatedTenant)
    }
    return updatedTenant
  }

  const value = {
    currentTenant,
    tenants,
    loading,
    switchTenant,
    createTenant,
    updateTenant,
    refreshTenants: loadTenants
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
