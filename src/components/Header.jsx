import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Logo from '../assets/cmu-logo.svg'
import { useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'

const Header = () => {
  const [open, setOpen] = useState(false)
  const { user } = useSelector(userSelector)
  return (
    <Navbar bg="light" expand={false}>
      <Container>
        <Navbar.Toggle aria-controls="navbar" className="ml-3" onClick={() => setOpen(true)} />
        <Navbar.Brand href="#">
          <Image src={Logo} />
        </Navbar.Brand>
        Icons
      </Container>
      <Navbar.Offcanvas show={open}>
        <Offcanvas.Header closeButton onClick={() => setOpen(false)}>
          <Offcanvas.Title>Logo</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-grow-1 pe-3">
            <LinkContainer to="/dashboard" onClick={() => setOpen(false)}>
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/profile" onClick={() => setOpen(false)}>
              <Nav.Link>Profile</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/courses" onClick={() => setOpen(false)}>
              <Nav.Link>Courses</Nav.Link>
            </LinkContainer>
            {user && user.role === 'admin' && (
              <LinkContainer to="/admin" onClick={() => setOpen(false)}>
                <Nav.Link>Intructor Admin</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  )
}

export default Header
