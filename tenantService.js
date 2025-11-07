import api from './api';

export const tenantService = {
  async getCurrentTenant() {
    const response = await api.get('/tenants/current');
    return response.data.tenant;
  },

  async createTenant(tenantData) {
    const response = await api.post('/tenants/create', tenantData);
    return response.data;
  },

  getTenantSubdomain() {
    const host = window.location.hostname;
    const parts = host.split('.');

    if (parts.length > 2) {
      const subdomain = parts[0];
      return subdomain !== 'www' ? subdomain : null;
    }
    return null;
  },

  getTenantBaseUrl(tenantSlug) {
    if (tenantSlug) {
      return `https://${tenantSlug}.xyz.com`;
    }
    return 'https://xyz.com';
  }
};
