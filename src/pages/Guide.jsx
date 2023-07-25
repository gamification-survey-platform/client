import { Table } from 'antd'
import Typography from 'antd/es/typography/Typography'

const Guide = () => {
  const columns = [
    { title: 'Element', dataIndex: 'element', align: 'center', key: 'element' },
    { title: 'Access Level', dataIndex: 'level', key: 'level', align: 'center' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
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
        'Filling out the survey is a gamified process. The process is gamified by the instructor enabling certain features for multiple choice questions, text questions, and adding survey trivia.'
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
        level and accumulate course points by interacting with the platform in three ways:
        submitting an assignment (20 points), submitting a peer review (10 points), or getting a
        trivia answer correct (5 points).
      </Typography.Text>
      <br />
      <Typography.Text>These gamification elements are explained below</Typography.Text>
      <Typography.Title level={4} className="my-3">
        Platform Level Gamification Elements
      </Typography.Title>
      <Table className="text-center" columns={columns} dataSource={dataSource} />
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
