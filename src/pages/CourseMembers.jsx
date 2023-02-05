import { Container, Table, Button } from 'react-bootstrap'
import { mockMembers as members } from '../utils/mockData'

const CourseMembers = () => {
  return (
    <Container className="mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Andrew ID</th>
            <th>Role</th>
            <th>Team</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, i) => {
            return (
              <tr key={i}>
                <td>{member.andrewId}</td>
                <td>{member.role}</td>
                <td>{member.team}</td>
                <td>
                  <Button variant="info">Remind</Button>
                </td>
                <td>
                  <Button variant="danger">Remove</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default CourseMembers
