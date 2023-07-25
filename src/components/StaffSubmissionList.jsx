import { useEffect, useState, useCallback } from 'react'
import { getAssignmentArtifactReviews } from '../api/artifactReview'
import { Space, Row, Tag, Col, Typography } from 'antd'
import { getMembers } from '../api/members'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import coursesSelector from '../store/courses/selectors'
import { getArtifact } from '../api/artifacts'
import { Link } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'

const StaffSubmissionList = () => {
  const [artifacts, setArtifacts] = useState({})
  const [pendingMembers, setPendingMembers] = useState([])
  const { course_id: courseNumber, assignment_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => courseNumber === course_number)
  useEffect(() => {
    const fetchArtifacts = async () => {
      const res = await getAssignmentArtifactReviews({ course_id: course.pk, assignment_id })
      const allArtifactReviews = {}
      for (const review of res.data) {
        const { reviewing } = review
        allArtifactReviews[reviewing] = review.artifact
      }
      const allArtifacts = {}
      await Promise.all(
        Object.keys(allArtifactReviews).map(async (reviewing) => {
          const res = await getArtifact({
            course_id: course.pk,
            assignment_id,
            artifact_pk: allArtifactReviews[reviewing]
          })
          allArtifacts[reviewing] = res.data
        })
      )
      setArtifacts(allArtifacts)
    }
    fetchArtifacts()
  }, [])

  useEffect(() => {
    const fetchCourseMembers = async () => {
      const res = await getMembers({ course_id: course.pk })
      if (res.status === 200) {
        const allMembers = res.data
          .filter(({ is_staff }) => !is_staff)
          .map(({ andrew_id }) => andrew_id)
        const completedMembers = Object.keys(artifacts)
        const filteredPendingMembers = allMembers.filter(
          (member) => completedMembers.indexOf(member) === -1
        )
        setPendingMembers(filteredPendingMembers)
      }
    }
    fetchCourseMembers()
  }, [artifacts])
  return (
    <Col span={6} className="border-left p-5 my-3">
      <Space direction="vertical" size="middle" className="text-center">
        <Typography.Title level={5}>Completed Submissions</Typography.Title>
        {Object.keys(artifacts).map((reviewee) => {
          const { artifact_pk, file_path } = artifacts[reviewee]
          return (
            <Space direction="vertical" key={`${reviewee}-completed`}>
              <Row>{reviewee}</Row>
              <Row>
                <Link to={file_path}>
                  <Tag role="button" color="green" className={styles.tag}>
                    Submission
                  </Tag>
                </Link>
                <Link
                  to={`/courses/${courseNumber}/assignments/${assignment_id}/artifacts/${artifact_pk}/reports`}>
                  <Tag role="button" color="blue" className={styles.tag}>
                    Reviews
                  </Tag>
                </Link>
              </Row>
            </Space>
          )
        })}
        <Typography.Title level={5}>Pending Submissions</Typography.Title>
        {pendingMembers.map((reviewee) => {
          return (
            <Tag key={`${reviewee}-pending`} className={styles.tag}>
              {reviewee}
            </Tag>
          )
        })}
      </Space>
    </Col>
  )
}

export default StaffSubmissionList
