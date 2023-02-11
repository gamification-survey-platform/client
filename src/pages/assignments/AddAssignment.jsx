import { useEffect, useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { createCourse } from '../../store/course/courseSlice'
import courseSelector from '../../store/course/selectors'

const AddAssignment = () => {
  const [validated, setValidated] = useState(false)
  const [showError, setShowError] = useState(false)
  const dispatch = useDispatch()
  const { status } = useSelector(courseSelector)
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'failed') setShowError(true)
    else if (status === 'success') navigate(-1)
  }, [status])

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      const formData = new FormData(event.currentTarget)
      const formObj = Object.fromEntries(formData.entries())
      dispatch(createCourse(formObj))
    }
    setValidated(true)
  }

  return (
    <Container className="mt-5 text-left">
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
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Type:</Form.Label>
          <Form.Select name="type">
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Submission type:</Form.Label>
          <Form.Select name="submissionType">
            <option value="file">File</option>
            <option value="url">URL</option>
            <option value="text">Text</option>
          </Form.Select>
          <Form.Group className="mb-3">
            <Form.Label className="ml-3">Total Score:</Form.Label>
            <Col xs="5">
              <Form.Control required name="score" />
              <Form.Control.Feedback type="invalid">Please enter valid score</Form.Control.Feedback>
            </Col>
          </Form.Group>
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
