import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Modal, Row, Spinner } from 'react-bootstrap'
import PostDescription from '../components/PostDescription'
import PostHeader from '../components/PostHeader'
import PostLocation from '../components/PostLocation'
import PostPhotos from '../components/PostPhotos'
import { deletePost, listPosts } from '../services/api'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Id del post di cui e' stata chiesta l'eliminazione, null se nessuna conferma in corso.
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch((err) => setError(err.response?.data?.message ?? 'Caricamento dei post non riuscito'))
      .finally(() => setLoading(false))
  }, [])

  async function handleConfirmDelete() {
    const id = deleteId
    setDeleteId(null)
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch (err) {
      setError(err.response?.data?.message ?? 'Eliminazione del post non riuscita')
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <div>
      <h1 className="h3 mb-4">Post</h1>

      {posts.length === 0 && <p className="text-muted">Nessun post ancora. Creane uno da "Nuovo post".</p>}

      <Row>
        {posts.map((post) => {
          const hasLocation = post.latitude != null && post.longitude != null

          return (
            <Col key={post.id} xs={12} md={6} className="mb-4">
              <Card className="h-100 overflow-hidden">
                <PostHeader username="demo" createdAt={post.createdAt} onDelete={() => setDeleteId(post.id)} />
                <PostPhotos photos={post.photos} />
                <Card.Body>
                  {post.description && <PostDescription text={post.description} />}
                  {hasLocation && (
                    <PostLocation address={post.address} latitude={post.latitude} longitude={post.longitude} />
                  )}
                  {!post.description && !hasLocation && (
                    <p className="text-muted small mb-0">Nessuna informazione aggiuntiva</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      <Modal show={deleteId !== null} onHide={() => setDeleteId(null)} centered size="sm">
        <Modal.Body>
          <p className="mb-0">Vuoi eliminare il post?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setDeleteId(null)}>
            No
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Sì
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Home
