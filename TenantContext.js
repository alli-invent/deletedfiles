import React, { createContext, useState, useContext, useEffect } from 'react';
import { tenantService } from '../services/tenantService';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectTenantFromSubdomain();
  }, []);

  const detectTenantFromSubdomain = async () => {
    try {
      const subdomain = getSubdomain();

      if (subdomain && !['www', 'app'].includes(subdomain)) {
        const tenant = await tenantService.getCurrentTenant();
        setCurrentTenant(tenant);
      }
    } catch (error) {
      console.error('Error detecting tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubdomain = () => {
    const host = window.location.hostname;
    const parts = host.split('.');

    if (parts.length > 2) {
      const subdomain = parts[0];
      return subdomain !== 'www' ? subdomain : null;
    }
    return null;
  };

  const value = {
    currentTenant,
    loading,
    getSubdomain,
    isMultiTenant: true
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
