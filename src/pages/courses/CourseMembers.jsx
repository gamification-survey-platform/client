import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Form, Button, Row, Col, Alert, Tag, Select, Input, Typography } from 'antd'
import { useParams } from 'react-router'
import { addMember, getMembers, remindMember, removeMember } from '../../api/members'
import coursesSelector from '../../store/courses/selectors'
import { isInstructorOrTA } from '../../utils/roles'
import { useForm } from 'antd/es/form/Form'

const CourseMembers = () => {
  const [members, setMembers] = useState([])
  const [message, setMessage] = useState('')
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const userRole = selectedCourse ? selectedCourse.user_role : ''
  const [form] = useForm()
  const initialValues = {
    memberRole: 'Student'
  }

  const dataSource = members.map((m, i) => ({ ...m, key: i }))

  let columns = [
    { title: 'Andrew ID', dataIndex: 'andrew_id', align: 'center', key: 'andrew_id' },
    { title: 'User Role', dataIndex: 'userRole', align: 'center', key: 'userRole' },
    { title: 'Team', dataIndex: 'team', align: 'center', key: 'team' }
  ]

  const staffColumns = [
    {
      title: '',
      dataIndex: 'add',
      key: 'add',
      render: (_, member) => {
        return (
          <Tag color="green" role="button" onClick={(e) => handleAddMember(e, member.andrew_id)}>
            Add
          </Tag>
        )
      }
    },
    {
      title: '',
      dataIndex: 'remind',
      key: 'remind',
      render: (_, member) => {
        return (
          <Tag color="gold" role="button" onClick={(e) => handleRemindMember(e, member.andrew_id)}>
            Remind
          </Tag>
        )
      }
    },
    {
      title: '',
      dataIndex: 'remove',
      key: 'remove',
      render: (_, member) => {
        return (
          <Tag
            color="volcano"
            role="button"
            onClick={(e) => handleRemoveMember(e, member.andrew_id)}>
            Remove
          </Tag>
        )
      }
    }
  ]

  if (isInstructorOrTA(userRole)) columns = columns.concat(staffColumns)

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
    form.validateFields(['memberId', 'memberRole', 'teamId'])
    const { memberId, memberRole, teamId } = form.getFieldsValue()
    try {
      const res = await addMember({
        course_id: selectedCourse.pk,
        memberId,
        memberRole,
        teamId
      })
      if (res.status === 200) {
        setMembers(res.data.membership)
        setMessage({ type: 'success', message: `Successfully added ${memberId}` })
      }
    } catch (e) {
      setMessage({ type: 'danger', message: `Failed to add ${memberId}` })
    }
  }

  const handleRemindMember = async (e, memberId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await remindMember({ course_id: selectedCourse.pk, memberId })
      if (res.status === 200)
        setMessage({ type: 'success', message: `Successfully reminded ${memberId}` })
    } catch (e) {
      setMessage({ type: 'error', message: `Failed to remind ${memberId}` })
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
        setMessage({ type: 'success', message: `Successfully removed ${andrewIdToRemove}` })
      }
    } catch (e) {
      setMessage({ type: 'error', message: `Failed to remove ${andrewIdToRemove}` })
    }
  }
  return (
    <div className="m-5">
      <Table columns={columns} dataSource={dataSource} />
      <div className="d-flex justify-content-center">
        <Form className="w-50 text-center" form={form} initialValues={initialValues}>
          <Typography.Title level={4}>Add Member</Typography.Title>
          <Form.Item
            name="memberId"
            label="Andrew ID"
            rules={[{ required: true, message: 'Please input an Andrew ID' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="memberRole" label="Role">
            <Select
              className="text-left"
              options={[
                { value: 'Student', label: 'Student' },
                { value: 'TA', label: 'TA' },
                { value: 'Instructor', label: 'Instructor' }
              ]}></Select>
          </Form.Item>
          <Form.Item name="teamId" label="Team ID (optional)">
            <Input />
          </Form.Item>
          <Button type="primary" onClick={handleAddMember}>
            Add
          </Button>
          {message && <Alert className="mt-3" {...message} />}
        </Form>
      </div>
    </div>
  )
}
/*
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
*/
export default CourseMembers
