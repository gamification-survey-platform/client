import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Logo from '../assets/cmu-logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { persistor } from '../store/store'
import { logout } from '../store/user/userSlice'

const Header = () => {
  const { user } = useSelector(userSelector)
  const dispatch = useDispatch()

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await persistor.pause()
    await persistor.flush()
    await persistor.purge()
    dispatch(logout())
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#">
          <LinkContainer to="/dashboard">
            <Image src={Logo} />
          </LinkContainer>
        </Navbar.Brand>{' '}
        <Navbar.Toggle aria-controls="navbar" className="ml-3" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <LinkContainer to="/profile">
              <Nav.Link>Profile</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/courses">
              <Nav.Link>Courses</Nav.Link>
            </LinkContainer>
            {user && user.role === 'admin' && (
              <LinkContainer to="/admin">
                <Nav.Link>Intructor Admin</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          <Nav>
            <LinkContainer to="/courses">
              <Nav.Link>
                <FontAwesomeIcon icon={faBell} size="2xl" />
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/courses" onClick={handleLogout}>
              <Nav.Link>Logout</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
/*
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>

        Icons
      </Container>
      <Navbar.Offcanvas show={open}>
        <Offcanvas.Header closeButton onClick={() => setOpen(false)}>
          <Offcanvas.Title>Logo</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-grow-1 pe-3">

          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  )
}
*/
export default Header
