import { Camera, Image as ImageIcon, Plus, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Button, Col, Image, Modal, Row } from 'react-bootstrap'

export const MAX_PHOTOS = 5
const MAX_SIDE = 2000
const JPEG_QUALITY = 0.85

function PhotoModal({ show, onClose, onConfirm, initialPhotos = [] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [mode, setMode] = useState(initialPhotos.length > 0 ? 'gallery' : 'choice') // 'choice' | 'camera' | 'gallery'
  const [cameraError, setCameraError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // Il tag <video> esiste solo in modalita' camera: va collegato dopo il render, non prima.
  useEffect(() => {
    if (mode === 'camera' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [mode])

  async function startCamera() {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 } },
      })
      streamRef.current = stream
      setMode('camera')
    } catch (err) {
      setCameraError(describeError(err))
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  // La fotocamera resta aperta dopo lo scatto: si puo' continuare a scattare senza
  // richiudere e riaprire lo stream ogni volta (su alcuni webcam Windows riaprirlo
  // subito dopo averlo fermato puo' fallire, lasciando l'utente bloccato).
  function capture() {
    const video = videoRef.current
    if (!video) {
      return
    }
    const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return
        }
        const file = new File([blob], `scatto-${Date.now()}.jpg`, { type: 'image/jpeg' })
        const next = [...photos, file].slice(0, MAX_PHOTOS)
        setPhotos(next)
        if (next.length >= MAX_PHOTOS) {
          stopCamera()
          setMode('gallery')
        }
      },
      'image/jpeg',
      JPEG_QUALITY,
    )
  }

  function finishCamera() {
    stopCamera()
    setMode('gallery')
  }

  function handleUpload(event) {
    const selected = Array.from(event.target.files ?? [])
    if (selected.length > 0) {
      setPhotos((prev) => [...prev, ...selected].slice(0, MAX_PHOTOS))
    }
    event.target.value = ''
    setMode('gallery')
  }

  function removeAt(index) {
    const next = photos.filter((_, i) => i !== index)
    setPhotos(next)
    if (next.length === 0) {
      setMode('choice')
    }
  }

  function handleClose() {
    stopCamera()
    onClose()
  }

  function handleDone() {
    onConfirm(photos)
    handleClose()
  }

  const canAddMore = photos.length < MAX_PHOTOS
  const showChoice = mode === 'choice' || (mode === 'gallery' && photos.length === 0)

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Foto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Fuori dai rami sotto: se l'apertura fotocamera fallisce non si entra mai in modalita' 'camera',
            quindi l'errore va mostrato comunque, non solo dentro quella vista. */}
        {cameraError && <p className="text-danger small mb-2">Fotocamera non disponibile: {cameraError}</p>}

        {mode === 'camera' ? (
          <div>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', background: '#000', borderRadius: 8 }} />
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted small">{photos.length}/{MAX_PHOTOS} foto</span>
              <div className="d-flex gap-2">
                <Button type="button" variant="outline-secondary" onClick={finishCamera}>
                  Fine
                </Button>
                <Button type="button" onClick={capture} disabled={photos.length >= MAX_PHOTOS}>
                  Aggiungi
                </Button>
              </div>
            </div>
          </div>
        ) : showChoice ? (
          <div className="d-flex gap-2 justify-content-center py-4">
            <Button type="button" variant="outline-secondary" onClick={startCamera} className="d-flex align-items-center gap-2">
              <Camera size={20} aria-hidden="true" />
              Scatta
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => fileInputRef.current?.click()}
              className="d-flex align-items-center gap-2"
            >
              <ImageIcon size={20} aria-hidden="true" />
              Carica
            </Button>
          </div>
        ) : (
          <>
            <Row className="g-2">
              {photos.map((file, index) => (
                <Col xs={4} key={`${file.name}-${index}`} className="position-relative">
                  <Image src={URL.createObjectURL(file)} thumbnail />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, padding: 0 }}
                    onClick={() => removeAt(index)}
                    aria-label={`Rimuovi ${file.name}`}
                  >
                    <X size={14} aria-hidden="true" />
                  </Button>
                </Col>
              ))}
              {canAddMore && (
                <Col xs={4}>
                  <button
                    type="button"
                    onClick={() => setMode('choice')}
                    className="d-flex align-items-center justify-content-center border rounded text-muted bg-white w-100"
                    style={{ height: '100%', minHeight: 90, borderStyle: 'dashed' }}
                    aria-label="Aggiungi un'altra foto"
                  >
                    <Plus size={28} aria-hidden="true" />
                  </button>
                </Col>
              )}
            </Row>
            {!canAddMore && <p className="text-muted small mt-2 mb-0">Massimo {MAX_PHOTOS} foto per post.</p>}
          </>
        )}

        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" multiple hidden onChange={handleUpload} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleDone}>
          Fatto
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function describeError(err) {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') return 'permesso negato'
    if (err.name === 'NotFoundError') return 'nessuna fotocamera trovata'
    return err.name
  }
  return String(err)
}

export default PhotoModal
