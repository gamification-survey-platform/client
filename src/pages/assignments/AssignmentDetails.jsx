import { useEffect, useState } from 'react'
import { Row, Col, Button, Tag, Typography, Divider, Space, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAssignment } from '../../api/assignments'
import userSelector from '../../store/user/selectors'
import coursesSelector from '../../store/courses/selectors'
import { FileSubmission } from './Submission'
import { Link } from 'react-router-dom'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { getUserArtifact, submitArtifact } from '../../api/artifacts'
import PdfPreview from './PdfPreview'
import { getArtifactReviewers, getAssignmentArtifactReviews } from '../../api/artifactReview'
import Spinner from '../../components/Spinner'
import { setUser } from '../../store/user/userSlice'
import StudentReviewsList from '../../components/StudentReviewsList'
import StaffArtifactReviewList from '../../components/StaffArtifactReviewList'
import StaffSubmissionList from '../../components/StaffSubmissionList'
import { addCoursePoints } from '../../store/courses/coursesSlice'
import { FaHandPointRight } from 'react-icons/fa'
import { sendNotification } from '../../api/notifications'

const AssignmentDetails = () => {
  const { assignment_id, course_id } = useParams()
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const [artifact, setArtifact] = useState()
  const [artifactReviewers, setArtifactReviewers] = useState()
  const [spin, setSpin] = useState(false)
  const [artifactReviews, setArtifactReviews] = useState([])
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
  const [messageApi, contextHolder] = message.useMessage()
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)

  const fetchAssignmentArtifactReviews = async () => {
    const res = await getAssignmentArtifactReviews({ course_id: selectedCourse.pk, assignment_id })
    if (res.status === 200) {
      setArtifactReviews(res.data)
    } else messageApi.open({ type: 'error', content: 'Failed to fetch artifact reviews.' })
  }

  const fetchArtifact = async () => {
    const res = await getUserArtifact({ course_id: selectedCourse.pk, assignment_id })
    if (res.status === 200) {
      setArtifact(res.data)
    } else messageApi.open({ type: 'error', content: 'Failed to fetch artifact reviews.' })
  }

  useEffect(() => {
    const fetchAssignment = async () => {
      setSpin(true)
      const res = await getAssignment({ course_id: selectedCourse.pk, assignment_id })
      if (res.status === 200) {
        setAssignment(res.data.assignment)
      } else messageApi.open({ type: 'error', content: 'Failed to fetch assignment.' })
    }
    fetchAssignment()
    fetchAssignmentArtifactReviews()
    setSpin(false)
  }, [])

  useEffect(() => {
    if (!user.is_staff) fetchArtifact()
  }, [])

  useEffect(() => {
    const fetchArtifactReviews = async () => {
      const res = await getArtifactReviewers({
        course_id: selectedCourse.pk,
        assignment_id,
        artifact_id: artifact.artifact_pk
      })
      if (res.status === 200) {
        const incompleteReviewers = res.data.filter(
          (reviewer) =>
            reviewer.status === 'INCOMPLETE' ||
            reviewer.status === 'REOPEN' ||
            reviewer.status === 'LATE'
        )
        setArtifactReviewers(incompleteReviewers)
      }
    }
    if (artifact) {
      fetchArtifactReviews()
    }
  }, [artifact])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await submitArtifact({
        course_id: selectedCourse.pk,
        assignment_id,
        submission
      })
      messageApi.open({ type: 'success', content: 'Successfully submitted assignment.' })
      if (res.status === 201) {
        const { exp, points } = res.data
        dispatch(setUser({ ...user, exp }))
        dispatch(addCoursePoints({ course_id: selectedCourse.pk, points }))
      }
      await fetchArtifact()
      setSubmission()
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
      setSubmission()
    }
  }

  const handlePokeReviewer = async (e, reviewerAndrewId, reviewer_id) => {
    e.preventDefault()
    e.stopPropagation
    try {
      const res = await sendNotification({
        type: 'POKE',
        receiver: reviewer_id,
        text: `Please review my submission for ${assignment.assignment_name}!`
      })
      if (res.status === 201) {
        messageApi.open({ type: 'success', content: `Poked ${reviewerAndrewId}!` })
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
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
      {contextHolder}
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
        {user.is_staff ? (
          <StaffSubmissionList />
        ) : (
          <StudentReviewsList artifactReviews={artifactReviews} />
        )}
      </Row>
      <Divider />
      <Row>
        {user.is_staff ? (
          <StaffArtifactReviewList />
        ) : (
          <>
            <Col span={5}>
              <Space direction="vertical" className="mt-3">
                {!artifact && (
                  <Row>
                    {assignment.submission_type === 'URL' && (
                      <FileSubmission {...submissionProps} />
                    )}
                    {assignment.submission_type === 'File' && (
                      <FileSubmission {...submissionProps} />
                    )}
                    {assignment.submission_type === 'Text' && (
                      <FileSubmission {...submissionProps} />
                    )}
                  </Row>
                )}
                {artifact && (
                  <Row className="text-center">
                    <Link
                      to={`/courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact.artifact_pk}/reports`}>
                      <Button type="primary">View Reports</Button>
                    </Link>
                  </Row>
                )}
              </Space>
              {artifactReviewers ? (
                <Space direction="vertical" className="mt-3">
                  <Typography.Title level={4}>Your Pending Reviewers</Typography.Title>
                  <Typography.Text>Poke them to remind them to review!</Typography.Text>
                  {artifactReviewers.map((reviewer, i) => {
                    const { reviewer: reviewerAndrewId, user: reviewer_id, pokable } = reviewer
                    return (
                      <Button
                        disabled={!pokable}
                        key={i}
                        onClick={(e) => handlePokeReviewer(e, reviewerAndrewId, reviewer_id)}>
                        <FaHandPointRight
                          size={'1.5em'}
                          className="mr-3"
                          style={{ color: pokable ? 'gold' : '' }}
                        />
                        {reviewerAndrewId}
                      </Button>
                    )
                  })}
                </Space>
              ) : null}
            </Col>
            {artifact && (
              <Col span={2} offset={4}>
                <PdfPreview artifact={artifact} />
              </Col>
            )}
          </>
        )}
      </Row>
    </div>
  )
}

export default AssignmentDetails
