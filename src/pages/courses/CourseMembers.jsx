import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Table,
  Form,
  Button,
  Tag,
  Select,
  Input,
  Typography,
  Divider,
  message,
  Popover,
  Space
} from 'antd'
import { useParams } from 'react-router'
import {
  addMember,
  getMembers,
  removeMember,
  changeMember,
  getCourseTeams
} from '../../api/members'
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import coursesSelector from '../../store/courses/selectors'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../../components/Spinner'
import Upload from 'antd/es/upload/Upload'
import Papa from 'papaparse'
import userSelector from '../../store/user/selectors'

const { Option } = Select
const CourseMembers = () => {
  const [members, setMembers] = useState([])
  const [allTeams, setTeam] = useState([])
  const [messageApi, contextHolder] = message.useMessage()
  const { course_id } = useParams()
  const [spin, setSpin] = useState(false)
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [csvFile, setCSVFile] = useState()
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const [form] = useForm()
  const initialValues = {
    memberRole: 'Student'
  }

  const dataSource = members.map((m, i) => ({ ...m, key: i }))

  const handleTeamChange = async (value, record) => {
    try {
      await changeMember({
        course_id: selectedCourse.pk,
        memberId: record.andrew_id,
        teamId: value
      })
    } catch (e) {
      console.error(e)
    }
  }

  let columns = [
    { title: 'Andrew ID', dataIndex: 'andrew_id', align: 'center', key: 'andrew_id' },
    {
      title: 'User Role',
      dataIndex: 'userRole',
      align: 'center',
      key: 'userRole',
      render: (_, d) => (d.is_staff ? 'Instructor' : 'Student')
    },
    {
      title: 'Team',
      dataIndex: 'team',
      align: 'center',
      key: 'team',
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleTeamChange(value, record)}>
          {allTeams.map((team) => (
            <Option key={team.team_id} value={team.team_id}>
              {team.team_id}
            </Option>
          ))}
        </Select>
      )
    }
  ]

  const staffColumns = [
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

  if (user.is_staff) columns = columns.concat(staffColumns)

  useEffect(() => {
    const fetchCourseMembers = async () => {
      setSpin(true)
      const res = await getMembers({ course_id: selectedCourse.pk })
      if (res.status === 200) setMembers(res.data)
      setSpin(false)
    }
    fetchCourseMembers()
  }, [])

  useEffect(() => {
    const fetchCourseTeams = async () => {
      const res = await getCourseTeams({ course_id: selectedCourse.pk })
      if (res.status === 200) setTeam(res.data)
    }
    fetchCourseTeams()
  }, [])

  const handleAddMember = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    await form.validateFields(['memberId', 'memberRole', 'teamId'])
    try {
      const { memberId, memberRole, teamId } = form.getFieldsValue()
      const res = await addMember({
        course_id: selectedCourse.pk,
        memberId,
        memberRole,
        teamId
      })
      if (res.status === 201) {
        setMembers([...members, res.data])
        messageApi.open({ type: 'success', content: `Successfully added ${memberId}` })
        form.resetFields()
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }

  const handleAddFromCSV = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      Papa.parse(csvFile, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
        complete: async ({ data, errors }) => {
          let error = false
          let finalMembership = members
          if (data && !errors.length) {
            data.map(async (member) => {
              const res = await addMember({
                course_id: selectedCourse.pk,
                memberId: member.memberID,
                memberRole: 'Student',
                teamId: member.teamID
              })
              if (res.status === 200) {
                finalMembership = res.data
              } else {
                error = true
              }
            })
          } else {
            error = true
          }

          if (error) {
            messageApi.open({
              type: 'error',
              content: `Failed to add members from CSV file: ${error.message}`
            })
          } else
            messageApi.open({
              type: 'success',
              content: `Successfully added members from CSV file.`
            })
          setMembers(finalMembership)
        }
      })
      form.resetFields()
    } catch (e) {
      console.error(e)
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
        messageApi.open({ type: 'success', content: `Successfully removed ${andrewIdToRemove}` })
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Failed to remove ${andrewIdToRemove}: ${error.message}`
      })
    }
  }

  const CSVInfo = () => (
    <div>
      Please format the .csv file in such a format:
      <table className="w-100 mt-3 mb-3">
        <tr>
          <th className="border border-dark text-center">memberID</th>
          <th className="border border-dark text-center">teamID</th>
        </tr>
        <tr>
          <td className="border border-dark text-center">id1</td>
          <td className="border border-dark text-center">team1</td>
        </tr>
        <tr>
          <td className="border border-dark text-center">id2</td>
          <td className="border border-dark text-center">team2</td>
        </tr>
      </table>
    </div>
  )

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <div className="m-5">
      {contextHolder}
      <Table columns={columns} dataSource={dataSource} />
      {user.is_staff && (
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
              <Space direction="horizontal">
                <Upload
                  maxCount={1}
                  beforeUpload={(file) => {
                    setCSVFile(file)
                    return false
                  }}>
                  <Button icon={<UploadOutlined />}>Upload CSV File</Button>
                </Upload>
                <Popover content={<CSVInfo />}>
                  <InfoCircleOutlined style={{ fontSize: 20 }} />
                </Popover>
              </Space>
            </Form.Item>
            <Button type="primary" onClick={handleAddFromCSV}>
              Add from CSV File
            </Button>
          </Form>
        </div>
      )}
    </div>
  )
}

export default CourseMembers
