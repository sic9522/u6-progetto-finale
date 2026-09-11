import { useAuth } from '../context/AuthContext'
import PostComposer from './PostComposer'

function Sidebar() {
  const { username } = useAuth()

  return (
    <div>
      <h2 className="h5 mb-1">{username ? 'Nuovo Post' : 'Nuovo post anonimo'}</h2>
      <p className="text-muted small mb-3">Pubblica un nuovo post in un canale o in tutti i canali a cui sei iscritto.</p>

      <PostComposer />
    </div>
  )
}

export default Sidebar
