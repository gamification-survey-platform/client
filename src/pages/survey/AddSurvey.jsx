import { useEffect, useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import { createSurvey } from '../../api/survey'

const AddSurvey = () => {
  const [showError, setShowError] = useState(false)
  const [releaseDate, setReleaseDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.currentTarget)
    const formObj = Object.fromEntries(formData.entries())
    const surveyData = { ...formObj, ...params, sections: [] }
    const res = await createSurvey(surveyData)
    if (res.status === 201) navigate(-1)
    else setShowError(true)
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
