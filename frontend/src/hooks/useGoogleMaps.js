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
    bootstrap = importLibrary('maps')
  }
  return bootstrap
}

export function useGoogleMaps() {
  const [maps, setMaps] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    loadMaps()
      .then((lib) => {
        if (alive) setMaps(lib)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Caricamento di Google Maps non riuscito')
      })
    return () => {
      alive = false
    }
  }, [])

  return { maps, error }
}
