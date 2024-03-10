import { useEffect, useState } from 'react'
import { Button, Form, message, Popover, Input, DatePicker, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router'
import { createSurvey, deleteSurveyTemplate, editSurveyTemplate } from '../../api/survey'
import coursesSelector from '../../store/courses/selectors'
import dayjs from 'dayjs'
import Checkbox from 'antd/es/checkbox/Checkbox'
import { QuestionCircleTwoTone } from '@ant-design/icons'

const AddSurvey = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const courses = useSelector(coursesSelector)
  const { state } = useLocation()
  const editingSurvey = state ? state.editingSurvey : null
  const { course_id, assignment_id } = useParams()
  const navigate = useNavigate()
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const [form] = useForm()

  useEffect(() => {
    if (editingSurvey) {
      form.setFieldsValue(editingSurvey)
      form.setFieldValue('template_name', editingSurvey.name)
    }
  }, [])
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
          date_due: new Date(date_due.format('MM/DD/YYYY hh:mm A')),
          date_released: new Date(date_released.format('MM/DD/YYYY hh:mm A')),
          other_info: fields.other_info || ''
        }
      }
      const res = await createSurvey(surveyData)
      if (res.status === 201 || res.status === 200) navigate(-1)
      else messageApi.open({ type: 'error', content: `Failed to create survey.` })
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to create survey.` })
    }
  }
  const handleEditTemplate = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const survey = form.getFieldsValue()
      const res = await editSurveyTemplate({
        feedback_survey_id: editingSurvey.pk,
        survey: { other_info: '', ...survey }
      })
      if (res.status === 200) {
        navigate(-1)
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: `Failed to edit survey template. Template not found.`
      })
    }
  }

  const handleDeleteTemplate = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const res = await deleteSurveyTemplate({ feedback_survey_id: editingSurvey.pk })
      if (res.status === 204) {
        navigate(`/courses/${course_id}/assignments`)
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: `Failed to delete survey template. Template not found.`
      })
    }
  }

  return (
    <div className="m-3">
      {contextHolder}
      <Form form={form} initialValues={editingSurvey ? {} : { template_name: 'Default Template' }}>
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
        {editingSurvey ? null : (
          <>
            <Form.Item
              label="Date released"
              name="date_released"
              rules={[{ required: true, message: 'Please input a release date.' }]}>
              <DatePicker
                showTime={{ 
                  format: 'h:mm A',
                  use12Hours: true
                }}
                format="YYYY-MM-DD h:mm A"
                disabledDate={(current) => current && current < dayjs()}
                // moment={moment.tz('America/Los_Angeles')}
              />
            </Form.Item>
            <Form.Item
              label="Date due"
              name="date_due"
              rules={[{ required: true, message: 'Please input a release date.' }]}>
              <DatePicker
                showTime={{ 
                  format: 'h:mm A',
                  use12Hours: true
                }}
                format="YYYY-MM-DD h:mm A"
                disabledDate={(current) => current && current < dayjs()}
                // moment={moment.tz('America/Los_Angeles')}
              />
            </Form.Item>
          </>
        )}
        <Form.Item className="text-center">
          {editingSurvey ? (
            <>
              <Button type="primary" className="mx-3" onClick={handleEditTemplate}>
                Edit Template
              </Button>
              <Button type="primary" danger className="mx-3" onClick={handleDeleteTemplate}>
                Delete Template
              </Button>
            </>
          ) : (
            <Button className="mt-3" type="primary" onClick={handleSubmit}>
              Create
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddSurvey
