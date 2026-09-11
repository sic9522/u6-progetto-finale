import { createContext, useContext, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../services/api'

const AuthContext = createContext(null)

function readStoredProfile() {
  if (!localStorage.getItem('token')) {
    return null
  }
  try {
    return JSON.parse(localStorage.getItem('profile'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(readStoredProfile)
  const [showAuthModal, setShowAuthModal] = useState(false)

  function applySession({ token, ...rest }) {
    localStorage.setItem('token', token)
    localStorage.setItem('profile', JSON.stringify(rest))
    setProfile(rest)
  }

  async function login(usernameInput, password) {
    applySession(await loginRequest(usernameInput, password))
  }

  async function register(data) {
    applySession(await registerRequest(data))
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        username: profile?.username ?? null,
        profile,
        login,
        register,
        logout,
        showAuthModal,
        openAuthModal: () => setShowAuthModal(true),
        closeAuthModal: () => setShowAuthModal(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
