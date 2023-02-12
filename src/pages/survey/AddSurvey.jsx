import { useEffect, useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import { createSurvey } from '../../store/survey/surveySlice'
import surveySelector from '../../store/survey/selectors'
import routeSelector from '../../store/routes/selectors'
import AssignmentSurvey from '../assignments/AssignmentSurvey'

const AddSurvey = () => {
  const [showError, setShowError] = useState(false)
  const [releaseDate, setReleaseDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const dispatch = useDispatch()
  const { survey, status } = useSelector(surveySelector)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'failed') setShowError(true)
    else if (status === 'success') {
      const { course_id, assignment_id } = survey
      navigate(`/courses/${course_id}/assignments/${assignment_id}/survey`)
    }
  }, [status])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.currentTarget)
    const formObj = Object.fromEntries(formData.entries())
    const surveyData = { ...formObj, ...params }
    dispatch(createSurvey(surveyData))
  }

  return (
    <Container className="mt-5 text-left">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Instruction (optional):</Form.Label>
          <Col>
            <Form.Control as="textarea" name="instruction" rows={3} />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Additional Information (optional):</Form.Label>
          <Col xs="5">
            <Form.Control as="textarea" name="information" rows={3} />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Release date:</Form.Label>
          <DatePicker
            selected={releaseDate}
            showTimeSelect
            dateFormat="Pp"
            onChange={setReleaseDate}
          />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Due date:</Form.Label>
          <DatePicker selected={dueDate} showTimeSelect dateFormat="Pp" onChange={setDueDate} />
        </Form.Group>
        <Button className="ml-3" type="submit">
          Create
        </Button>
        {showError && <Alert variant="danger">Failed to create survey.</Alert>}
      </Form>
    </Container>
  )
}

export default AddSurvey
