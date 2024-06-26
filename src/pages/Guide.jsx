import { Table } from 'antd'
import Typography from 'antd/es/typography/Typography'

const Guide = () => {
  const columns = [
    { title: 'Element', dataIndex: 'element', align: 'center', key: 'element' },
    { title: 'Access Level', dataIndex: 'level', key: 'level', align: 'center' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ]

  const pointsColumns = [
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Points', dataIndex: 'points', key: 'points' }
  ]

  let dataSource = [
    {
      element: 'Ranking',
      level: 'All',
      description:
        "User's level in the gamification platform. This is visible in the left sidebar along with an associated label."
    },
    {
      element: 'Theme Customization',
      level: 'All',
      description:
        'Allows the user to change the site design settings. This includes and is not limited to the site color, button colors, message colors, etc. This feature is accessible under the Theme menu option.'
    },
    {
      element: 'Survey Gamification',
      level: 'All',
      description:
        'Filling out the survey is a gamified process. The process is gamified by the instructor enabling certain features for multiple choice questions, text questions.'
    },
    {
      element: 'Preset Theme Selection',
      level: '2',
      description:
        'Allows the user to choose a theme created by another user. This feature is accessible in the Theme menu option.'
    },
    {
      element: 'Cursor Selection Customization',
      level: '3',
      description:
        'Allows the user to choose a their cursor icon. Options include a Flower, Lightsaber, Mushroom, Pokeball, or Wand. This feature is accessible in the Theme menu option.'
    },
    {
      element: 'Survey Theme Customization',
      level: '4',
      description:
        'Allows the user to choose a survey theme. The survey theme is used in certain question formats when a user is completing a peer review. This feature is accessible in the Theme menu option.'
    },
    {
      element: 'Theme Publishing',
      level: '5',
      description:
        'Allows the user to publish a survey theme. Published themes are given a name and are available for other users to choose. Upon achieving level 2.'
    }
  ]

  let pointsSource = [
    {
      key: '1',
      action: 'Setting first name and last name in profile for the first time',
      points: '10pt'
    },
    {
      key: '2',
      action: 'Submit assignment',
      points: '5pt'
    },
    {
      key: '3',
      action: 'Complete a mandatory survey',
      points: '10pt'
    },
    {
      key: '4',
      action: 'Complete an optional survey',
      points: '15pt'
    },
    {
      key: '5',
      action: 'Complete a late survey',
      points: '5pt'
    },
    {
      key: '6',
      action: 'Poke other students to review',
      points: '2pt'
    },
    {
      key: '7',
      action: 'Daily streak, 3 days in a row',
      points: '10pt'
    },
    {
      key: '8',
      action: 'Complete trivia without hints',
      points: '12pt'
    },
    {
      key: '9',
      action: 'Complete trivia with one hint',
      points: '6pt'
    },
    {
      key: '10',
      action: 'Complete trivia with two hints',
      points: '3pt'
    },
    {
      key: '11',
      action: 'Earn "Comment Captain Bronze" badge (50-99 points)',
      points: '20pt bonus on next review'
    },
    {
      key: '12',
      action: 'Earn "Comment Captain Silver" badge (100-199 points)',
      points: '50pt bonus on next review'
    },
    {
      key: '13',
      action: 'Earn "Comment Captain Gold" badge (200-299 points)',
      points: '90pt bonus on next review'
    },
    {
      key: '14',
      action: 'Earn "Comment Crusader Bronze" badge (300-399 points)',
      points: '140pt bonus on next review'
    },
    {
      key: '15',
      action: 'Earn "Comment Crusader Silver" badge (400-499 points)',
      points: '200pt bonus on next review'
    },
    {
      key: '16',
      action: 'Earn "Comment Crusader Gold" badge (500+ points)',
      points: '275pt bonus on next review'
    },
    {
      key: '17',
      action: 'Lottery on optional review',
      points: '15pt + lottery bonus'
    },
    {
      key: '18',
      action: 'Asking feedback with GPT assistant for the first time',
      points: '5pt'
    }
  ]

  dataSource = dataSource.map((d, i) => ({ ...d, key: i }))

  return (
    <div className="m-5">
      <Typography.Title level={2}>Welcome to Gamification Platform!</Typography.Title>
      <Typography.Title level={4}>What is this platform for?</Typography.Title>
      <Typography.Text>
        We believe peer feedback is a critical component of learning and evaluation. However,
        students pay little attention to this process. Both students and evaluators can learn much
        more with more thorough and thoughtful feedback. <br />
        Our goal is to <strong>gamify</strong> the peer evaluation process so students are more
        diligent when providing their feedback - for both peer and instructor benefit.
      </Typography.Text>
      <Typography.Title level={4}>How does it work?</Typography.Title>
      <Typography.Text>
        We have introduced multiple levels of gamification in the platform that the user will
        growing access to as they work more with the platform. A user can increase their platform
        level and accumulate course points by interacting with the platform.
      </Typography.Text>
      <br />
      <Typography.Title level={4} className="my-3">
        Platform Level Gamification Elements
      </Typography.Title>
      <Table className="text-center" columns={columns} dataSource={dataSource} />
      <Typography.Title level={4} className="my-3">
        Points Gamification Elements
      </Typography.Title>
      <Table className="text-center" columns={pointsColumns} dataSource={pointsSource} />
      <Typography.Text>
        These elements are associated with a single user&apos;s account. As the user progresses
        through courses, they will accumulate more experience that can be used to unlock the above
        features.
      </Typography.Text>
      <Typography.Title level={4} className="my-3">
        Course Level Gamification Elements
      </Typography.Title>
      <Typography.Text>
        Every time the user interacts with the platform in one of the ways listed above, they will
        also accumulate points towards the course their action was aimed towards. These points are
        similar to a currency, which can be used to purchase items from the Gamification Store
        (accessible in the left sidebar).
        <br />
        Instructors can add rewards such as extra points, additional submission days, etc. that can
        be purchased via the store and used towards the course.
      </Typography.Text>
      <Typography.Title level={4} className="my-3">
        Other Gamification Elements
      </Typography.Title>
      <Typography.Text>
        To further gamify the platform, there are additional features such as:
        <ul>
          <li>
            System level and course level leaderboards to show how much experience a user has
            accumulated. The system level leaderboard is visible in the left sidebar and the course
            level leaderboard can be seen by navigating to &apos;Courses&apos; -&gt;
            &apos;Leaderboard&apos;
          </li>
          <li>Poking artifact reviewers to remind them to review your submission</li>
          <li>
            Daily streak accumulation (visible in the top panel) by checking into the platform on a
            daily basis
          </li>
        </ul>
        This is an evolving project that is open to expansion! We look to add more features soon!
      </Typography.Text>
    </div>
  )
}

export default Guide
