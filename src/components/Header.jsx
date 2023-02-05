import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Logo from '../assets/cmu-logo.svg'

const Header = () => (
  <>
    <Navbar bg="light" expand={false}>
      <Container>
        <Navbar.Toggle aria-controls="navbar" className="ml-3" />
        <Navbar.Brand href="#">
          <Image src={Logo} />
        </Navbar.Brand>
        Icons
      </Container>
      <Navbar.Offcanvas id="navbar" aria-labelledby="navbar">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Logo</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-grow-1 pe-3">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/courses">Courses</Nav.Link>
            <Nav.Link href="/admin">Intructor Admin</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  </>
)

export default Header
