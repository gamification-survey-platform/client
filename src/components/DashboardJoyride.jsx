import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardJoyride = ({ isFirstLogin }) => {
  const [run, setRun] = useState(isFirstLogin);
  const [joyrideKey, setJoyrideKey] = useState(0);
  const navigate = useNavigate();

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
          <p><strong>Dashboard:</strong> Your central hub for accessing courses information.</p>
          <p>Here, it provides a quick overview of your activities on the platform.</p>
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
          <p>Find and manage your courses here. You can access course materials including Assignments, Members, View, Leaderboard, and submit assignments.</p>
        </>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.first-course-assignment',
      content: (
        <>
          <p><strong>Assignment:</strong> Submit your tasks here.</p>
          <p>This section is where you can find and submit assignments for your course.</p>
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
      target: '.gamification',
      content: (
        <>
          <p><strong>Gamification:</strong> Visualize your progress and stay motivated!</p>
          <p>This element shows your work progress. Try to fill up the triangle by completing tasks and engaging with the platform!</p>
        </>
      ),
      placement: 'bottom',
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
    }
];

  const handleJoyrideCallback = (data) => {
    const { status, step, action, type } = data;

    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT && step.target === ".Dashboard") {
      navigate('/courses');
    }

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
        hideCloseButton={true}
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
