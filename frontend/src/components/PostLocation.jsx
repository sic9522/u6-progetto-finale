import { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import PostLocationModal from './PostLocationModal'

function PostLocation({ address, latitude, longitude }) {
  const [showMap, setShowMap] = useState(false)
  const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

  return (
    <div className="mt-2">
      <h3 className="h6 mb-1">Posizione</h3>
      <OverlayTrigger placement="top" overlay={<Tooltip>{coords}</Tooltip>}>
        <button
          type="button"
          className="btn btn-link p-0 border-0 text-start text-decoration-none mb-0 small d-inline-block"
          onClick={() => setShowMap(true)}
        >
          {address || coords}
        </button>
      </OverlayTrigger>
      <PostLocationModal
        show={showMap}
        onClose={() => setShowMap(false)}
        address={address}
        latitude={latitude}
        longitude={longitude}
      />
    </div>
  )
}

export default PostLocation
