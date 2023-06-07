import { Table } from 'antd'
import Typography from 'antd/es/typography/Typography'

const Guide = () => {
  const columns = [
    { title: 'Element', dataIndex: 'element', align: 'center', key: 'element' },
    { title: 'Access Level', dataIndex: 'level', key: 'level', align: 'center' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ]

  const dataSource = [
    {
      key: '0',
      element: 'Ranking',
      level: '0',
      description:
        "User's level in the gamification platform. This is visible in the left sidebar along with an associated label. A user can increase their level by interacting with the platform in three ways: submitting an assignment (20 points), submitting a peer review (10 points), or getting a trivia answer correct (5 points)."
    },
    {
      key: '1',
      element: 'Theme Customization',
      level: '0',
      description:
        'Allows the user to change the site design settings. This includes and is not limited to the site color, button colors, message colors, etc. This feature is accessible under the Theme menu option.'
    },
    {
      key: '2',
      element: 'Preset Theme Selection',
      level: '1',
      description:
        'Allows the user to choose a theme created by another user. This feature is accessible in the Theme menu option.'
    },
    {
      key: '3',
      element: 'Cursor Selection',
      level: '2',
      description:
        'Allows the user to choose a their cursor icon. Options include a Flower, Lightsaber, Mushroom, Pokeball, or Wand. This feature is accessible in the Theme menu option.'
    },
    {
      key: '3',
      element: 'Survey Theme',
      level: '3',
      description:
        'Allows the user to choose a survey theme. The survey theme is used in certain question formats when a user is completing a peer review. This feature is accessible in the Theme menu option.'
    }
  ]
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
        growing access to as they work more with the platform. These elements are unlocked based on
        the user&apos;s level, which is visible on the left sidebar.
      </Typography.Text>
      <br />
      <Typography.Text>These gamification elements are explained below</Typography.Text>
      <Typography.Title level={4} className="my-3">
        Gamification Elements
      </Typography.Title>
      <Table className="text-center" columns={columns} dataSource={dataSource} />
    </div>
  )
}

export default Guide
