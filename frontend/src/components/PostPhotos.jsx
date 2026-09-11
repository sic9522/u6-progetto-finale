import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const API_URL = import.meta.env.VITE_API_URL

const PHOTO_HEIGHT = 360
const imageStyle = { width: '100%', height: PHOTO_HEIGHT, objectFit: 'cover' }

// Nel feed le foto arrivano gia' salvate e si leggono dall'API; nell'anteprima del composer
// sono ancora File locali, quindi il chiamante passa resolveSrc per usare un object URL.
function PostPhotos({ photos, resolveSrc = (photo) => `${API_URL}/api/photos/${photo.id}/content` }) {
  if (photos.length === 1) {
    const photo = photos[0]
    return <img src={resolveSrc(photo)} alt={photo.originalName} style={imageStyle} />
  }

  return (
    // L'altezza fissa sta su questo contenitore semplice, non sul componente Swiper:
    // cosi' non dipende da come lo style prop si combina con le classi interne di Swiper.
    <div className="post-swiper" style={{ height: PHOTO_HEIGHT, overflow: 'hidden', position: 'relative' }}>
      <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} style={{ height: '100%' }}>
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <img src={resolveSrc(photo)} alt={photo.originalName} style={imageStyle} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default PostPhotos
