import { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Button, Alert, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router'
import Section from '../survey/Section'
import { useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import { getArtifactReview, saveArtifactReview } from '../../api/artifactReview'

const AssignmentReview = () => {
  const [survey, setSurvey] = useState({
    pk: -1,
    name: '',
    instructions: '',
    other_info: '',
    sections: []
  })
  const { course_id, assignment_id, review_id } = useParams()
  const formRef = useRef()
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await getArtifactReview({
          course_id: selectedCourse.pk,
          assignment_id: assignment_id,
          review_id
        })
        if (res.status === 200) {
          setSurvey(res.data)
        }
      } catch (e) {
        setShowError(true)
      }
    }
    fetchReview()
  }, [])

  const handleSaveReview = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const formData = new FormData(formRef.current)
      const formObj = Object.fromEntries(formData.entries())
      const review = Object.keys(formObj).map((question_pk) => ({
        question_pk,
        answer_text: formObj[`${question_pk}`]
      }))
      const res = await saveArtifactReview({
        course_id: selectedCourse.pk,
        assignment_id: assignment_id,
        review_id,
        review: review
      })
      if (res.status === 200) navigate(-1)
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
        </Row>
        {survey && survey.sections && (
          <Form ref={formRef} onSubmit={handleSaveReview}>
            {survey.sections.map((section, i) => (
              <Section
                key={i}
                section={section}
                sectionIdx={i}
                survey={survey}
                setSurvey={setSurvey}
                studentView={true}
              />
            ))}
            <div className="text-center">
              <Button type="submit">Save Survey</Button>
              {showError && <Alert variant="danger">Failed to save survey.</Alert>}
            </div>
          </Form>
        )}
      </Container>
    </div>
  )
}

export default AssignmentReview
