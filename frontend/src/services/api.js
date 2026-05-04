import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyzeCode = async (code, language) => {
  try {
    const response = await api.post('/api/analyze', {
      code,
      language,
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getHistory = async () => {
  try {
    const response = await api.get('/api/history')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default api
