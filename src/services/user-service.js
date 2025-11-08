import { api } from './api'

export const userService = {
  async getUsers(filters = {}) {
    const response = await api.get('/users', { params: filters })
    return response.data
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async createUser(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  async updateUser(id, updates) {
    const response = await api.put(`/users/${id}`, updates)
    return response.data
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async updateProfile(userId, updates) {
    const response = await api.put(`/users/${userId}/profile`, updates)
    return response.data
  },

  async changePassword(userId, currentPassword, newPassword) {
    const response = await api.post(`/users/${userId}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    })
    return response.data
  },

  async getUsersByRole(role) {
    const response = await api.get(`/users/role/${role}`)
    return response.data
  }
}
