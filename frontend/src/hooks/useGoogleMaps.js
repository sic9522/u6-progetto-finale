import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { useEffect, useState } from 'react'

// Caricata una volta sola per tutta l'app, anche se il componente che la usa si smonta e rimonta.
let bootstrap = null

function loadMaps() {
  if (!bootstrap) {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) {
      return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY non impostata: copiare .env.example in .env'))
    }
    setOptions({ key, v: 'weekly', language: 'it', region: 'IT' })
    // 'marker' serve per AdvancedMarkerElement: google.maps.Marker e' deprecato dal 21/02/2024
    // e sui progetti piu' recenti risulta proprio assente, non solo sconsigliato.
    bootstrap = Promise.all([importLibrary('maps'), importLibrary('places'), importLibrary('marker')])
      .then(([maps, places, marker]) => ({ maps, places, marker }))
  }
  return bootstrap
}

export function useGoogleMaps() {
  const [maps, setMaps] = useState(null)
  const [places, setPlaces] = useState(null)
  const [marker, setMarker] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    loadMaps()
      .then((libs) => {
        if (alive) {
          setMaps(libs.maps)
          setPlaces(libs.places)
          setMarker(libs.marker)
        }
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Caricamento di Google Maps non riuscito')
      })
    return () => {
      alive = false
    }
  }, [])

  return { maps, places, marker, error }
}
