import { useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import { createSurvey } from '../../api/survey'
import coursesSelector from '../../store/courses/selectors'
import { isBefore, isInFuture } from '../../utils/dateUtils'

const AddSurvey = () => {
  const [showError, setShowError] = useState(false)
  const [releaseDate, setReleaseDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const courses = useSelector(coursesSelector)
  const { course_id, assignment_id } = useParams()
  const navigate = useNavigate()
  const selectedCourse = courses.find((course) => course.course_number === course_id)

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.currentTarget)
    const formObj = Object.fromEntries(formData.entries())
    const surveyData = {
      course_id: selectedCourse.pk,
      assignment_id,
      survey: formObj
    }
    const res = await createSurvey(surveyData)
    if (res.status === 201 || res.status === 200) navigate(-1)
    else setShowError(true)
  }

  const areDatesValid = isBefore(releaseDate, dueDate) && isInFuture(releaseDate)

  return (
    <Container className="mt-5 text-left">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Template Name:</Form.Label>
          <Col>
            <Form.Control
              as="textarea"
              defaultValue="Default Template"
              name="template_name"
              rows={3}
            />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Instruction (optional):</Form.Label>
          <Col>
            <Form.Control as="textarea" name="instructions" rows={3} />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Additional Information (optional):</Form.Label>
          <Col xs="5">
            <Form.Control as="textarea" name="other_info" rows={3} />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Release date:</Form.Label>
          <DatePicker
            selected={releaseDate}
            invalid={!areDatesValid}
            showTimeSelect
            dateFormat="Pp"
            name="date_released"
            onChange={setReleaseDate}
          />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Due date:</Form.Label>
          <DatePicker
            invalid={!areDatesValid}
            name="date_due"
            selected={dueDate}
            showTimeSelect
            dateFormat="Pp"
            onChange={setDueDate}
          />
        </Form.Group>
        {!areDatesValid && (
          <Alert variant="warning">Please select valid release and due dates</Alert>
        )}
        <Button className="ml-3" type="submit">
          Create
        </Button>
        {showError && <Alert variant="danger">Failed to create survey.</Alert>}
      </Form>
    </Container>
  )
}

export default AddSurvey
