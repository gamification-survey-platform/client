import { useEffect, useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getSurvey } from '../../api/survey'
import { deleteAssignment, getCourseAssignments } from '../../api/assignments'
import coursesSelector from '../../store/courses/selectors'
import { isInstructorOrTA } from '../../utils/roles'
import userSelector from '../../store/user/selectors'

const CourseAssignments = () => {
  const location = useLocation()
  const { course_id } = useParams()
  const user = useSelector(userSelector)
  const [userRole, setUserRole] = useState('Student')
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await getCourseAssignments(selectedCourse.pk)
      if (res.status === 200) {
        setAssignments(res.data)
        setUserRole(res.data[0].user_role)
      }
    }
    fetchAssignments()
  }, [])

  const handleSurveyClick = async (e, assignment) => {
    e.preventDefault()
    try {
      const res = await getSurvey({ courseId: selectedCourse.pk, assignmentId: assignment.id })
      if (res.status === 200)
        navigate(`${location.pathname}/${assignment.id}/survey`, {
          state: { userRole: assignment.user_role }
        })
      else if (res.status === 404)
        navigate(`/courses/${course_id}/assignments/${assignment.id}/survey/add`)
    } catch (e) {
      console.error(e)
    }
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
  console.log(assignments)
  return (
    <Container className="mt-5 text-center">
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
                {(isInstructorOrTA(assignment.user_role) || user.is_staff) && (
                  <>
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
      {isInstructorOrTA(userRole) && (
        <Button className="m-3" onClick={handleAddAssignment}>
          Add Assignment
        </Button>
      )}
    </Container>
  )
}

export default CourseAssignments
