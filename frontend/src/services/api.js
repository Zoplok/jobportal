import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Jobs API
export const fetchJobs = async (filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })
  
  const response = await api.get(`/jobs?${params}`)
  return response.data.data || response.data
}

export const fetchJob = async (id) => {
  const response = await api.get(`/jobs/${id}`)
  return response.data.data || response.data
}

export const applyToJob = async (jobId, applicationData) => {
  const response = await api.post(`/applications`, {
    jobId,
    ...applicationData
  })
  return response.data
}

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// Applications API
export const fetchUserApplications = async () => {
  const response = await api.get('/applications/user')
  return response.data
}

export const updateApplication = async (id, data) => {
  const response = await api.put(`/applications/${id}`, data)
  return response.data
}

// Resumes API
export const uploadResume = async (formData) => {
  const response = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const fetchResumes = async () => {
  const response = await api.get('/resumes')
  return response.data
}

export const deleteResume = async (id) => {
  const response = await api.delete(`/resumes/${id}`)
  return response.data
}

// Dashboard API
export const fetchDashboardData = async () => {
  const response = await api.get('/dashboard')
  return response.data
}

export default api
