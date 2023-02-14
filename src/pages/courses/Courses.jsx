import { useState } from 'react'
import { Alert, Container, Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteCourse } from '../../api/courses'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'

const Courses = () => {
  const navigate = useNavigate()
  const { user } = useSelector(userSelector)
  const { courses } = useSelector(coursesSelector)
  const [showError, setShowError] = useState(false)

  const handleDeleteCourse = async (e, courseNumber) => {
    try {
      const res = await deleteCourse(courseNumber)
    } catch (e) {
      setShowError(true)
    }
  }

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
                  {user && user.role === 'admin' && (
                    <>
                      <Link to={`/courses/${course.course_number}/assignments`}>
                        <Button className="mx-3" variant="warning">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        className="mx-3"
                        variant="danger"
                        onClick={(e) => handleDeleteCourse(e, course.course_number)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {user && user.role === 'admin' && (
        <Button onClick={() => navigate('/courses/add')}>Add Course</Button>
      )}
      {showError && <Alert variant="danger">Failed to delete course.</Alert>}
    </Container>
  )
}

export default Courses
