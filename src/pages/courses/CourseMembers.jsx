import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Table, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router'
import { addMember, getMembers, remindMember, removeMember } from '../../api/members'
import coursesSelector from '../../store/courses/selectors'
import { isInstructorOrTA } from '../../utils/roles'

const CourseMembers = () => {
  const [members, setMembers] = useState([])
  const [message, setMessage] = useState('')
  const [addId, setAddId] = useState('')
  const [memberRole, setMemberRole] = useState('Student')
  const [teamId, setTeamId] = useState('')
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const userRole = selectedCourse ? selectedCourse.user_role : ''

  useEffect(() => {
    const fetchCourseMembers = async () => {
      const res = await getMembers({ course_id: selectedCourse.pk })
      if (res.status === 200) setMembers(res.data.membership)
    }
    fetchCourseMembers()
  }, [])

  const handleAddMember = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const res = await addMember({
        course_id: selectedCourse.pk,
        memberId: addId,
        memberRole,
        teamId
      })
      if (res.status === 200) {
        setMembers(res.data.membership)
        setMessage({ type: 'success', text: `Successfully added ${addId}` })
      }
    } catch (e) {
      setMessage({ type: 'danger', text: `Failed to add ${addId}` })
    }
  }

  const handleRemindMember = async (e, memberId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await remindMember({ course_id: selectedCourse.pk, memberId })
      if (res.status === 200)
        setMessage({ type: 'success', text: `Successfully reminded ${memberId}` })
    } catch (e) {
      setMessage({ type: 'danger', text: `Failed to remind ${memberId}` })
    }
  }

  const handleRemoveMember = async (e, andrewIdToRemove) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await removeMember({ course_id: selectedCourse.pk, andrew_id: andrewIdToRemove })
      if (res.status === 204) {
        const newMembers = members.filter((member) => member.andrew_id !== andrewIdToRemove)
        setMembers(newMembers)
        setMessage({ type: 'success', text: `Successfully removed ${andrewIdToRemove}` })
      }
    } catch (e) {
      setMessage({ type: 'danger', text: `Failed to remove ${andrewIdToRemove}` })
    }
  }

  return (
    <Container className="mt-5">
      <Table striped bordered hover className="my-3 text-center">
        <thead>
          <tr>
            <th>Andrew ID</th>
            <th>Role</th>
            <th>Team</th>
            {isInstructorOrTA(userRole) && <th></th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member, i) => {
            return (
              <tr key={i}>
                <td>{member.andrew_id}</td>
                <td>{member.userRole}</td>
                <td>{member.team}</td>
                {userRole !== 'Student' && (
                  <>
                    <td>
                      <Button
                        variant="info"
                        onClick={(e) => handleRemindMember(e, member.andrew_id)}>
                        Remind
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={(e) => handleRemoveMember(e, member.andrew_id)}>
                        Remove
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
        <Container className="my-3">
          <Col xs="5" className="text-left">
            <Form>
              <Form.Group className="my-3">
                <Form.Label>Member andrew_id:</Form.Label>
                <Form.Control
                  className="w-50"
                  value={addId}
                  onChange={(e) => setAddId(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Member role:</Form.Label>
                <Form.Select
                  className="w-50"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}>
                  <option value="Student">Student</option>
                  <option value="TA">TA</option>
                  <option value="Instructor">Instructor</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Team (optional):</Form.Label>
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
      )}
      {message && <Alert variant={message.type}>{message.text}</Alert>}
    </Container>
  )
}

export default CourseMembers
