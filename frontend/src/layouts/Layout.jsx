import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Navbar bg="light" className="border-bottom">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            Social network
          </Navbar.Brand>
          <Nav>
            <Nav.Link as={NavLink} to="/crea">
              Nuovo post
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
}

export default Layout
