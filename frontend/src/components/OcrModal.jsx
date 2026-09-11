import { Camera, Image as ImageIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { useCameraCapture } from '../hooks/useCameraCapture'
import { extractText } from '../services/api'

function OcrModal({ show, onClose, onExtracted }) {
  const { active: cameraActive, error: cameraError, videoRef, start, stop, captureBlob } = useCameraCapture()
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  async function runExtraction(file) {
    setExtracting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { text } = await extractText(formData)
      stop()
      onExtracted(text ?? '')
      onClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Estrazione del testo non riuscita')
    } finally {
      setExtracting(false)
    }
  }

  async function handleCapture() {
    const blob = await captureBlob()
    if (!blob) {
      return
    }
    await runExtraction(new File([blob], `ocr-${Date.now()}.jpg`, { type: 'image/jpeg' }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) {
      runExtraction(file)
    }
  }

  function handleClose() {
    stop()
    setError(null)
    onClose()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Estrai testo da foto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cameraError && <p className="text-danger small mb-2">Fotocamera non disponibile: {cameraError}</p>}
        {error && <p className="text-danger small mb-2">{error}</p>}

        {cameraActive ? (
          <div>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', background: '#000', borderRadius: 8 }} />
            <div className="d-flex justify-content-end gap-2 mt-2">
              <Button type="button" variant="outline-secondary" onClick={stop} disabled={extracting}>
                Annulla
              </Button>
              <Button type="button" onClick={handleCapture} disabled={extracting}>
                {extracting ? <Spinner size="sm" animation="border" /> : 'Estrai testo'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="d-flex gap-2 justify-content-center py-4">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={start}
              disabled={extracting}
              className="d-flex align-items-center gap-2"
            >
              <Camera size={20} aria-hidden="true" />
              Da fotocamera
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={extracting}
              className="d-flex align-items-center gap-2"
            >
              {extracting ? <Spinner size="sm" animation="border" /> : <ImageIcon size={20} aria-hidden="true" />}
              Importa foto
            </Button>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" hidden onChange={handleFileChange} />
      </Modal.Body>
    </Modal>
  )
}

export default OcrModal
