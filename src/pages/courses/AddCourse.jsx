import { useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { createCourse } from '../../api/courses'

const AddCourse = () => {
  const [validated, setValidated] = useState(false)
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      try {
        const formData = new FormData(event.currentTarget)
        const formObj = Object.fromEntries(formData.entries())
        const res = await createCourse(formObj)
        if (res.status === 200) navigate(-1)
      } catch (e) {
        setShowError(true)
      }
    }
    setValidated(true)
  }

  return (
    <Container className="mt-5 text-left">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="blah">
          <Form.Label className="ml-3">Course Number:</Form.Label>
          <Col xs="5">
            <Form.Control required name="number" />
            <Form.Control.Feedback type="invalid">
              Please enter a course number
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Course Name:</Form.Label>
          <Col xs="5">
            <Form.Control required name="name" />
            <Form.Control.Feedback type="invalid">Please enter a course name</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Syllabus:</Form.Label>
          <Col>
            <Form.Control as="textarea" rows={3} name="syllabus" />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Semester:</Form.Label>
          <Col xs="5">
            <Form.Control name="semester" />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Check label={'Visible?'} name="visible" />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Choose a course image: </Form.Label>
          <Form.Control type="file" name="image" />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>CATME File (Upload Json)</Form.Label>
          <Form.Control type="file" name="catme" />
        </Form.Group>
        <Button className="ml-3" type="submit">
          Create
        </Button>
        {showError && <Alert variant="danger">Failed to create course.</Alert>}
      </Form>
    </Container>
  )
}

export default AddCourse
