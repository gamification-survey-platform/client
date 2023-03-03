import { Col, Container, Row, Form, Button } from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAssignment } from '../../api/assignments'
import coursesSelector from '../../store/courses/selectors'
import { URLSubmission, TextSubmission, FileSubmission } from './Submission'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { getArtifact, submitArtifact } from '../../api/artifacts'
import { Document, Page, pdfjs } from 'react-pdf'
const AssignmentDetails = () => {
  const { assignment_id, course_id } = useParams()
  const inputRef = useRef()
  const [userRole, setUserRole] = useState()
  const [artifact, setArtifact] = useState()
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
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    const fetchAssignment = async () => {
      const res = await getAssignment({ course_id: selectedCourse.pk, assignment_id })
      if (res.status === 200) {
        setAssignment(res.data.assignment)
        setUserRole(res.data.user_role)
      } else setShowError(true)
    }

    const fetchArtifact = async () => {
      const res = await getArtifact({ course_id: selectedCourse.pk, assignment_id })
      if (res.status === 200) {
        setArtifact(res.data)
      } else setShowError(true)
    }
    fetchAssignment()
    fetchArtifact()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await submitArtifact({ course_id: selectedCourse.pk, assignment_id, submission })
      if (res.status === 201) {
        inputRef.current.value = null
        setSubmission()
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
          <hr />
          <p>{assignment.description}</p>
        </Col>
      </Row>
      <Document file={artifact} onLoadSuccess={console.log}>
        {' '}
        <Page pageNumber={1} />
      </Document>
      {userRole === 'Student' && (
        <Row>
          {assignment.submission_type === 'URL' && <FileSubmission {...submissionProps} />}
          {assignment.submission_type === 'File' && <FileSubmission {...submissionProps} />}
          {assignment.submission_type === 'Text' && <FileSubmission {...submissionProps} />}
        </Row>
      )}
    </Container>
  )
}

export default AssignmentDetails
