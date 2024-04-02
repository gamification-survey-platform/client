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

const BadgeContainer = () => {
  const [completedReviews, setCompletedReviews] = useState(0)
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
          const reviewsData = response.data.filter(review => review.user === user_id && review.status === 'COMPLETED');
          setCompletedReviews(reviewsData.length)
        } catch (error) {
          console.error('Error fetching completed reviews:', error)
        }
      }
    }

    fetchCompletedReviews()
  }, [user])

  useEffect(() => {
    const calculateTotalPoints = (reviewsData) => {
      return reviewsData.reduce((total, currentReview) => {
        return total + currentReview.clarity_score + currentReview.relevance_score + currentReview.specificity_score;
      }, 0);
    };
  
    const fetchAnswerHistory = async () => {
      if (user) {
        try {
          const user_id = user.pk;
          const response = await getAnswerHistory();
          const userReviewsData = response.data.filter(history => history.user_id === user_id);
          const totalPoints = calculateTotalPoints(userReviewsData);
          setAnswerHistoryPoints(totalPoints);
        } catch (error) {
          console.error('Error fetching Answer History:', error);
        }
      }
    };
  
    fetchAnswerHistory();
  }, [user]);  

  const getAnswerHistoryBadge = () => {
    if (answerHistoryPoints >= 500) return CommentCrusaderBronzeImage;
    if (answerHistoryPoints >= 400 > 300) return CommentCrusaderSilverImage;
    if (answerHistoryPoints >= 300 > 200) return CommentCrusaderGoldImage;
    if (answerHistoryPoints >= 200 > 100) return CommentCaptainBronzeImage;
    if (answerHistoryPoints >= 100 > 50) return CommentCaptainSilverImage;
    return null;
  };

  const answerHistoryBadge = getAnswerHistoryBadge();

  const getPeerReviewBadge = () => {
    if (completedReviews >= 10) {
      return PeerReviewGoldImage;
    } else if (completedReviews >= 5) {
      return PeerReviewSilverImage;
    } else if (completedReviews >= 1) {
      return PeerReviewBronzeImage;
    }
    return null;
  };

  const peerReviewBadge = getPeerReviewBadge();

  return (
    <div
      style={{
        padding: '0px',
        background: '#FCC200',
        borderRadius: '15px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {user && user.image && (
        <Tooltip title="Avatar Alchemist!👍 Good Job!🔥🔥" color={'#36454F'} placement="left">
          <div style={{ margin: '0 4px' }}>
          <motion.div initial="hidden" animate="visible" variants={variants}>
            <Image src={AvatarBadge} preview={false} width={55} height={55} />
          </motion.div>
          </div>
        </Tooltip>
      )}
      {peerReviewBadge && (
        <Tooltip title="Peer Review Badge. Try to submit more reviews!🚀🚀" color={'#008080'} placement="left">
          <div style={{ margin: '0 4px' }}>
          <motion.div initial="hidden" animate="visible" variants={variants}>
            <Image src={peerReviewBadge} preview={false} width={55} height={55} />
          </motion.div>
          </div>
        </Tooltip>
      )}
      {answerHistoryBadge && (
        <Tooltip title="You're doing great! 🌟🌟" color={'#FFD700'} placement="right">
          <div style={{ margin: '0 4px' }}>
            <motion.div initial="hidden" animate="visible" variants={variants}>
              <Image src={answerHistoryBadge} preview={false} width={55} height={55} />
            </motion.div>
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default BadgeContainer
