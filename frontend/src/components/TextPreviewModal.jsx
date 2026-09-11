import { Modal } from 'react-bootstrap'

function TextPreviewModal({ show, onClose, title, text }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
          {text || 'Nessun testo scritto.'}
        </p>
      </Modal.Body>
    </Modal>
  )
}

export default TextPreviewModal
