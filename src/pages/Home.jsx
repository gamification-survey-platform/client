import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DefaultImage from '../assets/default_course.jpg'
import userSelector from '../store/user/selectors'
import { setCourses } from '../store/courses/coursesSlice'
import coursesSelector from '../store/courses/selectors'
import { getUserCourses } from '../api/courses'

const Home = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getUserCourses(user.andrew_id)
        if (res.status === 200) dispatch(setCourses(res.data))
      } catch (e) {
        console.error(e.message)
      }
    }
    fetchCourses()
  }, [])

  return (
    <Container fluid className="d-flex mt-5">
      <Row>
        {courses.map((course, i) => (
          <div key={i} style={{ width: 300 }}>
            <Card className="m-3">
              <Card.Img variant="top" src={DefaultImage} />
              <Card.Body>
                <Card.Title>{course.course_name}</Card.Title>
                <Card.Text>{course.semester}</Card.Text>
                <Link to={`/courses/${course.course_number}/details`}>
                  <Button variant="primary" className="m-1">
                    Course Details
                  </Button>
                </Link>
                <Link to={`/courses/${course.course_number}/details`}>
                  <Button
                    variant="primary"
                    href={`/courses/${course.course_number}/assignments`}
                    className="m-1">
                    Assignments
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </Container>
  )
}

export default Home
