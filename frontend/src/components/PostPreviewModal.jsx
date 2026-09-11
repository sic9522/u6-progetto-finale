import { Button, Card, Modal, Spinner } from 'react-bootstrap'
import PostDescription from './PostDescription'
import PostHeader from './PostHeader'
import PostLocation from './PostLocation'
import PostPhotos from './PostPhotos'

function PostPreviewModal({ show, onClose, description, photos, location, onDelete, onPublish, publishing }) {
  const hasLocation = Boolean(location)
  const previewPhotos = photos.map((file, index) => ({
    id: index,
    originalName: file.name,
    previewUrl: URL.createObjectURL(file),
  }))

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Anteprima post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="overflow-hidden">
          <PostHeader username="demo" createdAt={new Date().toISOString()} />
          <PostPhotos photos={previewPhotos} resolveSrc={(photo) => photo.previewUrl} />
          <Card.Body>
            {description && <PostDescription text={description} />}
            {hasLocation && (
              <PostLocation address={location.address} latitude={location.latitude} longitude={location.longitude} />
            )}
            {!description && !hasLocation && <p className="text-muted small mb-0">Nessuna informazione aggiuntiva</p>}
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button type="button" variant="outline-danger" className="flex-grow-1" onClick={onDelete}>
          Elimina
        </Button>
        <Button type="button" variant="primary" className="flex-grow-1" onClick={onPublish} disabled={publishing}>
          {publishing ? <Spinner size="sm" animation="border" /> : 'Pubblica'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PostPreviewModal
