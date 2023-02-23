import { useEffect, useRef, useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useMatch, useNavigate } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import DatePicker from 'react-datepicker'
import { useParams } from 'react-router'
import { createAssignment, editAssignment } from '../../api/assignments'

const AddAssignment = () => {
  const [validated, setValidated] = useState(false)
  const [showError, setShowError] = useState(false)
  const [releaseDate, setReleaseDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const formRef = useRef()
  const params = useParams()
  const { state: editingAssignment } = useLocation()
  const { courses } = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === params.course_id)
  const navigate = useNavigate()

  useEffect(() => {
    if (formRef && formRef.current && editingAssignment) {
      for (let k of Object.keys(editingAssignment)) {
        if (formRef.current[`${k}`]) {
          formRef.current[`${k}`].value = editingAssignment[`${k}`]
        }
      }
    }
  }, [])
  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity()) {
      const formData = new FormData(event.currentTarget)
      let formObj = Object.fromEntries(formData.entries())
      formObj = { ...formObj, course: selectedCourse.pk }
      try {
        const res = editingAssignment
          ? await editAssignment({
              coursePk: selectedCourse.pk,
              assignment: formObj,
              assignment_id: editingAssignment.id
            })
          : await createAssignment({ coursePk: selectedCourse.pk, assignment: formObj })
        if (editingAssignment && res.status === 200) navigate(-1)
        else if (res.status === 201) navigate(-1)
      } catch (e) {
        setShowError(true)
      }
    }
    setValidated(true)
  }

  return (
    <Container className="my-5 text-left">
      <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="blah">
          <Form.Label className="ml-3">Assignment name:</Form.Label>
          <Col xs="5">
            <Form.Control required name="assignment_name" />
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
          <Form.Select className="w-25" name="assignment_type">
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Submission type:</Form.Label>
          <Form.Select className="w-25" name="submission_type">
            <option value="File">File</option>
            <option value="URL">URL</option>
            <option value="Text">Text</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Review assignment policy:</Form.Label>
          <Form.Select className="w-25" name="review_assign_policy">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Release date:</Form.Label>
          <DatePicker
            name="date_released"
            selected={releaseDate}
            onChange={setReleaseDate}
            showTimeSelect
            dateFormat="Pp"
          />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Due date:</Form.Label>
          <DatePicker
            name="date_due"
            selected={dueDate}
            onChange={setDueDate}
            showTimeSelect
            dateFormat="Pp"
          />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Total Score:</Form.Label>
          <Form.Control className="w-25" required name="total_score" />
          <Form.Control.Feedback type="invalid">Please enter valid score</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>Weight:</Form.Label>
          <Form.Control className="w-25" required name="weight" />
          <Form.Control.Feedback type="invalid">Please enter valid weight</Form.Control.Feedback>
        </Form.Group>
        <Button className="ml-3" variant={editingAssignment ? 'warning' : 'primary'} type="submit">
          {editingAssignment ? 'Edit' : 'Create'}
        </Button>
        {showError && (
          <Alert className="mt-3" variant="danger">
            Failed to create assignment.
          </Alert>
        )}
      </Form>
    </Container>
  )
}

export default AddAssignment
