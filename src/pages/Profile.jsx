import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import userSelector from "../store/selectors"
import { Container, Image, Form, Row, Col, Button } from "react-bootstrap"
import DefaultImage from "../assets/default.jpg"
import { editUser } from "../store/userSlice"

const Profile = () => {
    const user = useSelector(userSelector)
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(user)
    const [editing, setEditing] = useState(false)
    const { firstName, lastName, email, role } = currentUser

    const handleClick = e => {
        if (!editing)
            setEditing(true)
        else {
            dispatch(editUser(currentUser))
            setEditing(false)
        }
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col xs="3">
                    <Image src={DefaultImage} width="100"></Image>
                    <h2>
                        {user.firstName} {user.lastName}
                    </h2>
                    <h3>
                        AndrewID: {user.andrewId}
                    </h3>
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
                                    onChange={e => setCurrentUser({...currentUser, email: e.target.value })} />
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
                                    value={firstName} 
                                    onChange={e => setCurrentUser({...currentUser, firstName: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <hr />
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm="2">
                                Last name
                            </Form.Label>
                            <Col xs="10">
                                <Form.Control                                 
                                    readOnly={!editing} 
                                    value={lastName} 
                                    onChange={e => setCurrentUser({...currentUser, lastName: e.target.value })} />
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
                    <Button 
                        onClick={handleClick}
                        variant={editing ? 'success' : 'primary'}>
                            {editing ? 'Save' : 'Edit Profile' }
                    </Button>
                </Col>
            </Row>
        </Container>
    )

}

export default Profile