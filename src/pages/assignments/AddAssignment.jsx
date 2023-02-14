import { useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useMatch, useNavigate } from 'react-router'
import { createAssignment } from '../../api/assignments'

const AddAssignment = () => {
  const [validated, setValidated] = useState(false)
  const [showError, setShowError] = useState(false)
  const {
    params: { courseId }
  } = useMatch('courses/:courseId/assignments/add')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity()) {
      const formData = new FormData(event.currentTarget)
      const formObj = Object.fromEntries(formData.entries())
      try {
        const res = await createAssignment({ courseId, assignment: formObj })
        if (res.status == 200) navigate(-1)
      } catch (e) {
        setShowError(true)
      }
    }
    setValidated(true)
  }

  return (
    <Container className="my-5 text-left">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="blah">
          <Form.Label className="ml-3">Assignment name:</Form.Label>
          <Col xs="5">
            <Form.Control required name="name" />
            <Form.Control.Feedback type="invalid">
              Please enter an assignment name
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Description:</Form.Label>
          <Col xs="5">
            <Form.Control required as="textarea" rows={5} name="description" />
            <Form.Control.Feedback type="invalid">
              Please enter a assignment description
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Type:</Form.Label>
          <Form.Select className="w-25" name="type">
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Submission type:</Form.Label>
          <Form.Select className="w-25" name="submissionType">
            <option value="file">File</option>
            <option value="url">URL</option>
            <option value="text">Text</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Total Score:</Form.Label>
          <Form.Control className="w-25" required name="score" />
          <Form.Control.Feedback type="invalid">Please enter valid score</Form.Control.Feedback>
        </Form.Group>
        <Button className="ml-3" type="submit">
          Create
        </Button>
        {showError && <Alert variant="danger">Failed to create course.</Alert>}
      </Form>
    </Container>
  )
}

export default AddAssignment
