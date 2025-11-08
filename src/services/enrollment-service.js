import { api } from './api'

export const enrollmentService = {
  async getEnrollments(filters = {}) {
    const response = await api.get('/enrollments', { params: filters })
    return response.data
  },

  async createEnrollment(enrollmentData) {
    const response = await api.post('/enrollments', enrollmentData)
    return response.data
  },

  async updateEnrollment(id, updates) {
    const response = await api.put(`/enrollments/${id}`, updates)
    return response.data
  },

  async getStudentEnrollments(studentId) {
    const response = await api.get(`/enrollments/student/${studentId}`)
    return response.data
  },

  async getCourseEnrollments(courseId) {
    const response = await api.get(`/enrollments/course/${courseId}`)
    return response.data
  }
}
