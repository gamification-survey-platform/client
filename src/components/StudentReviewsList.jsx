import { Space, Col, Typography, Tag } from 'antd'
import { Link, useParams } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetSurvey } from '../store/survey/surveySlice'
import { Tooltip } from 'antd';

const ReviewList = ({ title, color, reviews }) => {
  const { course_id } = useParams()

  return (
    <>
      <Typography.Title level={5}>{title}</Typography.Title>
      {reviews.map((review) => {
        const { course_number, assignment_id, assignment_type } = review
        let tagTitle = ''
        if (!course_id) tagTitle += `${course_number}: `
        if (assignment_type === 'Team') tagTitle += `Team `
        tagTitle += `${review.reviewing}`
        return (
          <Link
            key={review.id}
            to={`/courses/${course_number}/assignments/${assignment_id}/reviews/${review.id}`}>
            <Tag role="button" color={color} className={styles.tag}>
              {tagTitle}
            </Tag>
          </Link>
        )
      })}
    </>
  )
}

const StudentReviewsList = ({
  artifactReviews,
  showReopen = true,
  showPending = true,
  showLate = true,
  showOptional = true,
  showCompleted = false
}) => {
  const dispatch = useDispatch()
  const reopenReviews = artifactReviews.filter((r) => r.status === 'REOPEN')
  const pendingReviews = artifactReviews.filter((r) => r.status === 'INCOMPLETE')
  const lateReviews = artifactReviews.filter((r) => r.status === 'LATE')
  const completedReviews = artifactReviews.filter((r) => r.status === 'COMPLETED')
  const optionalReviews = artifactReviews.filter((r) => r.status === 'OPTIONAL_INCOMPLETE')
  console.log('optionalReviews', artifactReviews)
  useEffect(() => {
    dispatch(resetSurvey())

  }, [])

  return (
    <Col span={6} className="border-left p-5 my-3">
      <Space direction="vertical" size="middle" className="text-center">
        {showReopen ? (
          <ReviewList title={'Reopened Reviews'} color="magenta" reviews={reopenReviews} />
        ) : null}
        {showLate ? (
          <ReviewList title={
            <span>
            Late Reviews {' '}
            <Tooltip title="5 points each">
              <span style={{ cursor: 'help' }}>?</span>
            </Tooltip>
          </span>
          } color="volcano" reviews={lateReviews} />
        ) : null}
        {showPending ? (
          <ReviewList title={
            <span>
            Mandatory Reviews {' '}
            <Tooltip title="10 points each">
              <span style={{ cursor: 'help' }}>?</span>
            </Tooltip>
          </span>
          } color="gold" reviews={pendingReviews} />
        ) : null}
        {showOptional && pendingReviews.length === 0? (
          <ReviewList title={
            <span>
            Optional Reviews {' '}
            <Tooltip title="15 points each">
              <span style={{ cursor: 'help' }}>?</span>
            </Tooltip>
          </span>
          } 
          color="blue" 
          reviews={optionalReviews} />
        ) : (<ReviewList title={            <span>
          Optional Reviews {' '}
          <Tooltip title="15 points each. The optional reviews will show when you finish all the mandatory reviews">
            <span style={{ cursor: 'help' }}>?</span>
          </Tooltip>
        </span>} color="gold" reviews={[]}/>)}
        {/* {showOptional && pendingReviews.length === 0 ? (
          <ReviewList title={'Optional Reviews'} color="blue" reviews={optionalReviews} />
        ) : null} */}
        {showCompleted ? (
          <ReviewList title={'Completed Reviews'} color="green" reviews={completedReviews} />
        ) : null}
      </Space>
    </Col>
  )
}

export default StudentReviewsList
