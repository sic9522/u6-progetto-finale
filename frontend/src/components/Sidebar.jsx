import PostComposer from './PostComposer'

function Sidebar() {
  return (
    <div>
      <h2 className="h5 mb-1">Nuovo Post</h2>
      <p className="text-muted small mb-3">Pubblica un nuovo post in un canale o in tutti i canali a cui sei iscritto.</p>

      <PostComposer />
    </div>
  )
}

export default Sidebar
