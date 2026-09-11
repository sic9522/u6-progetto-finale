import { X } from '@phosphor-icons/react'
import { Modal } from 'react-bootstrap'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

// photos ha piu' di un elemento solo quando il post ne ha piu' di una: in quel caso
// la modale usa lo stesso Swiper della card, cosi' si scorre senza chiuderla e riaprirla.
function PhotoLightbox({ show, onClose, photos, initialIndex, resolveSrc, altOf }) {
  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName="bg-transparent border-0">
      <div className="position-relative">
        <button
          type="button"
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, zIndex: 2 }}
          onClick={onClose}
          aria-label="Chiudi"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {photos && photos.length > 1 ? (
          <Swiper modules={[Navigation]} navigation initialSlide={initialIndex}>
            {photos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <img
                  src={resolveSrc(photo)}
                  alt={altOf(photo)}
                  className="w-100 rounded-3"
                  style={{ maxHeight: '85vh', objectFit: 'contain' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          photos?.[0] && (
            <img
              src={resolveSrc(photos[0])}
              alt={altOf(photos[0])}
              className="w-100 rounded-3"
              style={{ maxHeight: '85vh', objectFit: 'contain' }}
            />
          )
        )}
      </div>
    </Modal>
  )
}

export default PhotoLightbox
