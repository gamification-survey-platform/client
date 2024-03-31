import React, { useState, useEffect } from 'react';
import { Image, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import AvatarBadge from '../assets/badges/Avatar-Alchemist.png';
import CommentCrusaderBronzeImage from '../assets/badges/Open-ended-feedback/Bronze/Comment-Crusader.png';
import CommentCrusaderSilverImage from '../assets/badges/Open-ended-feedback/Silver/Comment-Crusader.png';
import CommentCrusaderGoldImage from '../assets/badges/Open-ended-feedback/Gold/Comment-Crusader.png';
import CommentCaptainBronzeImage from '../assets/badges/Open-ended-feedback/Bronze/Comment-Captain.png';
import CommentCaptainSilverImage from '../assets/badges/Open-ended-feedback/Silver/Comment-Captain.png';
import CommentCaptainGoldImage from '../assets/badges/Open-ended-feedback/Gold/Comment-Captain.png';
import CuriousCommenterBronzeImage from '../assets/badges/Open-ended-feedback/Bronze/Curious-Commenter.png';
import CuriousCommenterSilverImage from '../assets/badges/Open-ended-feedback/Silver/Curious-Commenter.png';
import CuriousCommenterGoldImage from '../assets/badges/Open-ended-feedback/Gold/Curious-Commenter.png';
import PeerReviewBronzeImage from '../assets/badges/Peer-review/Bronze.png';
import PeerReviewSilverImage from '../assets/badges/Peer-review/Silver.png';
import PeerReviewGoldImage from '../assets/badges/Peer-review/Gold.png';

const BadgeContainer = ({ user }) => {
  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

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
        <Tooltip title="Avatar Alchemist" color={'#FFDF00'} placement="left">
          <div style={{ margin: '0 4px' }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
            >
              <Image src={AvatarBadge} preview={false} width={50} height={50} />
            </motion.div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default BadgeContainer;