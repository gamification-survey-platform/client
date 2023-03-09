import { Typography, Button } from 'antd'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="mt-5">
    <Typography.Title level={1}>404</Typography.Title>
    <Typography.Title level={3}>
      Uh oh! The page you are looking for does not exist.
    </Typography.Title>
    <Link to="/">
      <Button type="primary">Go home</Button>
    </Link>
  </div>
)

export default NotFoundPage
