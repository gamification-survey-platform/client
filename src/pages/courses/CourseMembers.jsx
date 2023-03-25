import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Form, Button, Row, Col, Alert, Tag, Select, Input, Typography, Divider } from 'antd'
import { useParams } from 'react-router'
import { addMember, getMembers, remindMember, removeMember } from '../../api/members'
import { UploadOutlined } from '@ant-design/icons'
import coursesSelector from '../../store/courses/selectors'
import { isInstructorOrTA } from '../../utils/roles'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../../components/Spinner'
import Upload from 'antd/es/upload/Upload'
import Papa from 'papaparse'

const CourseMembers = () => {
  const [members, setMembers] = useState([])
  const [message, setMessage] = useState('')
  const { course_id } = useParams()
  const [spin, setSpin] = useState(false)
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
      setSpin(true)
      const res = await getMembers({ course_id: selectedCourse.pk })
      if (res.status === 200) setMembers(res.data.membership)
      setSpin(false)
    }
    fetchCourseMembers()
  }, [])

  const handleAddMember = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      await form.validateFields(['memberId', 'memberRole', 'teamId'])
      const { memberId, memberRole, teamId } = form.getFieldsValue()
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
      setMessage({ type: 'danger', message: `Failed to add member` })
    }
  }

  const handleAddFromCSV = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const { csv } = form.getFieldsValue()
      Papa.parse(csv.file, {
        header: true,
        complete: async ({ data, errors }) => {
          if (data && !errors.length)
            data.map(async (member) => {
              await addMember({
                course_id: selectedCourse.pk,
                memberId: member.andrewID,
                memberRole: 'Student'
              })
            })
        }
      })
      form.resetFields()
    } catch (e) {
      console.error(e)
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
  return spin ? (
    <Spinner show={spin} />
  ) : (
    <div className="m-5">
      <Table columns={columns} dataSource={dataSource} />
      {isInstructorOrTA(userRole) && (
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
            <Divider />
            <Typography.Title level={4}>Or Add from CSV File</Typography.Title>
            <Form.Item name="csv">
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload CSV File</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" onClick={handleAddFromCSV}>
              Add from CSV File
            </Button>
            {message && <Alert className="mt-3" {...message} />}
          </Form>
        </div>
      )}
    </div>
  )
}

export default CourseMembers
