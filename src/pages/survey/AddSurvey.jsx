import { useState } from 'react'
import { Button, Form, Col, Alert, Input, DatePicker } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createSurvey } from '../../api/survey'
import coursesSelector from '../../store/courses/selectors'
import { isBefore, isInFuture } from '../../utils/dateUtils'

const AddSurvey = () => {
  const [message, setMessage] = useState()
  const [datesValid, setDatesValid] = useState(true)
  const courses = useSelector(coursesSelector)
  const { course_id, assignment_id } = useParams()
  const navigate = useNavigate()
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const [form] = useForm()

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const fields = form.getFieldsValue()
    const { date_due, date_released } = fields
    const datesValid = date_released.isBefore(date_due)
    setDatesValid(datesValid)
    if (form.validateFields() && datesValid) {
      const surveyData = {
        course_id: selectedCourse.pk,
        assignment_id,
        survey: {
          ...fields,
          date_due: date_due.format('MM/DD/YYYY hh:mm'),
          date_released: date_released.format('MM/DD/YYYY hh:mm')
        }
      }
      const res = await createSurvey(surveyData)
      if (res.status === 201 || res.status === 200) navigate(-1)
      else setMessage({ type: 'error', message: 'Failed to create survey.' })
    }
  }

  return (
    <div className="m-3">
      <Form form={form} initialValues={{ template_name: 'Default Template', other_info: '' }}>
        <Form.Item
          label="Template Name"
          name="template_name"
          rules={[{ required: true, message: 'Please input a template name' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="instructions"
          rules={[{ required: true, message: 'Please fill out instructions' }]}>
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item label="Other information" name="other_info">
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item label="Date due" name="date_due">
          <DatePicker showTime={{ format: 'HH:mm' }} />
        </Form.Item>
        <Form.Item label="Date released" name="date_released">
          <DatePicker showTime={{ format: 'HH:mm' }} />
        </Form.Item>
        {!datesValid && (
          <Alert className="mt-3" type="warning" message="Due date must be after release date." />
        )}
        <Form.Item className="text-center">
          <Button className="mt-3" type="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Form.Item>
        {message && <Alert className="mt-3" {...message} />}
      </Form>
    </div>
  )
}
/*
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
*/
export default AddSurvey
