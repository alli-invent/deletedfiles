import { api } from './api'

export const courseService = {
  async getCourses(filters = {}) {
    const response = await api.get('/courses', { params: filters })
    return response.data
  },

  async getCourseById(id) {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  async createCourse(courseData) {
    const response = await api.post('/courses', courseData)
    return response.data
  },

  async updateCourse(id, updates) {
    const response = await api.put(`/courses/${id}`, updates)
    return response.data
  },

  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },

  async enrollInCourse(courseId) {
    const response = await api.post(`/courses/${courseId}/enroll`)
    return response.data
  },

  async getMyCourses() {
    const response = await api.get('/courses/my-courses')
    return response.data
  },

  async getCourseProgress(courseId) {
    const response = await api.get(`/courses/${courseId}/progress`)
    return response.data
  },

  async updateProgress(courseId, moduleId, data) {
    const response = await api.post(`/courses/${courseId}/modules/${moduleId}/progress`, data)
    return response.data
  }
}
