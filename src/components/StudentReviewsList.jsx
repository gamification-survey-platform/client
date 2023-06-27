import { Space, Col, Typography, Tag } from 'antd'
import { Link, useParams } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'

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
