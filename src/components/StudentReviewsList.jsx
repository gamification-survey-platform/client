import { Space, Col, Typography, Tag } from 'antd'
import { Link } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'

const ReviewList = ({ title, color, reviews }) => (
  <>
    <Typography.Title level={5}>{title}</Typography.Title>
    {reviews.map((review) => {
      const { course_id, assignment_id } = review
      return (
        <Link
          key={review.id}
          to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
          <Tag role="button" color={color} className={styles.tag}>
            {review.reviewing}
          </Tag>
        </Link>
      )
    })}
  </>
)

const StudentReviewsList = ({
  artifactReviews,
  showPending = true,
  showLate = true,
  showCompleted = true
}) => {
  const pendingReviews = artifactReviews.filter((r) => r.status === 'INCOMPLETE')
  const lateReviews = artifactReviews.filter((r) => r.status === 'LATE')
  const completedReviews = artifactReviews.filter((r) => r.status === 'COMPLETED')
  return (
    <Col span={6} className="border-left p-5 my-3">
      <Space direction="vertical" size="middle" className="text-center">
        {showLate ? (
          <ReviewList title={'Late Reviews'} color="volcano" reviews={lateReviews} />
        ) : null}
        {showPending ? (
          <ReviewList title={'Pending Reviews'} color="gold" reviews={pendingReviews} />
        ) : null}
        {showCompleted ? (
          <ReviewList title={'Completed Reviews'} color="green" reviews={completedReviews} />
        ) : null}
      </Space>
    </Col>
  )
}

export default StudentReviewsList
