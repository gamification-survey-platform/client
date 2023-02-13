import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
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
      {courses.map((course, i) => (
        <div key={i}>
          <Card style={{ width: '18rem' }} className="m-3">
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
    </Container>
  )
}

export default Home
