import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import userSelector from '../store/user/selectors'
import { Container, Image, Form, Row, Col, Button } from 'react-bootstrap'
import DefaultImage from '../assets/default.jpg'

const Profile = () => {
  const { user } = useSelector(userSelector)
  const [currentUser, setCurrentUser] = useState(user)
  const [editing, setEditing] = useState(false)
  const { first_name, last_name, email, role } = currentUser

  const handleClick = (e) => {
    if (!editing) setEditing(true)
    else {
      setEditing(false)
    }
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col xs="3">
          <Image src={DefaultImage} width="100"></Image>
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          <h3>AndrewID: {user.andrew_id}</h3>
        </Col>
        <Col xs="9">
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col xs="10">
                <Form.Control
                  readOnly={!editing}
                  value={email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                First name
              </Form.Label>
              <Col xs="10">
                <Form.Control
                  readOnly={!editing}
                  value={first_name}
                  onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })}
                />
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Last name
              </Form.Label>
              <Col xs="10">
                <Form.Control
                  readOnly={!editing}
                  value={last_name}
                  onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })}
                />
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Date Joined
              </Form.Label>
              <Col xs="10">
                <Form.Control readOnly />
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Role
              </Form.Label>
              <Col xs="10">
                <Form.Control readOnly value={role} />
              </Col>
            </Form.Group>
            <hr />
          </Form>
          <Button onClick={handleClick} variant={editing ? 'success' : 'primary'}>
            {editing ? 'Save' : 'Edit Profile'}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
