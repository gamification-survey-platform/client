import { useEffect, useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import { deleteAssignment, getAssignments } from '../../api/assignments'
import userSelector from '../../store/user/selectors'
import coursesSelector from '../../store/courses/selectors'

const CourseAssignments = () => {
  const location = useLocation()
  const { course_id } = useParams()
  const { courses } = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const { user } = useSelector(userSelector)

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await getAssignments(selectedCourse.pk)
      if (res.status === 200) setAssignments(res.data)
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

  const handleEditAssignment = (e, assignment) => {
    e.preventDefault()
    navigate(`${location.pathname}/${assignment.id}/edit`, {
      state: assignment
    })
  }

  const handleDeleteAssignment = async (e, assignment) => {
    e.preventDefault()
    const res = await deleteAssignment({
      coursePk: selectedCourse.pk,
      assignment_id: assignment.id
    })
    if (res.status === 204) {
      const newAssignments = assignments.filter(
        (assignmentToRemove) => assignmentToRemove.id !== assignment.id
      )
      setAssignments(newAssignments)
    }
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
                <td>{assignment.assignment_name}</td>
                <td>{assignment.assignment_type}</td>
                <td>{assignment.total_score}</td>
                <td>{assignment.date_released.toLocaleString()}</td>
                <td>{assignment.date_due.toLocaleString()}</td>
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
                {user.role !== 'Student' && (
                  <>
                    <td>
                      <Link to={`${location.pathname}/${assignment.id}/reports`}>
                        <Button variant="info">Reports</Button>
                      </Link>
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={(e) => handleEditAssignment(e, assignment)}>
                        Edit
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={(e) => handleDeleteAssignment(e, assignment)}>
                        Delete
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </Table>
      {user.role !== 'Student' && (
        <Button className="m-3" onClick={handleAddAssignment}>
          Add Assignment
        </Button>
      )}
    </Container>
  )
}

export default CourseAssignments
