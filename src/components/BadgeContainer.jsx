import React from 'react';
import { Image, Tooltip } from 'antd';
import AvatarBadge from '../assets/badges/Avatar-Alchemist.png';
import CommentCaptainSilverBadge from '../assets/badges/Open-ended-feedback/Silver/Comment-Captain.png';
import CommentCaptainGoldBadge from '../assets/badges/Open-ended-feedback/Gold/Comment-Captain.png';

const BadgeContainer = () => (
  <div
    style={{
      padding: '0px',
      background: '#FCC200',
      borderRadius: '15px',
      transition: 'transform 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <Tooltip title="Avatar Alchemist" color={'#FFDF00'} placement="left">
      <div style={{ margin: '0 4px' }}>
        <Image src={AvatarBadge} preview={false} width={50} height={50} />
      </div>
    </Tooltip>
    <Tooltip title="Comment Captain" color={'#E6E8FA'} placement="left">
      <div style={{ margin: '0 4px' }}>
        <Image src={CommentCaptainSilverBadge} preview={false} width={50} height={50} />
      </div>
    </Tooltip>
    <Tooltip title="Comment Captain" color={'#FFDF00'} placement="left">
      <div style={{ margin: '0 4px' }}>
        <Image src={CommentCaptainGoldBadge} preview={false} width={50} height={50} />
      </div>
    </Tooltip>
  </div>
);

export default BadgeContainer;