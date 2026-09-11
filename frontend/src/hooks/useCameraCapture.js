import { useEffect, useRef, useState } from 'react'

// Lato lungo massimo dello scatto: oltre non serve, appesantisce solo l'upload.
const MAX_SIDE = 2000
const JPEG_QUALITY = 0.85

export function useCameraCapture() {
  const [active, setActive] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // Il tag <video> esiste solo quando active e' true: va collegato dopo il render, non prima.
  useEffect(() => {
    if (active && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [active])

  async function start() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 } },
      })
      streamRef.current = stream
      setActive(true)
    } catch (err) {
      setError(describeError(err))
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setActive(false)
  }

  function captureBlob() {
    return new Promise((resolve) => {
      const video = videoRef.current
      if (!video) {
        resolve(null)
        return
      }
      const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(video.videoWidth * scale)
      canvas.height = Math.round(video.videoHeight * scale)
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', JPEG_QUALITY)
    })
  }

  return { active, error, videoRef, start, stop, captureBlob }
}

function describeError(err) {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') return 'permesso negato'
    if (err.name === 'NotFoundError') return 'nessuna fotocamera trovata'
    return err.name
  }
  return String(err)
}
