import { Camera, MapPin, Plus, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap'
import LocationModal from './LocationModal'
import PhotoModal, { MAX_PHOTOS } from './PhotoModal'

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
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  // Cambia a ogni apertura: forza PhotoModal a rimontarsi con initialPhotos aggiornato.
  const [photoModalKey, setPhotoModalKey] = useState(0)
  // Indice della foto di cui e' stata chiesta la rimozione, null se nessuna conferma in corso.
  const [removeIndex, setRemoveIndex] = useState(null)

  const hasPhotos = photos.length > 0
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
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Descrizione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Scrivi una descrizione..."
                />
              </Form.Group>
            </>
          ) : (
            <Form.Control
              as="textarea"
              rows={3}
              className="composer-textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="A cosa stai pensando, demo?"
              autoFocus
            />
          )}
        </div>
      )}

      <hr className="my-2" />
      <div className="d-flex gap-2">
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
      </div>

      <PhotoModal
        key={photoModalKey}
        show={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onConfirm={handlePhotosConfirmed}
        initialPhotos={photos}
      />
      <LocationModal show={showLocationModal} onClose={() => setShowLocationModal(false)} />

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
