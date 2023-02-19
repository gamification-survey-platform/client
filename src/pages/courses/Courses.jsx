import { useState } from 'react'
import { Alert, Container, Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteCourse as deleteCourseApi } from '../../api/courses'
import { deleteCourse } from '../../store/courses/coursesSlice'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'

const Courses = () => {
  const navigate = useNavigate()
  const { user } = useSelector(userSelector)
  const { courses } = useSelector(coursesSelector)
  const [showError, setShowError] = useState(false)
  const dispatch = useDispatch()

  const handleDeleteCourse = async (e, coursePk) => {
    try {
      const res = await deleteCourseApi(coursePk)
      if (res.status === 200) {
        setShowError(false)
        dispatch(deleteCourse(coursePk))
      }
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
                      <Link to={`/courses/${course.course_number}/edit`}>
                        <Button className="mx-3" variant="warning">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        className="mx-3"
                        variant="danger"
                        onClick={(e) => handleDeleteCourse(e, course.pk)}>
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
        <Button className="my-5" onClick={() => navigate('/courses/add')}>
          Add Course
        </Button>
      )}
      {showError && <Alert variant="danger">Failed to delete course.</Alert>}
    </Container>
  )
}

export default Courses
