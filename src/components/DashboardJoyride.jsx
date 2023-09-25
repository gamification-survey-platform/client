import Joyride, { STATUS } from 'react-joyride';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

const DashboardJoyride = () => {
  const [run, setRun] = useState(false);
  const [joyrideKey, setJoyrideKey] = useState(0);

  const startJoyride = () => {
    setRun(true);
    setJoyrideKey(joyrideKey + 1);
  };

  useEffect(() => {
    console.log("Run:", run);
  }, [run]);  

  const steps = [
    {
      target: '.Dashboard',
      content: 'This is your dashboard. You can find all the information about your progress here.',
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.profile',
      content: 'This is your profile. You can edit and upload your picture here.',
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.courses',
      content: 'Here you can find your courses.',
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.store',
      content: 'This is the store. You can find various items here.',
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.theme',
      content: 'You can customize the theme of your dashboard from here.',
      placement: 'right',
      disableBeacon: true
    },
    {
        target: '.leaderboard',
        content: 'This is the leaderboard. You can view your rankings here.',
        placement: 'right',
        disableBeacon: true
    },
    {
        target: '.guide',
        content: 'This is the guide. You can find helpful information about using the platform here.',
        placement: 'right',
        disableBeacon: true
    },
    {
        target: '.daily-streak',
        content: 'This shows your daily streak. Keep logging in daily to increase it!',
        placement: 'bottom',
        disableBeacon: true
    },
    {
        target: '.notification',
        content: 'Here you can see your notifications. Click to view them.',
        placement: 'bottom',
        disableBeacon: true
    },
    {
        target: '.logout',
        content: 'Click here to log out of your account.',
        placement: 'bottom',
        disableBeacon: true
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
      <QuestionCircleOutlined onClick={startJoyride} style={{ cursor: 'pointer', color: '#FFFFFF', fontSize: '24px', marginRight: '10px' }} />
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
