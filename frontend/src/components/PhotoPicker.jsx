import { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Image, Row } from 'react-bootstrap'

// Lato lungo massimo dello scatto: oltre non serve, appesantisce solo l'upload.
const MAX_SIDE = 2000
const JPEG_QUALITY = 0.85

function PhotoPicker({ files, onChange }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState(null)

  useEffect(() => {
    // Senza questo la spia della fotocamera resta accesa se si lascia la pagina a metà.
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  async function startCamera() {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraOn(true)
    } catch (err) {
      setCameraError(describeError(err))
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

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
        if (blob) {
          const file = new File([blob], `scatto-${Date.now()}.jpg`, { type: 'image/jpeg' })
          onChange([...files, file])
        }
      },
      'image/jpeg',
      JPEG_QUALITY,
    )
  }

  function handleUpload(event) {
    const selected = Array.from(event.target.files ?? [])
    if (selected.length > 0) {
      onChange([...files, ...selected])
    }
    event.target.value = ''
  }

  function removeAt(index) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="d-flex gap-2 mb-2 flex-wrap">
        <Button type="button" variant="outline-secondary" as="label" className="mb-0">
          Carica foto
          <Form.Control type="file" accept="image/png,image/jpeg" multiple hidden onChange={handleUpload} />
        </Button>
        {!cameraOn ? (
          <Button type="button" variant="outline-secondary" onClick={startCamera}>
            Apri fotocamera
          </Button>
        ) : (
          <>
            <Button type="button" variant="primary" onClick={capture}>
              Scatta
            </Button>
            <Button type="button" variant="outline-secondary" onClick={stopCamera}>
              Chiudi fotocamera
            </Button>
          </>
        )}
      </div>

      {cameraError && (
        <div className="mb-2">
          <p className="text-danger small mb-1">Fotocamera non disponibile: {cameraError}. Puoi comunque scattare dal dispositivo:</p>
          <Form.Control type="file" accept="image/*" capture="environment" onChange={handleUpload} />
        </div>
      )}

      {cameraOn && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', maxWidth: 480, background: '#000', borderRadius: 8 }}
        />
      )}

      {files.length > 0 && (
        <Row className="g-2 mt-2">
          {files.map((file, index) => (
            <Col xs={4} sm={3} md={2} key={`${file.name}-${index}`} className="position-relative">
              <Image src={URL.createObjectURL(file)} thumbnail />
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0"
                onClick={() => removeAt(index)}
              >
                &times;
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </div>
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

export default PhotoPicker
