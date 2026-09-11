import { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'

function PostDescription({ text }) {
  const textRef = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [truncated, setTruncated] = useState(false)

  // Il clamp CSS taglia visivamente a 2 righe: si confronta l'altezza reale del testo
  // con quella visibile per sapere se c'e' davvero altro da mostrare.
  useEffect(() => {
    if (textRef.current) {
      setTruncated(textRef.current.scrollHeight > textRef.current.clientHeight + 1)
    }
  }, [text])

  return (
    <div>
      <h3 className="h6 mb-1">Descrizione</h3>
      <div className="position-relative post-description">
        <p ref={textRef} className="mb-0 small post-description-clamp">
          {text}
        </p>
        {truncated && (
          <button type="button" className="post-description-more" onClick={() => setShowModal(true)}>
            Mostra descrizione
          </button>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 mb-0">Descrizione</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small" style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PostDescription
