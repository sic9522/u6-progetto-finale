import { X } from '@phosphor-icons/react'
import { Modal } from 'react-bootstrap'

function PhotoLightbox({ show, onClose, src, alt }) {
  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName="bg-transparent border-0">
      <div className="position-relative">
        <button
          type="button"
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, zIndex: 1 }}
          onClick={onClose}
          aria-label="Chiudi"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {src && <img src={src} alt={alt} className="w-100 rounded-3" style={{ maxHeight: '85vh', objectFit: 'contain' }} />}
      </div>
    </Modal>
  )
}

export default PhotoLightbox
