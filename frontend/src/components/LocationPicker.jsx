import { useEffect, useRef, useState } from 'react'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import { geocodeAddress, reverseGeocode } from '../services/api'

const DEFAULT_CENTER = { lat: 41.9028, lng: 12.4964 } // Roma, usata solo finche' non si sceglie una posizione

function LocationPicker({ value, onChange }) {
  const { maps, error: mapsError } = useGoogleMaps()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [addressInput, setAddressInput] = useState(value?.address ?? '')
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  // Crea la mappa una sola volta, quando la libreria e' pronta.
  useEffect(() => {
    if (!maps || mapRef.current || !containerRef.current) {
      return
    }
    const map = new maps.Map(containerRef.current, {
      center: value ? { lat: value.latitude, lng: value.longitude } : DEFAULT_CENTER,
      zoom: value ? 15 : 5,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    })
    map.addListener('click', (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      placeMarker(map, lat, lng)
      onChange({ latitude: lat, longitude: lng, address: '' })
      reverseGeocode(lat, lng)
        .then((res) => {
          setAddressInput(res.formattedAddress ?? '')
          onChange({ latitude: lat, longitude: lng, address: res.formattedAddress ?? '' })
        })
        // il reverse geocoding e' solo per compilare il campo indirizzo: se fallisce si tiene comunque la posizione scelta
        .catch(() => {})
    })
    mapRef.current = map
    if (value) {
      placeMarker(map, value.latitude, value.longitude)
    }
    // center/zoom sono solo il punto di partenza: dopo la creazione la mappa vive di vita propria
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps])

  function placeMarker(map, lat, lng) {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng })
    } else {
      markerRef.current = new maps.Marker({ map, position: { lat, lng } })
    }
  }

  function recenter(lat, lng) {
    if (!mapRef.current) {
      return
    }
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(15)
    placeMarker(mapRef.current, lat, lng)
  }

  async function handleSearch(event) {
    event.preventDefault()
    if (!addressInput.trim()) {
      return
    }
    setSearching(true)
    setError(null)
    try {
      const res = await geocodeAddress(addressInput)
      recenter(res.latitude, res.longitude)
      setAddressInput(res.formattedAddress ?? addressInput)
      onChange({ latitude: res.latitude, longitude: res.longitude, address: res.formattedAddress ?? addressInput })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Indirizzo non trovato')
    } finally {
      setSearching(false)
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
        recenter(latitude, longitude)
        reverseGeocode(latitude, longitude)
          .then((res) => {
            setAddressInput(res.formattedAddress ?? '')
            onChange({ latitude, longitude, address: res.formattedAddress ?? '' })
          })
          .catch(() => {
            setAddressInput('')
            onChange({ latitude, longitude, address: '' })
          })
          .finally(() => setLocating(false))
      },
      (geoError) => {
        setError(geoError.message)
        setLocating(false)
      },
    )
  }

  function handleRemove() {
    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
    setAddressInput('')
    setError(null)
    onChange(null)
  }

  if (mapsError) {
    return <p className="text-danger">Mappa non disponibile: {mapsError}</p>
  }

  return (
    <div>
      <div className="d-flex gap-2 mb-2 flex-wrap">
        <Form onSubmit={handleSearch} className="d-flex flex-grow-1">
          <InputGroup>
            <Form.Control
              placeholder="Cerca un indirizzo..."
              value={addressInput}
              onChange={(event) => setAddressInput(event.target.value)}
              disabled={!maps}
            />
            <Button type="submit" variant="outline-secondary" disabled={!maps || searching}>
              {searching ? <Spinner size="sm" animation="border" /> : 'Cerca'}
            </Button>
          </InputGroup>
        </Form>
        <Button type="button" variant="outline-secondary" onClick={handleUseMyLocation} disabled={!maps || locating}>
          {locating ? <Spinner size="sm" animation="border" /> : 'Usa la mia posizione'}
        </Button>
      </div>

      {error && <p className="text-danger small">{error}</p>}

      {!maps ? <p>Caricamento mappa...</p> : <div ref={containerRef} style={{ height: 320, width: '100%', borderRadius: 8 }} />}

      {value ? (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>{value.address || `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`}</small>
          <Button type="button" size="sm" variant="link" onClick={handleRemove}>
            Rimuovi posizione
          </Button>
        </div>
      ) : (
        <small className="text-muted">Clicca sulla mappa, cerca un indirizzo o usa la tua posizione.</small>
      )}
    </div>
  )
}

export default LocationPicker
