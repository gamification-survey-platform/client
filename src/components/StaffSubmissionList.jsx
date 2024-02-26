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

  const titleStyle = {
    lineHeight: '1',
    wordBreak: 'break-word',
    fontSize: '16px',
    textAlign: 'center',
    margin: '0 0 16px',
    padding: '0',
    width: '100%'
  }
  const itemSpacing = {
    marginBottom: '8px'
  }

  return (
    <Row gutter={16} className="my-3">
      <h5 style={titleStyle}>Completed &amp; Pending Submissions</h5>

      <Col span={12} className="p-5">
        {Object.keys(artifacts).map((reviewee) => {
          const { artifact_pk, file_path } = artifacts[reviewee]
          return (
            <Space direction="vertical" key={`${reviewee}-completed`} style={itemSpacing}>
              <Row>{reviewee}</Row>
              <Row>
                <Link to={file_path} style={itemSpacing}>
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
      </Col>
      <Col span={12} className="p-5 border-left">
        {pendingMembers.map((reviewee) => {
          return (
            <Tag key={`${reviewee}-pending`} className={styles.tag} style={itemSpacing}>
              {reviewee}
            </Tag>
          )
        })}
      </Col>
    </Row>
  )
}

export default StaffSubmissionList
