import { useEffect, useState } from 'react'
import { Button, Form, message, Input, DatePicker, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { getSurveyById } from '../../api/survey'
import { useLocation, useNavigate, useParams } from 'react-router'
import {
  createSurvey,
  deleteSurveyTemplate,
  editSurveyTemplate,
  getAllSurveyByUserId
} from '../../api/survey'
import dayjs from 'dayjs'

const AddSurvey = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { state } = useLocation()
  const editingSurvey = state ? state.editingSurvey : null
  const { course_id, assignment_id } = useParams()
  const navigate = useNavigate()
  const [form] = useForm()

  const [surveys, setSurveys] = useState([])
  const [selectedSurvey, setSelectedSurvey] = useState(undefined)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [surveyDetail, setSurveyDetail] = useState(null)

  useEffect(() => {
    if (editingSurvey) {
      form.setFieldsValue(editingSurvey)
      form.setFieldValue('template_name', editingSurvey.name)
    }
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    // Fetch surveys from the server
    try {
      const res = await getSurveys()
      setSurveys(res)
    } catch (error) {
      console.error('Error fetching surveys:', error)
    }
  }

  const getSurveys = async () => {
    const user_id = localStorage.getItem('userId')
    const res = await getAllSurveyByUserId(user_id)
    return res.data
  }

  const handleViewAllSurveys = () => {
    setModalVisible(true)
  }

  const handleShowSurveyDetail = async (surveyId) => {
    const res = await getSurveyById(surveyId)
    setDetailModalVisible(true)
    setSurveyDetail(res.data)
  }

  const renderSurveyDetail = (surveyDetail) => {
    return (
      <div>
        <p>Name: {surveyDetail.name}</p>
        <p>Instruction: {surveyDetail.instructions}</p>
        <p>Questions:</p>
        {surveyDetail.sections.map((section, index) => (
          <div key={index}>
            {section.questions.map((question, qIndex) => (
              <div key={qIndex}>
                <p>{question.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
  const handleSelectSurvey = (survey) => {
    setSelectedSurvey(survey)
    form.setFieldsValue({
      template_name: survey.name,
      instructions: survey.instructions
    })
    setModalVisible(false)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const surveyId = selectedSurvey ? selectedSurvey.pk : -1

      if (surveyId != null && surveyId != -1) {
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
          assignment_id,
          survey: {
            ...fields,
            survey_id: surveyId,
            user_id: localStorage.getItem('userId'),
            date_due: new Date(date_due.format('MM/DD/YYYY hh:mm A')),
            date_released: new Date(date_released.format('MM/DD/YYYY hh:mm A')),
            other_info: fields.other_info || ''
          }
        }

        const res = await createSurvey(surveyData)
        if (res.status === 201 || res.status === 200) navigate(-1)
        return
      }

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
        assignment_id,
        survey: {
          ...fields,
          survey_id: -1,
          user_id: localStorage.getItem('userId'),
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

  return (
    <div className="m-3">
      {contextHolder}
      <Form form={form} initialValues={{ template_name: 'Default Template' }}>
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
        <Form.Item className="text-center">
          {
            <Button className="mt-3" type="primary" onClick={handleCreate}>
              Create
            </Button>
          }
        </Form.Item>
      </Form>
      <Button type="primary" onClick={handleViewAllSurveys}>
        View Templates
      </Button>
      {selectedSurvey !== undefined && (
        <div>
          <p>Selected Template: {selectedSurvey.name}</p>
          <p>
            <Button onClick={() => handleShowSurveyDetail(selectedSurvey.pk)}>View Detail</Button>
          </p>
          <p>
            <Button onClick={() => setSelectedSurvey(undefined)}>Cancel Selection</Button>
          </p>
        </div>
      )}

      <Modal
        title="All Templates"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}>
        <div>
          {/* Conditionally render based on surveys length */}
          {surveys.length === 0 ? (
            <p>No templates available</p>
          ) : (
            surveys.map((survey) => (
              <div
                key={survey.pk}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{survey.name}</span>
                <span>
                  <Button className="mr-2" onClick={() => handleShowSurveyDetail(survey.pk)}>
                    Detail
                  </Button>
                  <Button className="mr-2" onClick={() => handleSelectSurvey(survey)}>
                    Select
                  </Button>
                </span>
              </div>
            ))
          )}
        </div>
      </Modal>
      {surveyDetail && (
        <Modal
          title="Survey Detail"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}>
          <div>{renderSurveyDetail(surveyDetail)}</div>
        </Modal>
      )}
    </div>
  )
}

export default AddSurvey
