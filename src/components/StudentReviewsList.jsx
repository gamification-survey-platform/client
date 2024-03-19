import { Space, Row, Typography, Tag, Button, Modal } from 'antd'
import { Link, useParams } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetSurvey } from '../store/survey/surveySlice'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import ReactTurntable from 'react-turntable'
import 'react-turntable/assets/index.css'

const ReviewList = ({ title, color, reviews }) => {
  const { course_id } = useParams()

  return (
    <>
      <Typography.Title level={5} className={styles.reviewTitle}>
        {title}
      </Typography.Title>

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

const StudentReviewsList = ({ artifactReviews }) => {
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
  console.log('review', artifactReviews)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [resultModalVisible, setResultModalVisible] = useState(false)
  const [turntableResult, setTurntableResult] = useState('')

  const showReopen = reopenReviews.length == 0 ? false : true
  const showLate = lateReviews.length == 0 ? false : true
  const showPending = pendingReviews.length == 0 ? false : true
  const showCompleted = completedReviews.length == 0 ? false : true
  const showOptional = optionalReviews.length == 0 ? false : true

  // const [showReopen, setShowReopen] = useState(false)
  // const [showPending, setShowPending] = useState(false)
  // const [showLate, setShowLate] = useState(false)
  // const [showOptional, setShowOptional] = useState(false)
  // const [showCompleted, setShowCompleted] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const prizes = ['Coupon', 'x2 Points', 'x4 Points', 'x6 Points']
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
      //If you want before the rotate do some...
      console.log('start...')
      //If you want stop rotate you can return false
      return true
    },
    onComplete(prize) {
      console.log('prize:', prize)
      setTurntableResult(prize)
      setIsModalVisible(false) // Close the turntable modal once spinning is done
      setResultModalVisible(true) // Show result modal
    }
  }

  return (
    <div>
      <Space
        direction="horizontal"
        size="middle"
        className="text-center"
        style={{ width: '100%', justifyContent: 'center' }}>
        <Row className="border-bottom p-5 my-3 ml-3">
          <Space direction="horizontal" size="middle" className="text-center">
            <Button onClick={showModal}>Dummy</Button>
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
                // Custom footer that includes only the OK button
                <Button key="ok" type="primary" onClick={() => setResultModalVisible(false)}>
                  OK
                </Button>
              ]}
              centered>
              <p>{`Congratulations! You won: ${turntableResult}`}</p>
            </Modal>
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
            {showOptional && pendingReviews.length === 0 ? (
              <ReviewList
                title={
                  <span>
                    Optional Reviews{' '}
                    <Tooltip title="15 points each">
                      <InfoCircleOutlined className={styles.infoIcon} />
                    </Tooltip>
                  </span>
                }
                color="blue"
                reviews={optionalReviews}
              />
            ) : (
              <ReviewList
                title={
                  <span>
                    {/* Optional Reviews{' '} */}
                    <Tooltip title="15 points each. The optional reviews will show when you finish all the mandatory reviews">
                      <span style={{ cursor: 'help' }}>?</span>
                    </Tooltip>
                  </span>
                }
                color="gold"
                reviews={[]}
              />
            )}
            {/* {showOptional && pendingReviews.length === 0 ? (
          <ReviewList title={'Optional Reviews'} color="blue" reviews={optionalReviews} />
        ) : null} */}
            {showCompleted ? (
              <ReviewList title={'Completed Reviews'} color="green" reviews={completedReviews} />
            ) : null}
          </Space>
        </Row>
      </Space>
    </div>
  )
}

export default StudentReviewsList
