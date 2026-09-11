import PostComposer from './PostComposer'

function Sidebar() {
  return (
    <div>
      <h2 className="h5 mb-1">demo</h2>
      <p className="text-muted small mb-3">Nessun login in questa fase: sei sempre l'utente demo.</p>

      <PostComposer />
    </div>
  )
}

export default Sidebar
