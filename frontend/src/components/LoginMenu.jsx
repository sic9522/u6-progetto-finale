import { Dropdown } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

function LoginMenu() {
  const { username, logout, openAuthModal } = useAuth()

  if (username) {
    return (
      <Dropdown align="end">
        <Dropdown.Toggle as="button" type="button" className="btn btn-sm btn-outline-secondary">
          {username}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={logout}>Esci</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <button type="button" className="btn btn-sm btn-primary" onClick={openAuthModal}>
      Login
    </button>
  )
}

export default LoginMenu
