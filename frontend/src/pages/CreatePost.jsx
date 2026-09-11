import { useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import LocationPicker from '../components/LocationPicker'
import PhotoPicker from '../components/PhotoPicker'
import { createPost } from '../services/api'

function CreatePost() {
  const [files, setFiles] = useState([])
  const [location, setLocation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    if (files.length === 0) {
      setError('Aggiungi almeno una foto')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))
      if (location) {
        formData.append('latitude', location.latitude)
        formData.append('longitude', location.longitude)
        if (location.address) {
          formData.append('address', location.address)
        }
      }
      await createPost(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Creazione del post non riuscita')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-4">Nuovo post</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Foto</Form.Label>
          <PhotoPicker files={files} onChange={setFiles} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Posizione (opzionale)</Form.Label>
          <LocationPicker value={location} onChange={setLocation} />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" disabled={submitting}>
          {submitting ? <Spinner size="sm" animation="border" /> : 'Pubblica'}
        </Button>
      </Form>
    </Container>
  )
}

export default CreatePost
