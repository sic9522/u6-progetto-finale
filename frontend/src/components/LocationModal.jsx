import { MapPin } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Modal, Spinner } from 'react-bootstrap'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import { reverseGeocode } from '../services/api'

const DEFAULT_CENTER = { lat: 41.9028, lng: 12.4964 } // Roma, usata solo se non c'e' ancora una posizione salvata
const STORAGE_KEY = 'social-network:last-location'

function readLastLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeLastLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
  } catch {
    // se il browser blocca il localStorage la posizione semplicemente non resta salvata tra un'apertura e l'altra
  }
}

function LocationModal({ show, onClose }) {
  const { maps, places, marker, error: mapsError } = useGoogleMaps()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteContainerRef = useRef(null)
  const autocompleteElementRef = useRef(null)
  const [location, setLocation] = useState(readLastLocation)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  // Crea la mappa una sola volta, all'apertura, centrata sull'ultima posizione salvata.
  useEffect(() => {
    if (!show || !maps || mapRef.current || !containerRef.current) {
      return
    }
    const center = location ? { lat: location.latitude, lng: location.longitude } : DEFAULT_CENTER
    const map = new maps.Map(containerRef.current, {
      center,
      zoom: 12,
      mapId: 'DEMO_MAP_ID',
      disableDefaultUI: true,
    })
    map.addListener('click', (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      placeMarker(map, lat, lng)
      reverseGeocode(lat, lng)
        .then((res) => setLocation({ latitude: lat, longitude: lng, address: res.formattedAddress ?? '' }))
        .catch(() => setLocation({ latitude: lat, longitude: lng, address: '' }))
    })
    mapRef.current = map
    if (location) {
      placeMarker(map, location.latitude, location.longitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, maps])

  // Suggerimenti live mentre si scrive, come nella pagina di creazione post.
  useEffect(() => {
    if (!show || !places || !autocompleteContainerRef.current || autocompleteElementRef.current) {
      return
    }
    const autocompleteElement = new places.PlaceAutocompleteElement()
    // PlaceAutocompleteElement non usa le variabili Material degli altri componenti Places:
    // si stila con proprieta' CSS dirette, altrimenti resta sullo sfondo scuro di default.
    autocompleteElement.style.backgroundColor = '#fff'
    autocompleteElement.style.color = 'var(--brand-text, #27212b)'
    autocompleteElement.style.colorScheme = 'light'
    autocompleteElement.style.borderRadius = '0.5rem'
    autocompleteContainerRef.current.appendChild(autocompleteElement)
    autocompleteElement.addEventListener('gmp-select', async ({ placePrediction }) => {
      const place = placePrediction.toPlace()
      await place.fetchFields({ fields: ['location', 'formattedAddress'] })
      if (!place.location) {
        return
      }
      const lat = place.location.lat()
      const lng = place.location.lng()
      const address = place.formattedAddress ?? ''
      setLocation({ latitude: lat, longitude: lng, address })
      setError(null)
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng })
        mapRef.current.setZoom(12)
        placeMarker(mapRef.current, lat, lng)
      }
    })
    autocompleteElementRef.current = autocompleteElement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, places])

  // La mappa non si ricrea quando il modale si riapre: va solo riportata sulla posizione salvata.
  useEffect(() => {
    if (show && mapRef.current && location) {
      mapRef.current.panTo({ lat: location.latitude, lng: location.longitude })
      mapRef.current.setZoom(12)
      placeMarker(mapRef.current, location.latitude, location.longitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function placeMarker(map, lat, lng) {
    if (!marker) {
      return
    }
    if (markerRef.current) {
      markerRef.current.position = { lat, lng }
    } else {
      markerRef.current = new marker.AdvancedMarkerElement({ map, position: { lat, lng } })
    }
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocalizzazione non supportata da questo browser')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (mapRef.current) {
          mapRef.current.panTo({ lat: latitude, lng: longitude })
          mapRef.current.setZoom(12)
          placeMarker(mapRef.current, latitude, longitude)
        }
        reverseGeocode(latitude, longitude)
          .then((res) => setLocation({ latitude, longitude, address: res.formattedAddress ?? '' }))
          .catch(() => setLocation({ latitude, longitude, address: '' }))
          .finally(() => setLocating(false))
      },
      (geoError) => {
        setError(geoError.message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function handleConfirm() {
    if (location) {
      writeLastLocation(location)
    }
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Posizione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {location && (
          <div className="d-flex align-items-center justify-content-between gap-2 mb-3 p-2 border rounded-3">
            <div className="d-flex align-items-center gap-2 text-truncate">
              <MapPin size={18} className="text-danger flex-shrink-0" aria-hidden="true" />
              <span className="text-truncate">
                {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </span>
            </div>
            <button type="button" className="btn btn-sm btn-link text-muted text-decoration-none flex-shrink-0" onClick={() => setLocation(null)}>
              Cambia
            </button>
          </div>
        )}

        {/* Rimane nel DOM (solo nascosta) anche a indirizzo scelto: il widget di Google e' creato
            una volta sola e rimontarlo da zero richiederebbe piu' gestione del semplice nasconderlo. */}
        <div className="d-flex gap-2 mb-3" hidden={Boolean(location)}>
          <div ref={autocompleteContainerRef} style={{ flexGrow: 1, minWidth: 0 }} />
          <Button
            type="button"
            variant="outline-secondary"
            onClick={handleUseMyLocation}
            disabled={!maps || locating}
            aria-label="Usa la posizione attuale"
            title="Usa la posizione attuale"
          >
            {locating ? <Spinner size="sm" animation="border" /> : <MapPin size={20} aria-hidden="true" />}
          </Button>
        </div>

        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        {mapsError && <Alert variant="danger" className="py-2 small">Mappa non disponibile: {mapsError}</Alert>}

        {!maps ? (
          <p className="text-muted small mb-0">Caricamento mappa...</p>
        ) : (
          <div ref={containerRef} style={{ height: 200, width: '100%', borderRadius: 8 }} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Conferma
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LocationModal
