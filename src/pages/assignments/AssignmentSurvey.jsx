import { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Button, Alert, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router'
import AddSectionModal from '../survey/AddSectionModal'
import Section from '../survey/Section'
import { getSurvey, getSurveyDetails, saveSurvey } from '../../api/survey'
import { useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'

const AssignmentSurvey = () => {
  const [survey, setSurvey] = useState({
    pk: -1,
    name: '',
    instructions: '',
    other_info: '',
    sections: []
  })
  const [studentView, setStudentView] = useState(false)
  const { course_id, assignment_id } = useParams()
  const { user } = useSelector(userSelector)
  const useStudentView = studentView || user.role === 'Student'
  const { courses } = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const formRef = useRef()

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await getSurvey({ courseId: selectedCourse.pk, assignmentId: assignment_id })
        if (res.status === 404) {
          navigate(`/courses/${course_id}/assignments/${assignment_id}/survey/add`)
        } else if (res.status === 200) {
          const res = await getSurveyDetails({
            courseId: selectedCourse.pk,
            assignmentId: assignment_id
          })
          if (res.status === 200) {
            setSurvey(res.data)
          }
        }
      } catch (e) {
        setShowError(true)
      }
    }
    fetchSurvey()
  }, [])

  const handleSaveSurvey = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current)
        const formObj = Object.fromEntries(formData.entries())
        const res = await saveSurvey({
          courseId: selectedCourse.pk,
          assignmentId: assignment_id,
          survey
        })
        if (res.status === 200) navigate(-1)
      }
    } catch (e) {
      setShowError(true)
    }
  }
  return (
    <div>
      <Container className="my-5">
        <Row>
          <Col xs="6">
            {survey && (
              <div>
                <h2>{survey.name}</h2>
                <h2>{survey.instructions}</h2>
                <h2>{survey.other_info}</h2>
              </div>
            )}
          </Col>
          <Col>
            {user.role !== 'Student' && (
              <Button variant="info" className="m-3" onClick={() => setStudentView(!studentView)}>
                {useStudentView ? 'Instructor View' : 'Student View'}
              </Button>
            )}
            <Button variant="primary" className="m-3" onClick={() => setModalOpen(true)}>
              Add Section
            </Button>
          </Col>
          <AddSectionModal
            show={modalOpen}
            setShow={setModalOpen}
            survey={survey}
            setSurvey={setSurvey}
          />
        </Row>
        <hr />
        {survey && survey.sections && (
          <Form ref={formRef} onSubmit={handleSaveSurvey}>
            {survey.sections.map((section, i) => (
              <Section
                key={i}
                section={section}
                sectionIdx={i}
                survey={survey}
                setSurvey={setSurvey}
                studentView={studentView}
              />
            ))}
            <Button type="submit">Save Survey</Button>
            {showError && <Alert variant="danger">Failed to save survey.</Alert>}
          </Form>
        )}
      </Container>
    </div>
  )
}

export default AssignmentSurvey
