import { Space, Row, Typography, Tag, Button, Modal } from 'antd'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetSurvey } from '../store/survey/surveySlice'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import ReactTurntable from 'react-turntable'
import 'react-turntable/assets/index.css'

const ReviewList = ({ title, reviews, color }) => {
  const { course_id } = useParams()
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [resultModalVisible, setResultModalVisible] = useState(false)
  const [turntableResult, setTurntableResult] = useState('')
  const [navigationUrl, setNavigationUrl] = useState('')
  const [selectedReview, setSelectedReview] = useState('')
  const reviewToPrizeMap = new Map()

  const prizes = ['x2 Points', '+5 Points', '+1 Points', '+2 Points']
  const options = {
    prizes,
    width: 500,
    height: 500,
    primaryColor: '#5755FE',
    secondaryColor: '#6AD4DD',
    fontStyle: {
      color: '#fff',
      size: '14px',
      fontVertical: true,
      fontWeight: 'bold',
      fontFamily: 'Microsoft YaHei'
    },
    speed: 1000,
    duration: 5000,
    clickText: 'Click',
    onStart() {
      return true
    },
    onComplete(prize) {
      setTurntableResult(prize)
      setIsModalVisible(false) // Close the turntable modal
      setResultModalVisible(true) // Show result modal
    }
  }

  const handleTagClick = (reviewUrl, color, e, review_id) => {
    e.preventDefault()
    setNavigationUrl(reviewUrl)
    setSelectedReview(review_id)

    if (color === 'blue') {
      if (localStorage.getItem('selectedReview') == review_id) {
        navigate(reviewUrl)
      } else if (localStorage.getItem('bonus') !== null) {
        if (reviewToPrizeMap.has(review_id)) {
          navigate(reviewUrl)
        } else {
          setIsModalVisible(true)
        }
      } else {
        localStorage.setItem('selectedReview', review_id)
        setIsModalVisible(true)
      }
    } else if (color !== 'grey') {
      localStorage.removeItem('bonus')
      navigate(reviewUrl)
    }
  }

  const handleCloseResultModal = () => {
    setResultModalVisible(false)
    if (navigationUrl) {
      localStorage.setItem('bonus', turntableResult)
      reviewToPrizeMap.set(selectedReview, turntableResult)
      localStorage.setItem('selectedReview', selectedReview)
      navigate(navigationUrl)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
      <Typography.Title
        level={5}
        className={styles.reviewTitle}
        style={{ marginBottom: '0', marginRight: '10px' }}>
        {title}
      </Typography.Title>

      <Modal
        title="Lottery"
        visible={isModalVisible}
        width={600}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>
            OK
          </Button>
        ]}
        closable={false}
        centered>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReactTurntable {...options} />
        </div>
      </Modal>

      <Modal
        title="Lottery Result"
        visible={resultModalVisible}
        footer={[
          <Button key="ok" type="primary" onClick={handleCloseResultModal}>
            OK
          </Button>
        ]}
        centered>
        <p>{`Congratulations! Your optional review will have a bonus of: ${turntableResult}`}</p>
      </Modal>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {reviews.map((review) => {
          const reviewUrl = `/courses/${review.course_number}/assignments/${review.assignment_id}/reviews/${review.id}`

          return color === 'grey' ? (
            <Tag
              key={review.id}
              color={color}
              className={styles.tag}
              onClick={(e) => handleTagClick(reviewUrl, color, e, review.id)}
              style={{
                cursor: 'pointer',
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid'
              }}>
              {`${review.course_number}: ${review.assignment_type === 'Team' ? 'Team ' : ''}${
                review.reviewing
              }`}
            </Tag>
          ) : (
            <Tag
              key={review.id}
              color={color}
              className={styles.tag}
              onClick={(e) => handleTagClick(reviewUrl, color, e, review.id)}
              style={{
                cursor: 'pointer'
              }}>
              {`${review.course_number}: ${review.assignment_type === 'Team' ? 'Team ' : ''}${
                review.reviewing
              }`}
            </Tag>
          )
        })}
      </div>
    </div>
  )
}

const StudentReviewsList = ({ artifactReviews }) => {
  const dispatch = useDispatch()
  const reopenReviews = artifactReviews.filter((r) => r.status == 'REOPEN')
  const pendingReviews = artifactReviews.filter((r) => r.status == 'INCOMPLETE')
  const lateReviews = artifactReviews.filter((r) => r.status == 'LATE')
  const optionalReviews = artifactReviews.filter((r) => r.status == 'OPTIONAL_INCOMPLETE')
  useEffect(() => {
    dispatch(resetSurvey())
  }, [])

  const showReopen = reopenReviews.length == 0 ? false : true
  const showLate = lateReviews.length == 0 ? false : true
  const showPending = pendingReviews.length == 0 ? false : true
  const showOptional = optionalReviews.length == 0 ? false : true

  const optionalReviewsColor = !showReopen && !showLate && !showPending ? 'blue' : 'grey'

  return (
    <div>
      <Space
        direction="vertical"
        size="middle"
        className="text-center"
        style={{ width: '100%', justifyContent: 'center' }}>
        <Row className="border-bottom p-5 my-3 ml-3">
          <Space direction="vertical" size="middle" className="text-center">
            {showReopen ? (
              <ReviewList title={'Reopened Reviews'} color="magenta" reviews={reopenReviews} />
            ) : null}
            {showLate ? (
              <ReviewList
                title={
                  <span>
                    Late Reviews{' '}
                    <Tooltip title="5 points each">
                      <InfoCircleOutlined className={styles.infoIcon} />
                    </Tooltip>
                  </span>
                }
                color="volcano"
                reviews={lateReviews}
              />
            ) : null}
            {showPending ? (
              <ReviewList
                title={
                  <span>
                    Mandatory Reviews{' '}
                    <Tooltip title="10 points each">
                      <InfoCircleOutlined className={styles.infoIcon} />
                    </Tooltip>
                  </span>
                }
                color="gold"
                reviews={pendingReviews}
              />
            ) : null}
            {showOptional ? (
              <p>
                <ReviewList
                  title={
                    <span>
                      Optional Reviews{' '}
                      <Tooltip
                        title={
                          optionalReviews
                            ? '15 points each, will be available after completing all other reviews'
                            : '15 point, will have a bonus based on the lottery result'
                        }>
                        <InfoCircleOutlined className={styles.infoIcon} />
                      </Tooltip>
                    </span>
                  }
                  color={optionalReviewsColor}
                  reviews={optionalReviews}
                />
              </p>
            ) : null}
          </Space>
        </Row>
      </Space>
    </div>
  )
}

export default StudentReviewsList
