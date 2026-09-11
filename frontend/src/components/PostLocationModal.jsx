import { useEffect, useRef } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { useGoogleMaps } from '../hooks/useGoogleMaps'

function PostLocationModal({ show, onClose, address, latitude, longitude }) {
  const { maps, marker, error: mapsError } = useGoogleMaps()
  const containerRef = useRef(null)

  // Mappa di sola lettura: creata a ogni apertura, nessuna interazione oltre pan/zoom.
  useEffect(() => {
    if (!show || !maps || !containerRef.current) {
      return
    }
    const position = { lat: latitude, lng: longitude }
    const map = new maps.Map(containerRef.current, {
      center: position,
      zoom: 15,
      mapId: 'DEMO_MAP_ID',
      disableDefaultUI: true,
    })
    if (marker) {
      new marker.AdvancedMarkerElement({ map, position })
    }
  }, [show, maps, marker, latitude, longitude])

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">{address || 'Posizione'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mapsError && <Alert variant="danger" className="py-2 small">Mappa non disponibile: {mapsError}</Alert>}
        {!maps ? (
          <p className="text-muted small mb-0">Caricamento mappa...</p>
        ) : (
          <div ref={containerRef} style={{ height: 300, width: '100%', borderRadius: 8 }} />
        )}
      </Modal.Body>
    </Modal>
  )
}

export default PostLocationModal
