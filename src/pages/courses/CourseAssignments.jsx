import { Container, Table, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { mockAssignments as assignments } from '../../utils/mockData'

const CourseAssignments = () => {
  const location = useLocation()
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
                  <Link to={`${location.pathname}/${assignment.id}/survey`}>
                    <Button variant="primary">Survey</Button>
                  </Link>
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
