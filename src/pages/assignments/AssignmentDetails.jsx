import { Col, Container, Row, Form, Button, Alert } from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAssignment } from '../../api/assignments'
import coursesSelector from '../../store/courses/selectors'
import { URLSubmission, TextSubmission, FileSubmission } from './Submission'
import { Link } from 'react-router-dom'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { getArtifact, submitArtifact } from '../../api/artifacts'
import PdfPreview from './PdfPreview'
import { getArtifactReviews } from '../../api/artifactReview'
import { isInstructorOrTA } from '../../utils/roles'

const AssignmentDetails = () => {
  const { assignment_id, course_id } = useParams()
  const inputRef = useRef()
  const [userRole, setUserRole] = useState()
  const [artifact, setArtifact] = useState()
  const [completedArtifactReviews, setCompletedArtifactReviews] = useState([])
  const [pendingArtifactReviews, setPendingArtifactReviews] = useState([])
  const [submission, setSubmission] = useState()
  const [assignment, setAssignment] = useState({
    assignment_name: '',
    assignment_type: '',
    description: '',
    total_score: 0,
    weight: 0,
    course: 0,
    date_due: new Date(),
    pk: 0,
    review_assign_policy: '',
    submission_type: ''
  })
  const [error, setShowError] = useState(false)
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)

  const fetchArtifactReviews = async () => {
    const res = await getArtifactReviews({ course_id: selectedCourse.pk, assignment_id })
    if (res.status === 200) {
      setPendingArtifactReviews(res.data.filter((r) => r.status === 'INCOMPLETE'))
      setCompletedArtifactReviews(res.data.filter((r) => r.status === 'COMPLETE'))
    } else setShowError(true)
  }

  const fetchArtifact = async () => {
    const res = await getArtifact({ course_id: selectedCourse.pk, assignment_id })
    if (res.status === 200) {
      setArtifact(res.data)
    } else setShowError(true)
  }
  useEffect(() => {
    const fetchAssignment = async () => {
      const res = await getAssignment({ course_id: selectedCourse.pk, assignment_id })
      if (res.status === 200) {
        setAssignment(res.data.assignment)
        setUserRole(res.data.user_role)
      } else setShowError(true)
    }
    fetchAssignment()
    fetchArtifact()
    fetchArtifactReviews()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await submitArtifact({ course_id: selectedCourse.pk, assignment_id, submission })
      if (res.status === 201) {
        inputRef.current.value = null
        setSubmission()
        await fetchArtifact()
      }
    } catch (e) {
      setShowError(true)
    }
  }

  const submissionProps = {
    inputRef,
    submission,
    setSubmission,
    handleSubmit
  }

  return (
    <Container className="m-3">
      <Row>
        <Col xs="9">
          <div className="text-center">
            <h3>{assignment.assignment_name}</h3>
            <hr />
            <Row>
              <Col>Type: {assignment.assignment_type}</Col>
            </Row>
            <hr />
            <Row>
              <Col>Total Score: {assignment.total_score}</Col>
              <Col>Weight: {assignment.weight}</Col>
              <Col>Due date: {assignment.date_due.toDateString()}</Col>
            </Row>
          </div>
          <hr />
          <p>{assignment.description}</p>
        </Col>
        <Col xs="3">
          {userRole === 'Student' && (
            <div className="border-left border-secondary p-3">
              <div>
                <h5>Completed Surveys</h5>
                {completedArtifactReviews.map((review, i) => {
                  return (
                    <Link
                      key={i}
                      to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                      <Button variant="secondary">{review.reviewing}</Button>
                    </Link>
                  )
                })}
                <h5>Pending Surveys</h5>
                {pendingArtifactReviews.map((review, i) => {
                  return (
                    <Link
                      key={i}
                      to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                      <Button variant="warning">{review.reviewing}</Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs="3">
          {!isInstructorOrTA(userRole) && (
            <Row>
              {assignment.submission_type === 'URL' && <FileSubmission {...submissionProps} />}
              {assignment.submission_type === 'File' && <FileSubmission {...submissionProps} />}
              {assignment.submission_type === 'Text' && <FileSubmission {...submissionProps} />}
            </Row>
          )}
        </Col>
        <Col xs="2">
          <PdfPreview artifact={artifact} />
        </Col>
      </Row>
      {error && (
        <Alert className="mt-3" type="danger">
          Failed to load assignment details.
        </Alert>
      )}
    </Container>
  )
}

export default AssignmentDetails
