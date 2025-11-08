import { api } from './api'

export const assessmentService = {
  async getAssessments(filters = {}) {
    const response = await api.get('/assessments', { params: filters })
    return response.data
  },

  async getAssessmentById(id) {
    const response = await api.get(`/assessments/${id}`)
    return response.data
  },

  async createAssessment(assessmentData) {
    const response = await api.post('/assessments', assessmentData)
    return response.data
  },

  async updateAssessment(id, updates) {
    const response = await api.put(`/assessments/${id}`, updates)
    return response.data
  },

  async deleteAssessment(id) {
    const response = await api.delete(`/assessments/${id}`)
    return response.data
  },

  async submitAssessment(assessmentId, answers) {
    const response = await api.post(`/assessments/${assessmentId}/submit`, {
      answers
    })
    return response.data
  },

  async getAssessmentResults(assessmentId) {
    const response = await api.get(`/assessments/${assessmentId}/results`)
    return response.data
  },

  async getStudentAssessments(studentId) {
    const response = await api.get(`/assessments/student/${studentId}`)
    return response.data
  }
}
