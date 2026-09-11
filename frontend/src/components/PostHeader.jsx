import { DotsThree } from '@phosphor-icons/react'
import { Dropdown } from 'react-bootstrap'

function PostHeader({ username, createdAt, onDelete }) {
  return (
    <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2">
      <div className="d-flex align-items-center gap-2">
        <div
          className="rounded-circle avatar-circle text-white d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 40, height: 40, fontWeight: 600 }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="fw-semibold">{username}</span>
      </div>
      <div className="d-flex align-items-center gap-1">
        <span className="post-timestamp">{new Date(createdAt).toLocaleString('it-IT')}</span>
        {onDelete && (
          <Dropdown align="end">
            <Dropdown.Toggle
              as="button"
              type="button"
              className="btn btn-sm btn-link text-muted p-1 no-caret"
              aria-label="Altre opzioni"
            >
              <DotsThree size={20} weight="bold" aria-hidden="true" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className="text-danger" onClick={onDelete}>
                Elimina
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </div>
  )
}

export default PostHeader
