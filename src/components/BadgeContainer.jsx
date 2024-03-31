import React from 'react';
import { Image, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import AvatarBadge from '../assets/badges/Avatar-Alchemist.png';

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