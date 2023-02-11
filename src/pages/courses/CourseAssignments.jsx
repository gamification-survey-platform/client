import { Container, Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import surveySelector from '../../store/survey/selectors'
import { mockAssignments as assignments } from '../../utils/mockData'

const CourseAssignments = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { survey } = useSelector(surveySelector)

  const handleSurveyClick = (e, assignment) => {
    console.log(e, assignment)
    e.preventDefault()
    navigate(`${location.pathname}/${assignment.id}/survey`)
    //else navigate(`${location.pathname}/${assignment.id}/survey/add`)
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
            console.log(assignment)
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
    </Container>
  )
}

export default CourseAssignments
