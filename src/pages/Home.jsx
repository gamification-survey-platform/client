import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Button, Card } from 'react-bootstrap'
import DefaultImage from '../assets/default.jpg'
import userSelector from '../store/user/selectors'
import { getCourses } from '../store/courses/coursesSlice'
import coursesSelector from '../store/courses/selectors'

const Home = () => {
  const { user } = useSelector(userSelector)
  const { courses, status } = useSelector(coursesSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) dispatch(getCourses(user.andrewId))
  }, [user])

  return (
    <Container fluid className="d-flex mt-5">
      <Row xs={4} className="g-4">
        {courses.map((course, i) => (
          <div key={i} style={{ width: '20%' }}>
            <Card className="m-3">
              <Card.Img variant="top" src={DefaultImage} />
              <Card.Body>
                <Card.Title>{course.course_name}</Card.Title>
                <Card.Text>{course.semester}</Card.Text>
                <Button
                  variant="primary"
                  href={`/courses/${course.course_number}/details`}
                  className="m-1">
                  Course Details
                </Button>
                <Button
                  variant="primary"
                  href={`/courses/${course.course_number}/assignments`}
                  className="m-1">
                  Assignments
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </Container>
  )
}

export default Home
