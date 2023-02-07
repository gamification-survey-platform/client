import { Container, Table, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { mockCourses as courses } from '../../utils/mockData'

const Courses = () => {
  const navigate = useNavigate()
  return (
    <Container className="mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Number</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, i) => {
            return (
              <tr key={i}>
                <td>{course.course_name}</td>
                <td>{course.course_number}</td>
                <td>{course.semester}</td>
                <td>
                  <Link to={`/courses/${course.course_number}/assignments`}>
                    <Button className="mx-3">Assignments</Button>
                  </Link>
                  <Link to={`/courses/${course.course_number}/members`}>
                    <Button className="mx-3" variant="secondary">
                      Members
                    </Button>
                  </Link>
                  <Link to={`/courses/${course.course_number}/details`}>
                    <Button className="mx-3" variant="info">
                      View
                    </Button>
                  </Link>
                  <Link to={`/courses/${course.course_number}/assignments`}>
                    <Button className="mx-3" variant="warning">
                      Edit
                    </Button>
                  </Link>
                  <Button className="mx-3" variant="danger">
                    Delete
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Button onClick={() => navigate('/courses/add')}>Add Course</Button>
    </Container>
  )
}

export default Courses
