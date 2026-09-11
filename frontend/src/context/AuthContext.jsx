import { createContext, useContext, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../services/api'

const AuthContext = createContext(null)

function readStoredUsername() {
  return localStorage.getItem('token') ? localStorage.getItem('username') : null
}

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(readStoredUsername)

  function applySession({ token, username: sessionUsername }) {
    localStorage.setItem('token', token)
    localStorage.setItem('username', sessionUsername)
    setUsername(sessionUsername)
  }

  async function login(usernameInput, password) {
    applySession(await loginRequest(usernameInput, password))
  }

  async function register(data) {
    applySession(await registerRequest(data))
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
