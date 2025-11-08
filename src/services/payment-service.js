import { api } from './api'

export const paymentService = {
  async getPayments(filters = {}) {
    const response = await api.get('/payments', { params: filters })
    return response.data
  },

  async getPaymentById(id) {
    const response = await api.get(`/payments/${id}`)
    return response.data
  },

  async createPayment(paymentData) {
    const response = await api.post('/payments', paymentData)
    return response.data
  },

  async updatePayment(id, updates) {
    const response = await api.put(`/payments/${id}`, updates)
    return response.data
  },

  async processPayment(paymentId, paymentMethod) {
    const response = await api.post(`/payments/${paymentId}/process`, {
      payment_method: paymentMethod
    })
    return response.data
  },

  async getStudentPayments(studentId) {
    const response = await api.get(`/payments/student/${studentId}`)
    return response.data
  },

  async getRevenueStats() {
    const response = await api.get('/payments/revenue/stats')
    return response.data
  }
}
