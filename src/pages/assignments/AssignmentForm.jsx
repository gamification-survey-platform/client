import { useEffect } from 'react'
import { Button, Form, message, Input, Select, DatePicker, InputNumber } from 'antd'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import { createAssignment, editAssignment } from '../../api/assignments'
import { useForm } from 'antd/es/form/Form'

const AssignmentForm = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const params = useParams()
  const { state: editingAssignment } = useLocation()
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === params.course_id)
  const navigate = useNavigate()
  const [form] = useForm()

  useEffect(() => {
    if (form && editingAssignment) {
      form.setFieldsValue({
        ...editingAssignment,
        date_due: dayjs(new Date(editingAssignment.date_due)),
        date_released: dayjs(new Date(editingAssignment.date_released))
      })
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      form.validateFields()
      const fields = form.getFieldsValue()
      const { date_due, date_released } = fields
      const now = dayjs()
      if (!date_due || !date_released) {
        messageApi.open({ type: 'error', content: 'Please input date due and/or date release.' })
        throw new Error()
      } else if (!date_released.isAfter(now)) {
        messageApi.open({ type: 'error', content: 'Date release must be in the future.' })
        throw new Error()
      } else if (!date_released.isBefore(date_due)) {
        messageApi.open({ type: 'error', content: 'Date due must be after date release.' })
        throw new Error()
      }
      const formObj = {
        ...fields,
        course: selectedCourse.pk,
        date_due: date_due.format('MM/DD/YYYY hh:mm'),
        date_released: date_released.format('MM/DD/YYYY hh:mm'),
        review_assign_policy: 'A'
      }
      const res = editingAssignment
        ? await editAssignment({
            course_id: selectedCourse.pk,
            assignment: formObj,
            assignment_id: editingAssignment.id
          })
        : await createAssignment({ course_id: selectedCourse.pk, assignment: formObj })
      if (editingAssignment && res.status === 200) navigate(-1)
      else if (res.status === 201) navigate(-1)
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Failed to create/edit assignment.' })
    }
  }
  return (
    <div className="m-3 text-left w-50">
      {contextHolder}
      <Form form={form}>
        <Form.Item
          label="Assignment name"
          name="assignment_name"
          rules={[{ required: true, message: 'Please input an assignment name' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Assignment description"
          name="description"
          rules={[{ required: true, message: 'Please input an assignment description' }]}>
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item
          label="Assignment Type"
          name="assignment_type"
          rules={[{ required: true, message: 'Please input an assignment type' }]}>
          <Select
            className="text-left"
            options={[
              { value: 'Individual', label: 'Individual' },
              { value: 'Team', label: 'Team' }
            ]}></Select>
        </Form.Item>
        <Form.Item
          label="Submission Type"
          name="submission_type"
          rules={[{ required: true, message: 'Please input a submission type' }]}>
          <Select
            className="text-left"
            options={[
              { value: 'File', label: 'File' },
              { value: 'URL', label: 'URL' },
              { value: 'Text', label: 'Text' }
            ]}></Select>
        </Form.Item>
        {/*
        <Form.Item
          label="Review assignment policy"
          name="review_assign_policy"
          rules={[{ required: true, message: 'Please input a review type' }]}>
          <Select
            className="text-left"
            options={[
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' }
            ]}></Select>
        </Form.Item>
          */}
        <Form.Item label="Date due" name="date_due">
          <DatePicker showTime={{ format: 'h:mm A' }} format="YYYY-MM-DD h:mm A" />
        </Form.Item>
        <Form.Item label="Date released" name="date_released">
          <DatePicker showTime={{ format: 'h:mm A' }} format="YYYY-MM-DD h:mm A" />
        </Form.Item>
        <Form.Item
          label="Total Score"
          name="total_score"
          rules={[
            {
              required: true,
              message: 'A positive number must be entered.',
              pattern: new RegExp(/^[0-9]+$/)
            }
          ]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Weight"
          name="weight"
          rules={[
            {
              required: true,
              message: 'A positive number must be entered.',
              pattern: new RegExp(/^[0-9]+$/),
              min: 0,
              max: 1
            }
          ]}>
          <InputNumber precision={2} min={0} max={1} />
        </Form.Item>
        <Form.Item className="text-center">
          <Button className="ml-3" type="primary" onClick={handleSubmit}>
            {editingAssignment ? 'Edit' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AssignmentForm
