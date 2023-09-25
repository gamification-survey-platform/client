import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { QuestionCircleOutlined } from '@ant-design/icons';

const DashboardJoyride = () => {
  const [run, setRun] = useState(false);
  const [joyrideKey, setJoyrideKey] = useState(0);

  const startJoyride = () => {
    setRun(true);
    setJoyrideKey(joyrideKey + 1);
  };

  const steps = [
    {
      target: '.Dashboard',
      content: 'This is your dashboard. You can find all the information about your progress here.',
      placement: 'right'
    },
    {
      target: '.profile',
      content: 'This is your profile. You can edit and upload your picture here.',
      placement: 'right'
    },
    {
      target: '.courses',
      content: 'Here you can find your courses.',
      placement: 'right'
    },
    {
      target: '.store',
      content: 'This is the store. You can find various items here.',
      placement: 'right'
    },
    {
      target: '.theme',
      content: 'You can customize the theme of your dashboard from here.',
      placement: 'right'
    },
    {
        target: '.leaderboard',
        content: 'This is the leaderboard. You can view your rankings here.',
    },
    {
        target: '.guide',
        content: 'This is the guide. You can find helpful information about using the platform here.',
    },
    {
        target: '.daily-streak',
        content: 'This shows your daily streak. Keep logging in daily to increase it!',
        placement: 'bottom',
    },
    {
        target: '.notification',
        content: 'Here you can see your notifications. Click to view them.',
        placement: 'bottom',
    },
    {
        target: '.logout',
        content: 'Click here to log out of your account.',
        placement: 'bottom',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <>
      <QuestionCircleOutlined onClick={startJoyride} style={{ cursor: 'pointer', color: '#4b0082' }} />
      <Joyride
        key={joyrideKey}
        callback={handleJoyrideCallback}
        continuous={true}
        getHelpers={(helpers) => window.helpers = helpers} 
        run={run}
        scrollToFirstStep={true}
        showProgress={true}
        disableBeacon={true}
        startAt={0}
        showSkipButton={true}
        steps={steps}
        styles={{
          options: {
            primaryColor: '#4b0082',
            overlayColor: 'rgba(79, 26, 0, 0.4)',
            width: 900
          },
        }}
      />
    </>
  );
};

export default DashboardJoyride;
