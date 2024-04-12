import React, { useState, useEffect } from 'react'
import { Image, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import AvatarBadge from '../assets/badges/Avatar-Alchemist.png'
import CommentCrusaderBronzeImage from '../assets/badges/Open-ended-feedback/Bronze/Comment-Crusader.png'
import CommentCrusaderSilverImage from '../assets/badges/Open-ended-feedback/Silver/Comment-Crusader.png'
import CommentCrusaderGoldImage from '../assets/badges/Open-ended-feedback/Gold/Comment-Crusader.png'
import CommentCaptainBronzeImage from '../assets/badges/Open-ended-feedback/Bronze/Comment-Captain.png'
import CommentCaptainSilverImage from '../assets/badges/Open-ended-feedback/Silver/Comment-Captain.png'
import CommentCaptainGoldImage from '../assets/badges/Open-ended-feedback/Gold/Comment-Captain.png'
import CuriousCommenterBronzeImage from '../assets/badges/Open-ended-feedback/Bronze/Curious-Commenter.png'
import CuriousCommenterSilverImage from '../assets/badges/Open-ended-feedback/Silver/Curious-Commenter.png'
import CuriousCommenterGoldImage from '../assets/badges/Open-ended-feedback/Gold/Curious-Commenter.png'
import PeerReviewBronzeImage from '../assets/badges/Peer-review/Bronze.png'
import PeerReviewSilverImage from '../assets/badges/Peer-review/Silver.png'
import PeerReviewGoldImage from '../assets/badges/Peer-review/Gold.png'
import { getHistoricalArtifactReviews } from '../api/historicalReview'
import { getAnswerHistory } from '../api/historicalReview'
import { useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import { gamified_mode } from '../gamified'

const BadgeContainer = () => {
  const [completedReviews, setCompletedReviews] = useState(0)
  const [singleRowBadge, setSingleRowBadge] = useState(null)
  const [answerHistoryPoints, setAnswerHistoryPoints] = useState(0)
  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  }
  const user = useSelector(userSelector)

  useEffect(() => {
    const fetchCompletedReviews = async () => {
      if (user) {
        try {
          const user_id = user.pk
          const response = await getHistoricalArtifactReviews()
          const reviewsData = response.data.filter(
            (review) => review.user === user_id && review.status === 'COMPLETED'
          )
          setCompletedReviews(reviewsData.length)
        } catch (error) {
          console.error('Error fetching completed reviews:', error)
        }
      }
    }

    fetchCompletedReviews()
  }, [user])

  useEffect(() => {
    const calculateBadgeFromSingleRow = (userReviewsData) => {
      let highestSingle = 0
      userReviewsData.forEach((review) => {
        const total = review.relevance_score + review.clarity_score + review.specificity_score
        if (total > highestSingle) {
          highestSingle = total
        }
      })
      if (highestSingle >= 8) return CuriousCommenterGoldImage
      if (highestSingle >= 7) return CuriousCommenterSilverImage
      if (highestSingle >= 6) return CuriousCommenterBronzeImage
      return null
    }

    const calculateTotalPoints = (userReviewsData) => {
      return userReviewsData.reduce((total, currentReview) => {
        return (
          total +
          currentReview.relevance_score +
          currentReview.clarity_score +
          currentReview.specificity_score
        )
      }, 0)
    }

    const fetchAnswerHistory = async () => {
      if (user) {
        try {
          const user_id = user.pk
          const response = await getAnswerHistory()
          const userReviewsData = response.data.filter((history) => history.user === user_id)
          const singleRowBadge = calculateBadgeFromSingleRow(userReviewsData)
          const totalPoints = calculateTotalPoints(userReviewsData)
          setSingleRowBadge(singleRowBadge)
          setAnswerHistoryPoints(totalPoints)
        } catch (error) {
          console.error('Error fetching Answer History:', error)
        }
      }
    }

    fetchAnswerHistory()
  }, [user])

  const getBadgeBasedOnTotalPoints = () => {
    if (answerHistoryPoints >= 500) return CommentCrusaderGoldImage
    if (answerHistoryPoints >= 400) return CommentCrusaderSilverImage
    if (answerHistoryPoints >= 300) return CommentCrusaderBronzeImage
    if (answerHistoryPoints >= 200) return CommentCaptainGoldImage
    if (answerHistoryPoints >= 100) return CommentCaptainSilverImage
    if (answerHistoryPoints >= 50) return CommentCaptainBronzeImage
    return null
  }

  const totalPointsBadge = getBadgeBasedOnTotalPoints()

  const getPeerReviewBadge = () => {
    if (completedReviews >= 10) {
      return PeerReviewGoldImage
    } else if (completedReviews >= 5) {
      return PeerReviewSilverImage
    } else if (completedReviews >= 1) {
      return PeerReviewBronzeImage
    }
    return null
  }

  const peerReviewBadge = getPeerReviewBadge()

  return (
    <div
      style={{
        padding: '0px',
        background: '#FCC200',
        borderRadius: '15px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      {!user.is_staff && gamified_mode(user) && user && user.image && (
        <Tooltip title="Avatar Alchemist Badge!👍 Good Job!🔥🔥" color={'#36454F'} placement="left">
          <div style={{ margin: '0 4px' }}>
            <motion.div initial="hidden" animate="visible" variants={variants}>
              <Image src={AvatarBadge} preview={false} width={55} height={55} />
            </motion.div>
          </div>
        </Tooltip>
      )}
      {!user.is_staff && gamified_mode(user) && peerReviewBadge && (
        <Tooltip
          title="Peer Review Badge. Try to submit more reviews!🚀🚀"
          color={'#008080'}
          placement="left">
          <div style={{ margin: '0 4px' }}>
            <motion.div initial="hidden" animate="visible" variants={variants}>
              <Image src={peerReviewBadge} preview={false} width={55} height={55} />
            </motion.div>
          </div>
        </Tooltip>
      )}
      {!user.is_staff && gamified_mode(user) && singleRowBadge && (
        <Tooltip
          title="First outstanding feedback badge! Great job on that detailed answer! 🎯"
          color={'#FF1493'}
          placement="top">
          <div style={{ margin: '0 4px' }}>
            <motion.div initial="hidden" animate="visible" variants={variants}>
              <Image src={singleRowBadge} preview={false} width={55} height={55} />
            </motion.div>
          </div>
        </Tooltip>
      )}
      {!user.is_staff && gamified_mode(user) && totalPointsBadge && (
        <Tooltip
          title="Badge for all feedback you provided! Outstanding contribution! Keep it up! You will make extra points for next review!🚀"
          color={'#654321'}
          placement="top">
          <div style={{ margin: '0 4px' }}>
            <motion.div initial="hidden" animate="visible" variants={variants}>
              <Image src={totalPointsBadge} preview={false} width={55} height={55} />
            </motion.div>
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default BadgeContainer
