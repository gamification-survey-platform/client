import { useEffect, useRef, useState } from 'react'
import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createCourse as createCourseApi, editCourse as editCourseApi } from '../../api/courses'
import { addCourse, editCourse } from '../../store/courses/coursesSlice'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'

const AddCourse = () => {
  const [validated, setValidated] = useState(false)
  const [showError, setShowError] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const navigate = useNavigate()
  const formRef = useRef()
  const params = useParams()
  const editingCourse = courses.find((course) => course.course_number === params.course_id)

  useEffect(() => {
    if (editingCourse && formRef && formRef.current) {
      for (let k of Object.keys(editingCourse)) {
        if (formRef.current[`${k}`]) {
          formRef.current[`${k}`].value = editingCourse[`${k}`]
        }
      }
    }
  }, [editingCourse, formRef, formRef?.current])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    if (form.checkValidity() !== false) {
      try {
        const formData = new FormData(event.currentTarget)
        const formObj = Object.fromEntries(formData.entries())
        const courseData = { ...formObj, andrew_id: user.andrewId }
        const res = editingCourse
          ? await editCourseApi({ courseId: editingCourse.pk, course: courseData })
          : await createCourseApi(courseData)
        if (res.status === 200) {
          if (editingCourse) {
            dispatch(editCourse({ pk: editingCourse.pk, course: res.data }))
          } else {
            dispatch(addCourse(res.data))
          }
          navigate(-1)
        }
      } catch (e) {
        setShowError(true)
      }
    }
    setValidated(true)
  }

  return (
    <Container className="mt-5 text-left">
      <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Course Number:</Form.Label>
          <Col xs="5">
            <Form.Control required name="course_number" />
            <Form.Control.Feedback type="invalid">
              Please enter a course number
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="ml-3">Course Name:</Form.Label>
          <Col xs="5">
            <Form.Control required name="course_name" />
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
          <Form.Control type="file" name="picture" />
        </Form.Group>
        <Form.Group className="mb-3 ml-3">
          <Form.Label>CATME File (Upload Json)</Form.Label>
          <Form.Control type="file" name="catme" />
        </Form.Group>
        <Button className="ml-3" variant={editingCourse ? 'warning' : 'primary'} type="submit">
          {editingCourse ? 'Edit' : 'Create'}
        </Button>
        {showError && (
          <Alert variant="danger">Failed to {editingCourse ? 'edit' : 'create'} course.</Alert>
        )}
      </Form>
    </Container>
  )
}

export default AddCourse
