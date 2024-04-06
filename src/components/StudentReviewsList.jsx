import { Space, Row, Typography, Tag, Button, Modal, Image } from 'antd'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styles from '../styles/ReviewsList.module.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetSurvey } from '../store/survey/surveySlice'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Wheel } from 'react-custom-roulette'
import lottery from '../assets/lottery.json'
import Lottie from 'react-lottie'
import confetti from '../assets/confetti.json'
import coin from '../assets/coin.json'
import info from '../assets/info.json'

const ReviewList = ({ title, reviews, color, bgColor }) => {
  const { course_id } = useParams()
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [resultModalVisible, setResultModalVisible] = useState(false)
  const [navigationUrl, setNavigationUrl] = useState('')
  const [selectedReview, setSelectedReview] = useState('')
  const [animationPlayed, setAnimationPlayed] = useState(false)
  const reviewToPrizeMap = new Map()

  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [prize, setPrize] = useState(null)

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
  }

  const handleStopSpinning = () => {
    setMustSpin(false)
    setIsModalVisible(false)
    setPrize(data[prizeNumber].option)
    setResultModalVisible(true)
  }

  const data = [
    { option: 'x2 Points', style: { backgroundColor: 'crimson', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'deepskyblue', textColor: 'white' } },
    { option: '+1 Points', style: { backgroundColor: 'forestgreen', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'gold', textColor: 'black' } },
    { option: '+2 Points', style: { backgroundColor: 'darkorange', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'indigo', textColor: 'white' } },
    { option: '+5 Points', style: { backgroundColor: 'sienna', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'royalblue', textColor: 'white' } },
    { option: '+1 Points', style: { backgroundColor: 'purple', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'teal', textColor: 'white' } },
    { option: '+2 Points', style: { backgroundColor: 'firebrick', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'darkslateblue', textColor: 'white' } },
    { option: '+1 Points', style: { backgroundColor: 'midnightblue', textColor: 'white' } },
    { option: '0 Points', style: { backgroundColor: 'darkcyan', textColor: 'white' } }
  ]

  const handleTagClick = (reviewUrl, color, e, review_id, bgColor) => {
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
      localStorage.setItem('bonus', prize)
      reviewToPrizeMap.set(selectedReview, prize)
      localStorage.setItem('selectedReview', selectedReview)
      navigate(navigationUrl)
    }
  }

  const confettiOption = {
    loop: false,
    autoplay: true,
    animationData: confetti,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const coinOption = {
    loop: true,
    autoplay: true,
    animationData: coin,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
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
        open={isModalVisible}
        width={600}
        footer={[
          <Button
            key="ok"
            type="primary"
            disabled={mustSpin}
            onClick={() => setIsModalVisible(false)}>
            OK
          </Button>
        ]}
        closable={false}
        centered>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleStopSpinning}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleSpinClick}
            disabled={mustSpin}
            style={{ backgroundColor: 'gold', borderColor: 'black' }}>
            Spin
          </Button>
        </div>
      </Modal>

      <Modal
        open={resultModalVisible}
        footer={[
          <Button key="ok" type="primary" onClick={handleCloseResultModal}>
            OK
          </Button>
        ]}
        closable={false}
        centered>
        {prize === '0 Points' ? (
          <Typography.Title
            level={3}
            className={styles.reviewTitle}
            style={{ marginBottom: '0', marginRight: '10px' }}>
            Better luck next time!😜
          </Typography.Title>
        ) : (
          <div>
            <p style={{ fontSize: '15px' }}>
              Congratulations! Your optional review will have a bonus of:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>
                <Lottie options={coinOption} width={70} height={70} />
              </span>
              <strong
                style={{
                  fontFamily: 'Arial, sans-serif',
                  color: 'gold',
                  fontSize: '25px'
                }}>{`${prize}`}</strong>
            </div>
          </div>
        )}

        {!animationPlayed && prize !== '0 Points' && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}>
            <Lottie
              options={confettiOption}
              height="100%"
              width="100%"
              eventListeners={[
                {
                  eventName: 'complete',
                  callback: () => setAnimationPlayed(true)
                }
              ]}
            />
          </div>
        )}
      </Modal>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {reviews.map((review) => {
          const reviewUrl = `/courses/${review.course_number}/assignments/${review.assignment_id}/reviews/${review.id}`
          return color === 'grey' ? (
            <Button
              key={review.id}
              className={styles.tag}
              onClick={(e) => handleTagClick(reviewUrl, color, e, review.id)}
              style={{
                cursor: 'not-allowed',
                backgroundColor: '#d3d3d3',
                color: '#a9a9a9',
                opacity: '0.5'
              }}>
              <span className={styles['patua-one-regular']}>
                {`${review.course_number}: ${review.assignment_type === 'Team' ? 'Team ' : ''}${
                  review.reviewing
                }`}
              </span>
            </Button>
          ) : (
            <Button
              key={review.id}
              className={styles.tag}
              onClick={(e) => handleTagClick(reviewUrl, color, e, review.id)}
              style={{
                cursor: 'pointer',
                color: color,
                borderColor: color,
                backgroundColor: bgColor
              }}>
              <span className={styles['patua-one-regular']}>
                {`${review.course_number}: ${review.assignment_type === 'Team' ? 'Team ' : ''}${
                  review.reviewing
                }`}
              </span>
            </Button>
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

  const optionalReviewsColor = !showReopen && !showLate && !showPending ? '#003eb3' : 'grey'

  const lotteryOption = {
    loop: true,
    autoplay: true,
    animationData: lottery,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const infoOption = {
    loop: true,
    autoplay: true,
    animationData: info,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

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
              <ReviewList
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#eb2f96' }} className={styles['patua-one-regular']}>
                      Reopened Reviews:{' '}
                    </span>
                    <Tooltip title="Please review again">
                      <div>
                        <Lottie options={infoOption} width={25} height={25} />
                      </div>
                    </Tooltip>
                  </div>
                }
                color="#9e1068"
                bgColor="#ffd6e7"
                reviews={reopenReviews}
              />
            ) : null}
            {showLate ? (
              <ReviewList
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#fa541c' }} className={styles['patua-one-regular']}>
                      Late Reviews:{' '}
                    </span>
                    <Tooltip title="5 points each">
                      <div>
                        <Lottie options={infoOption} width={25} height={25} />
                      </div>
                    </Tooltip>
                  </div>
                }
                color="#ad2102"
                bgColor="#ffd8bf"
                reviews={lateReviews}
              />
            ) : null}
            {showPending ? (
              <ReviewList
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#faad14' }} className={styles['patua-one-regular']}>
                      Mandatory Reviews:{' '}
                    </span>
                    <Tooltip title="10 points each">
                      <div>
                        <Lottie options={infoOption} width={25} height={25} />
                      </div>
                    </Tooltip>
                  </div>
                }
                color="#ad6800"
                bgColor="#fff1b8"
                reviews={pendingReviews}
              />
            ) : null}
            {
              <ReviewList
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#1677ff' }} className={styles['patua-one-regular']}>
                      Optional Reviews:{' '}
                    </span>
                    <Tooltip
                      title={
                        showOptional && optionalReviewsColor !== 'grey'
                          ? '15 point, bonus depends on the lottery result'
                          : '15 point each, will be available after completing all other reviews'
                      }>
                      <div>
                        <Lottie options={lotteryOption} width={50} height={50} />
                      </div>
                    </Tooltip>
                  </div>
                }
                color={optionalReviewsColor}
                bgColor="#bae0ff"
                reviews={optionalReviews}
              />
            }
          </Space>
        </Row>
      </Space>
    </div>
  )
}

export default StudentReviewsList
