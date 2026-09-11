import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function createPost(formData) {
  return api.post('/api/posts', formData).then((res) => res.data)
}

export function listPosts() {
  return api.get('/api/posts').then((res) => res.data)
}

export function reverseGeocode(latitude, longitude) {
  return api.get('/api/geocode/reverse', { params: { latitude, longitude } }).then((res) => res.data)
}

export default api
