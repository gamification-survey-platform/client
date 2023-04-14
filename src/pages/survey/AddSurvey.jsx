import { useState } from 'react'
import { Button, Form, message, Alert, Input, DatePicker } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createSurvey } from '../../api/survey'
import coursesSelector from '../../store/courses/selectors'
import dayjs from 'dayjs'

const AddSurvey = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const courses = useSelector(coursesSelector)
  const { course_id, assignment_id } = useParams()
  const navigate = useNavigate()
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const [form] = useForm()

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
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
      const surveyData = {
        course_id: selectedCourse.pk,
        assignment_id,
        survey: {
          ...fields,
          date_due: date_due.format('MM/DD/YYYY hh:mm'),
          date_released: date_released.format('MM/DD/YYYY hh:mm')
        }
      }
      const res = await createSurvey(surveyData)
      if (res.status === 201 || res.status === 200) navigate(-1)
      else messageApi.open({ type: 'error', content: `Failed to create survey.` })
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to create survey.` })
    }
  }

  return (
    <div className="m-3">
      {contextHolder}
      <Form form={form} initialValues={{ template_name: 'Default Template', other_info: '' }}>
        <Form.Item
          label="Template Name"
          name="template_name"
          rules={[{ required: true, message: 'Please input a template name' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="instructions"
          rules={[{ required: true, message: 'Please fill out instructions' }]}>
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item label="Other information" name="other_info">
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item label="Date released" name="date_released">
          <DatePicker
            showTime={{ format: 'h:mm A' }}
            format="YYYY-MM-DD h:mm A"
            disabledDate={(current) => current && current < dayjs()}
          />
        </Form.Item>
        <Form.Item label="Date due" name="date_due">
          <DatePicker
            showTime={{ format: 'h:mm A' }}
            format="YYYY-MM-DD h:mm A"
            disabledDate={(current) => current && current < dayjs()}
          />
        </Form.Item>
        <Form.Item className="text-center">
          <Button className="mt-3" type="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddSurvey
