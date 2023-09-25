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
      content: (
        <>
          <p><strong>Dashboard:</strong> Your central hub for accessing features and information.</p>
          <p>Here, it provides a quick overview of your status and activities on the platform.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.profile',
      content: (
        <>
          <p><strong>Profile Section:</strong> Personalize your experience.</p>
          <p>Edit your name, upload a profile picture, and manage your personal information to keep your profile up to date.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.courses',
      content: (
        <>
          <p><strong>Courses:</strong> Explore your learning path.</p>
          <p>Find and manage your courses here. You can access course materials, submit assignments.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.store',
      content: (
        <>
          <p><strong>Store:</strong> Discover and acquire resources.</p>
          <p>Browse and purchase items, resources, and additional features to enhance your learning experience.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.theme',
      content: (
        <>
          <p><strong>Theme Customization:</strong> Tailor the look and feel of your dashboard.</p>
          <p>Customize the theme, adjust the layout, and choose your preferred color scheme to create a comfortable and personalized learning environment.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.leaderboard',
      content: (
        <>
          <p><strong>Leaderboard:</strong> Track your achievements and compare your performance.</p>
          <p>View your rankings, earn badges, and see how you stack up against your peers. Aim high and stay motivated!</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.guide',
      content: (
        <>
          <p><strong>Guide:</strong> Get help and support.</p>
          <p>Access helpful information, tutorials, and FAQs about using the platform. It is your go-to place for finding answers and learning how to make the most out of the platform.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.daily-streak',
      content: (
        <>
          <p><strong>Daily Streak:</strong> Build consistent learning habits.</p>
          <p>Keep logging in daily to maintain and increase your streak. It is a fun way to stay committed to your learning goals!</p>
        </>
      ),
      placement: 'bottom',
      disableBeacon: true
    },
    {
      target: '.notification',
      content: (
        <>
          <p><strong>Notifications:</strong> Stay informed about updates and activities.</p>
          <p>Check your notifications regularly to keep up with announcements, feedback, and messages. Don’t miss out on important alerts and news!</p>
        </>
      ),
      placement: 'bottom',
      disableBeacon: true
    },
    {
      target: '.logout',
      content: (
        <>
          <p><strong>Logout:</strong> Securely exit the platform.</p>
          <p>Click here to log out of your account when you have finished your session. Remember to log out, especially when using shared devices.</p>
        </>
      ),
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
