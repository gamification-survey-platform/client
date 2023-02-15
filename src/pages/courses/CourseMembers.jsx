import { useState } from 'react'
import { Container, Table, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router'
import { addMember, remindMember, removeMember } from '../../api/members'
import { mockMembers as members } from '../../utils/mockData'

const CourseMembers = () => {
  const [message, setMessage] = useState('')
  const [addId, setAddId] = useState('')
  const [teamId, setTeamId] = useState('')
  const { course_id } = useParams()

  const handleAddMember = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const res = await addMember(course_id, addId, teamId)
      if (res.status === 200) setMessage({ type: 'success', text: `Successfully added ${addId}` })
    } catch (e) {
      setMessage({ type: 'danger', text: `Failed to add ${addId}` })
    }
  }

  const handleRemindMember = async (e, memberId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await remindMember(course_id, memberId)
      if (res.status === 200)
        setMessage({ type: 'success', text: `Successfully reminded ${memberId}` })
    } catch (e) {
      setMessage({ type: 'danger', text: `Failed to remind ${memberId}` })
    }
  }

  const handleRemoveMember = async (e, memberId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await removeMember(course_id, memberId)
      if (res.status === 200)
        setMessage({ type: 'success', text: `Successfully removed ${memberId}` })
    } catch (e) {
      setMessage({ type: 'danger', text: `Failed to remove ${memberId}` })
    }
  }

  return (
    <Container className="mt-5">
      <Table striped bordered hover className="my-3">
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
                  <Button variant="info" onClick={(e) => handleRemindMember(e, member.andrewId)}>
                    Remind
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={(e) => handleRemoveMember(e, member.andrewId)}>
                    Remove
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Container className="my-3">
        <Col xs="5" className="text-left">
          <Form>
            <Form.Group className="my-3">
              <Form.Label>Add Member:</Form.Label>
              <Form.Control
                className="w-50"
                value={addId}
                onChange={(e) => setAddId(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Add Team (optional):</Form.Label>
              <Form.Control
                className="w-50"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              />
            </Form.Group>
            <Button onClick={handleAddMember} disabled={!addId}>
              Add
            </Button>
          </Form>
        </Col>
      </Container>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
    </Container>
  )
}

export default CourseMembers
