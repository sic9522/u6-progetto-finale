import { OverlayTrigger, Tooltip } from 'react-bootstrap'

function PostLocation({ address, latitude, longitude }) {
  const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

  return (
    <div className="mt-2">
      <h3 className="h6 mb-1">Posizione</h3>
      <OverlayTrigger placement="top" overlay={<Tooltip>{coords}</Tooltip>}>
        <p className="mb-0 small d-inline-block">{address || coords}</p>
      </OverlayTrigger>
    </div>
  )
}

export default PostLocation
