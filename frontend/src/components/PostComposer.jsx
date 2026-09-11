import { Camera, Eye, MapPin, Plus, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { Alert, Button, Col, Form, Image, Modal, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../services/api'
import LocationModal from './LocationModal'
import OcrModal from './OcrModal'
import PhotoModal, { MAX_PHOTOS } from './PhotoModal'
import PostPreviewModal from './PostPreviewModal'
import TextPreviewModal from './TextPreviewModal'

function Avatar() {
  return (
    <div
      className="rounded-circle avatar-circle text-white d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: 40, height: 40, fontWeight: 600 }}
    >
      D
    </div>
  )
}

function PostComposer() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [location, setLocation] = useState(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  // Cambia a ogni apertura: forza PhotoModal a rimontarsi con initialPhotos aggiornato.
  const [photoModalKey, setPhotoModalKey] = useState(0)
  // Indice della foto di cui e' stata chiesta la rimozione, null se nessuna conferma in corso.
  const [removeIndex, setRemoveIndex] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [showPostPreview, setShowPostPreview] = useState(false)
  // Campo verso cui va il testo estratto dalla modale OCR ('message' | 'description'), null se chiusa.
  const [ocrTarget, setOcrTarget] = useState(null)
  // Testo e titolo da mostrare nella modale di lettura, null se chiusa.
  const [previewText, setPreviewText] = useState(null)

  const hasPhotos = photos.length > 0
  const hasLocation = Boolean(location)
  const canAddMorePhotos = photos.length < MAX_PHOTOS
  const removingLastPhoto = photos.length === 1

  function openPhotoModal() {
    setPhotoModalKey((key) => key + 1)
    setShowPhotoModal(true)
    setExpanded(true)
  }

  function handlePhotosConfirmed(nextPhotos) {
    // La prima volta che arriva una foto, il testo scritto finora diventa la descrizione sotto la foto.
    if (nextPhotos.length > 0 && photos.length === 0 && message.trim() && !description.trim()) {
      setDescription(message)
      setMessage('')
    }
    setPhotos(nextPhotos)
  }

  function handleReset() {
    setExpanded(false)
    setMessage('')
    setDescription('')
    setPhotos([])
    setLocation(null)
    setPublishError(null)
    setShowPostPreview(false)
  }

  function handleOpenPreview() {
    if (!hasPhotos) {
      setPublishError('Aggiungi almeno una foto')
      return
    }
    setPublishError(null)
    setShowPostPreview(true)
  }

  function handleTextExtracted(text) {
    if (ocrTarget === 'description') {
      setDescription(text)
    } else {
      setMessage(text)
    }
  }

  function handleConfirmRemove() {
    if (removingLastPhoto) {
      // Senza quell'unica foto il post resterebbe vuoto: si riparte da capo.
      handleReset()
    } else {
      setPhotos((prev) => prev.filter((_, i) => i !== removeIndex))
    }
    setRemoveIndex(null)
  }

  async function handlePublish() {
    if (!hasPhotos) {
      setPublishError('Aggiungi almeno una foto')
      return
    }
    setPublishing(true)
    setPublishError(null)
    try {
      const formData = new FormData()
      photos.forEach((file) => formData.append('files', file))
      if (location) {
        formData.append('latitude', location.latitude)
        formData.append('longitude', location.longitude)
        if (location.address) {
          formData.append('address', location.address)
        }
      }
      if (description.trim()) {
        formData.append('description', description.trim())
      }
      await createPost(formData)
      handleReset()
      navigate('/')
    } catch (err) {
      setPublishError(err.response?.data?.message ?? 'Pubblicazione non riuscita')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div>
      {!expanded ? (
        <div className="d-flex align-items-center gap-2 mb-3">
          <Avatar />
          <button
            type="button"
            className="flex-grow-1 rounded-pill bg-light border px-3 py-2 text-muted text-start"
            onClick={() => setExpanded(true)}
          >
            A cosa stai pensando, demo?
          </button>
        </div>
      ) : (
        <div className="border rounded-3 p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <Avatar />
              <span className="fw-semibold">demo</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link text-muted text-decoration-none p-0"
              onClick={handleReset}
              aria-label="Annulla il post"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {hasPhotos ? (
            <>
              <Row className="g-2 mb-2">
                {photos.map((file, index) => (
                  <Col xs={4} key={`${file.name}-${index}`} className="position-relative">
                    <Image src={URL.createObjectURL(file)} thumbnail />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                      style={{ width: 24, height: 24, padding: 0 }}
                      onClick={() => setRemoveIndex(index)}
                      aria-label={`Rimuovi ${file.name}`}
                    >
                      <X size={12} aria-hidden="true" />
                    </Button>
                  </Col>
                ))}
                {canAddMorePhotos && (
                  <Col xs={4}>
                    <button
                      type="button"
                      onClick={openPhotoModal}
                      className="d-flex align-items-center justify-content-center border rounded text-muted bg-white w-100 h-100"
                      style={{ minHeight: 68, borderStyle: 'dashed' }}
                      aria-label="Aggiungi un'altra foto"
                    >
                      <Plus size={22} aria-hidden="true" />
                    </button>
                  </Col>
                )}
              </Row>
              <div className="position-relative">
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="composer-textarea"
                  style={{ paddingRight: '4.5rem' }}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Scrivi una descrizione..."
                />
                <div className="position-absolute top-0 end-0 d-flex">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted p-1"
                    onClick={() => setPreviewText({ title: 'Descrizione', text: description })}
                    aria-label="Leggi la descrizione"
                  >
                    <Eye size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted p-1"
                    onClick={() => setOcrTarget('description')}
                    aria-label="Estrai testo da una foto"
                  >
                    <Camera size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="position-relative">
              <Form.Control
                as="textarea"
                rows={3}
                className="composer-textarea"
                style={{ paddingRight: '4.5rem' }}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="A cosa stai pensando, demo?"
                autoFocus
              />
              <div className="position-absolute top-0 end-0 d-flex">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted p-1"
                  onClick={() => setPreviewText({ title: 'Messaggio', text: message })}
                  aria-label="Leggi il messaggio"
                >
                  <Eye size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted p-1"
                  onClick={() => setOcrTarget('message')}
                  aria-label="Estrai testo da una foto"
                >
                  <Camera size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {hasLocation && (
            <div className="d-flex align-items-center justify-content-between gap-2 mt-2 p-2 border rounded-3">
              <div className="d-flex align-items-center gap-2 text-truncate">
                <MapPin size={16} className="text-danger flex-shrink-0" aria-hidden="true" />
                <span className="small text-truncate">
                  {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-muted text-decoration-none p-0 flex-shrink-0"
                onClick={() => setLocation(null)}
                aria-label="Rimuovi la posizione"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          )}

        </div>
      )}

      <hr className="my-2" />

      {(!hasPhotos || !hasLocation) && (
        <div className="d-flex gap-2 mb-2">
          {!hasPhotos && (
            <button
              type="button"
              className="flex-grow-1 btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
              onClick={openPhotoModal}
            >
              <Camera size={16} aria-hidden="true" />
              Foto
            </button>
          )}
          {!hasLocation && (
            <button
              type="button"
              className="flex-grow-1 btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
              onClick={() => {
                setShowLocationModal(true)
                setExpanded(true)
              }}
            >
              <MapPin size={16} aria-hidden="true" />
              Posizione
            </button>
          )}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between gap-2">
        <Button type="button" variant="outline-danger" className="flex-grow-1" onClick={handleReset}>
          Elimina
        </Button>
        <Button type="button" variant="primary" className="flex-grow-1" onClick={handleOpenPreview}>
          Crea
        </Button>
      </div>

      {publishError && (
        <Alert variant="danger" className="py-2 small mt-2 mb-0">
          {publishError}
        </Alert>
      )}

      <PhotoModal
        key={photoModalKey}
        show={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onConfirm={handlePhotosConfirmed}
        initialPhotos={photos}
      />
      <LocationModal show={showLocationModal} onClose={() => setShowLocationModal(false)} onConfirm={setLocation} />
      <OcrModal show={ocrTarget !== null} onClose={() => setOcrTarget(null)} onExtracted={handleTextExtracted} />
      <TextPreviewModal
        show={previewText !== null}
        onClose={() => setPreviewText(null)}
        title={previewText?.title}
        text={previewText?.text}
      />
      <PostPreviewModal
        show={showPostPreview}
        onClose={() => setShowPostPreview(false)}
        description={description}
        photos={photos}
        location={location}
        onDelete={handleReset}
        onPublish={handlePublish}
        publishing={publishing}
      />

      <Modal show={removeIndex !== null} onHide={() => setRemoveIndex(null)} centered size="sm">
        <Modal.Body>
          <p className="mb-0">{removingLastPhoto ? 'Vuoi eliminare il post?' : 'Vuoi eliminare la foto?'}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setRemoveIndex(null)}>
            No
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmRemove}>
            Sì
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PostComposer
