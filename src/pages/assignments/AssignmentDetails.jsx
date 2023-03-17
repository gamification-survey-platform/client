import { useEffect, useState, useRef } from 'react'
import { Row, Col, Button, Tag, Alert, Typography, Divider, Space } from 'antd'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAssignment } from '../../api/assignments'
import coursesSelector from '../../store/courses/selectors'
import { FileSubmission } from './Submission'
import { Link } from 'react-router-dom'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { getUserArtifact, submitArtifact } from '../../api/artifacts'
import PdfPreview from './PdfPreview'
import { getArtifactReviews } from '../../api/artifactReview'
import { isStudent } from '../../utils/roles'
import Spinner from '../../components/Spinner'
import ChartWrapper from '../../components/visualization/ChartWrapper'

const AssignmentDetails = () => {
  const { assignment_id, course_id } = useParams()
  const [userRole, setUserRole] = useState()
  const [artifact, setArtifact] = useState()
  const [spin, setSpin] = useState(false)
  const [completedArtifactReviews, setCompletedArtifactReviews] = useState([])
  const [pendingArtifactReviews, setPendingArtifactReviews] = useState([])
  const [lateArtifactReviews, setLateArtifactReviews] = useState([])
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
  const [message, setShowMessage] = useState()
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)

  const fetchArtifactReviews = async () => {
    const res = await getArtifactReviews({ course_id: selectedCourse.pk, assignment_id })
    if (res.status === 200) {
      setPendingArtifactReviews(res.data.filter((r) => r.status === 'INCOMPLETE'))
      setCompletedArtifactReviews(res.data.filter((r) => r.status === 'COMPLETE'))
      setLateArtifactReviews(res.data.filter((r) => r.status === 'LATE'))
    } else setShowMessage({ type: 'error', message: 'Failed to fetch artifact reviews.' })
  }

  const fetchArtifact = async () => {
    const res = await getUserArtifact({ course_id: selectedCourse.pk, assignment_id })
    if (res.status === 200) {
      const contentDisposition = res.headers['content-disposition']
      const regex = /attachment; filename=artifact_(\d+)\.pdf/gm
      const artifact_pk = regex.exec(contentDisposition)[1]
      setArtifact({ data: res.data, artifact_pk })
    } else setShowMessage({ type: 'error', message: 'Failed to fetch artifact.' })
  }

  useEffect(() => {
    const fetchAssignment = async () => {
      setSpin(true)
      const res = await getAssignment({ course_id: selectedCourse.pk, assignment_id })
      if (res.status === 200) {
        setAssignment(res.data.assignment)
        setUserRole(res.data.user_role)
      } else setShowMessage({ type: 'error', message: 'Failed to fetch assignment.' })
    }
    fetchAssignment()
    fetchArtifactReviews()
    setSpin(false)
  }, [])

  useEffect(() => {
    if (isStudent(userRole)) fetchArtifact()
  }, [userRole])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await submitArtifact({ course_id: selectedCourse.pk, assignment_id, submission })
      if (res.status === 201) {
        setSubmission()
        await fetchArtifact()
      }
    } catch (e) {
      setShowMessage({ type: 'error', message: 'Failed to submit assignment.' })
    }
  }

  const submissionProps = {
    submission,
    setSubmission,
    handleSubmit
  }

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <div className="m-5">
      <Row>
        <Col span={17}>
          <div className="text-center">
            <Typography.Title level={3}>{assignment.assignment_name}</Typography.Title>
            <Divider />
            <Space>Type: {assignment.assignment_type}</Space>
            <Divider />
            <Space>
              <Col>Total Score: {assignment.total_score}</Col>
              <Col>Weight: {assignment.weight}</Col>
              <Col>Due date: {assignment.date_due.toDateString()}</Col>
            </Space>
          </div>
          <Divider />
          <Typography.Text>{assignment.description}</Typography.Text>
        </Col>
        <Col span={6} offset={1}>
          {isStudent(userRole) && (
            <Space direction="vertical" size="middle" className="text-center">
              <Typography.Title level={5}>Completed Surveys</Typography.Title>
              {completedArtifactReviews.map((review, i) => {
                return (
                  <Link
                    key={i}
                    to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                    <Tag role="button" color="green">
                      {review.reviewing}
                    </Tag>
                  </Link>
                )
              })}
              <Typography.Title level={5}>Pending Surveys</Typography.Title>
              {pendingArtifactReviews.map((review, i) => {
                return (
                  <Link
                    key={i}
                    to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                    <Tag role="button" color="gold">
                      {review.reviewing}
                    </Tag>
                  </Link>
                )
              })}
              <Typography.Title level={5}>Late Surveys</Typography.Title>
              {lateArtifactReviews.map((review, i) => {
                return (
                  <Link
                    key={i}
                    to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                    <Tag role="button" color="volcano">
                      {review.reviewing}
                    </Tag>
                  </Link>
                )
              })}
            </Space>
          )}
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs="3">
          {isStudent(userRole) && (
            <Space direction="vertical" className="mt-3">
              <Row>
                {assignment.submission_type === 'URL' && <FileSubmission {...submissionProps} />}
                {assignment.submission_type === 'File' && <FileSubmission {...submissionProps} />}
                {assignment.submission_type === 'Text' && <FileSubmission {...submissionProps} />}
              </Row>
              {artifact && (
                <Row className="text-center">
                  <Link
                    to={`/courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact.artifact_pk}/reports`}>
                    <Button type="primary">View Reports</Button>
                  </Link>
                </Row>
              )}
            </Space>
          )}
        </Col>
        {artifact && (
          <>
            <Col xs="2">
              <PdfPreview artifact={artifact} />
            </Col>
          </>
        )}
      </Row>
      {message && <Alert className="mt-3" {...message} />}
    </div>
  )
}

export default AssignmentDetails
