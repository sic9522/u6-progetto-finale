import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Un anonimo puo' vedere solo la Home: le altre pagine servono un account,
// quindi si rimanda alla Home aprendo la modale di login/registrazione.
function RequireAuth() {
  const { username, openAuthModal } = useAuth()

  useEffect(() => {
    if (!username) {
      openAuthModal()
    }
  }, [username, openAuthModal])

  return username ? <Outlet /> : <Navigate to="/" replace />
}

export default RequireAuth
