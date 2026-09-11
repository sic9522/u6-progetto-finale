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

export function deletePost(id) {
  return api.delete(`/api/posts/${id}`).then((res) => res.data)
}

export function reverseGeocode(latitude, longitude) {
  return api.get('/api/geocode/reverse', { params: { latitude, longitude } }).then((res) => res.data)
}

export function extractText(formData) {
  return api.post('/api/ocr', formData).then((res) => res.data)
}

export function login(username, password) {
  return api.post('/api/auth/login', { username, password }).then((res) => res.data)
}

export function register(data) {
  return api.post('/api/auth/register', data).then((res) => res.data)
}

export default api
