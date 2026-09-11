import { useEffect, useRef, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import { reverseGeocode } from '../services/api'

const DEFAULT_CENTER = { lat: 41.9028, lng: 12.4964 } // Roma, usata solo finche' non si sceglie una posizione

function LocationPicker({ value, onChange }) {
  const { maps, places, marker, error: mapsError } = useGoogleMaps()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteContainerRef = useRef(null)
  const autocompleteElementRef = useRef(null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  // Crea la mappa una sola volta, quando la libreria e' pronta.
  useEffect(() => {
    if (!maps || mapRef.current || !containerRef.current) {
      return
    }
    const map = new maps.Map(containerRef.current, {
      center: value ? { lat: value.latitude, lng: value.longitude } : DEFAULT_CENTER,
      zoom: value ? 15 : 9,
      // Obbligatorio per usare AdvancedMarkerElement: senza un mapId il marker non si crea.
      mapId: 'DEMO_MAP_ID',
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
          onChange({ latitude: lat, longitude: lng, address: res.formattedAddress ?? '' })
        })
        // il reverse geocoding e' solo per compilare l'indirizzo mostrato: se fallisce si tiene comunque la posizione scelta
        .catch(() => {})
    })
    mapRef.current = map
    if (value) {
      placeMarker(map, value.latitude, value.longitude)
    }
    // center/zoom sono solo il punto di partenza: dopo la creazione la mappa vive di vita propria
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps])

  // Widget di ricerca indirizzo di Google (PlaceAutocompleteElement): si crea una volta
  // sola e si monta nel container. Sostituisce il vecchio google.maps.places.Autocomplete,
  // dismesso da Google per i progetti creati dopo marzo 2025.
  useEffect(() => {
    if (!places || !autocompleteContainerRef.current || autocompleteElementRef.current) {
      return
    }
    const autocompleteElement = new places.PlaceAutocompleteElement()
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
      recenter(lat, lng)
      setError(null)
      onChange({ latitude: lat, longitude: lng, address })
    })
    autocompleteElementRef.current = autocompleteElement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places])

  function placeMarker(map, lat, lng) {
    if (markerRef.current) {
      markerRef.current.position = { lat, lng }
    } else {
      markerRef.current = new marker.AdvancedMarkerElement({ map, position: { lat, lng } })
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
            onChange({ latitude, longitude, address: res.formattedAddress ?? '' })
          })
          .catch(() => {
            onChange({ latitude, longitude, address: '' })
          })
          .finally(() => setLocating(false))
      },
      (geoError) => {
        setError(geoError.message)
        setLocating(false)
      },
      // Senza high accuracy il browser tende a rispondere subito con una posizione
      // dedotta solo dall'IP, che su desktop puo' sbagliare di centinaia di km.
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function handleRemove() {
    if (markerRef.current) {
      markerRef.current.map = null
      markerRef.current = null
    }
    setError(null)
    onChange(null)
  }

  if (mapsError) {
    return <p className="text-danger">Mappa non disponibile: {mapsError}</p>
  }

  return (
    <div>
      <div className="d-flex gap-2 mb-2 flex-wrap">
        <div ref={autocompleteContainerRef} style={{ flexGrow: 1, minWidth: 240 }} />
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
        <small className="text-muted">Cerca un indirizzo, clicca sulla mappa o usa la tua posizione.</small>
      )}
    </div>
  )
}

export default LocationPicker
