import { useEffect, useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { getAssignments } from '../../api/assignments'
import userSelector from '../../store/user/selectors'
import coursesSelector from '../../store/courses/selectors'
import { mockAssignments } from '../../utils/mockData'

const CourseAssignments = () => {
  const location = useLocation()
  const {
    params: { courseId }
  } = useMatch('/courses/:courseId/assignments')
  const { courses } = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === courseId)
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const { user } = useSelector(userSelector)

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await getAssignments(selectedCourse.pk)
      if (res.status === 200) setAssignments(mockAssignments)
    }
    fetchAssignments()
  }, [])

  const handleSurveyClick = (e, assignment) => {
    e.preventDefault()
    navigate(`${location.pathname}/${assignment.id}/survey`)
  }

  const handleAddAssignment = (e) => {
    e.preventDefault()
    navigate(`${location.pathname}/add`)
  }

  return (
    <Container className="mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Assignment Name</th>
            <th>Assignment Type</th>
            <th>Total Score</th>
            <th>Available After</th>
            <th>Due Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, i) => {
            return (
              <tr key={i}>
                <td>{assignment.name}</td>
                <td>{assignment.type}</td>
                <td>{assignment.score}</td>
                <td>{assignment.availableDate.toLocaleString()}</td>
                <td>{assignment.dueDate.toLocaleString()}</td>
                <td>
                  <Link to={`${location.pathname}/${assignment.id}/view`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                </td>
                <td>
                  <Button variant="primary" onClick={(e) => handleSurveyClick(e, assignment)}>
                    Survey
                  </Button>
                </td>
                <td>
                  <Link to={`${location.pathname}/${assignment.id}/reports`}>
                    <Button variant="info">Reports</Button>
                  </Link>
                </td>
                <td>
                  <Link to={`${location.pathname}/${assignment.id}/edit`}>
                    <Button variant="warning">Edit</Button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {user && user.role === 'admin' && (
        <Button className="m-3" onClick={handleAddAssignment}>
          Add Assignment
        </Button>
      )}
    </Container>
  )
}

export default CourseAssignments
