import { Container, Nav, Navbar, Row } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import NewsSidebar from '../components/NewsSidebar'
import Sidebar from '../components/Sidebar'

function Layout() {
  return (
    <div className="vh-100 d-flex flex-column">
      <Navbar bg="light" className="border-bottom flex-shrink-0">
        <Container fluid>
          <Row className="w-100 g-0 align-items-center">
            <div className="col-fifth px-3">
              <Navbar.Brand as={NavLink} to="/" className="mb-0">
                Social network
              </Navbar.Brand>
            </div>
            {/* Stessa larghezza della colonna body qui sotto, cosi' il menu resta centrato su di essa. */}
            <div className="col-three-fifths px-3 d-flex justify-content-center">
              <Nav>
                <Nav.Link as={NavLink} to="/" end>
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profilo">
                  Profilo
                </Nav.Link>
                <Nav.Link as={NavLink} to="/amici">
                  Amici
                </Nav.Link>
                <Nav.Link as={NavLink} to="/notifiche">
                  Notifiche
                </Nav.Link>
              </Nav>
            </div>
            <div className="col-fifth" />
          </Row>
        </Container>
      </Navbar>

      {/* Header, sidebar e footer restano fermi: solo questa zona cambia/scorre quando si naviga. */}
      <div className="flex-grow-1 overflow-hidden">
        <Container fluid className="h-100">
          <Row className="h-100 g-0">
            <div className="col-fifth border-end px-3 py-4 h-100 overflow-auto">
              <Sidebar />
            </div>
            <div className="col-three-fifths px-4 py-4 h-100 overflow-auto">
              <Outlet />
            </div>
            <div className="col-fifth border-start px-3 py-4 h-100 overflow-auto">
              <NewsSidebar />
            </div>
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
