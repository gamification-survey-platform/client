import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <Container className="mt-5">
    <h1>404</h1>
    <h3>Uh oh! The page you are looking for does not exist.</h3>
    <Link to="/">
      <Button>Go home</Button>
    </Link>
  </Container>
)

export default NotFoundPage
