import { useEffect, useState } from 'react'
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap'
import PostHeader from '../components/PostHeader'
import PostPhotos from '../components/PostPhotos'
import { listPosts } from '../services/api'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch((err) => setError(err.response?.data?.message ?? 'Caricamento dei post non riuscito'))
      .finally(() => setLoading(false))
  }, [])

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
        {posts.map((post) => (
          <Col key={post.id} xs={12} md={6} className="mb-4">
            <Card className="h-100 overflow-hidden">
              <PostHeader username="demo" />
              <PostPhotos photos={post.photos} />
              <Card.Body>
                {(post.address || (post.latitude != null && post.longitude != null)) && (
                  <Card.Text className="text-muted small mb-1">
                    {post.address || `${post.latitude.toFixed(6)}, ${post.longitude.toFixed(6)}`}
                  </Card.Text>
                )}
                <Card.Text className="text-muted small mb-0">{new Date(post.createdAt).toLocaleString('it-IT')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home
