import { api } from './api'

export const tenantService = {
  async getUserTenants() {
    const response = await api.get('/tenants/my-tenants')
    return response.data
  },

  async createTenant(tenantData) {
    const response = await api.post('/tenants', tenantData)
    return response.data
  },

  async updateTenant(tenantId, updates) {
    const response = await api.put(`/tenants/${tenantId}`, updates)
    return response.data
  },

  async getTenantById(tenantId) {
    const response = await api.get(`/tenants/${tenantId}`)
    return response.data
  },

  async uploadLogo(tenantId, formData) {
    const response = await api.post(`/tenants/${tenantId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
