import { Form, Modal, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { sendNotification } from '../api/notifications'
import { Document, Page, pdfjs } from 'react-pdf'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import surveySelector from '../store/survey/selectors'

const RespondToFeedbackRequestModal = ({ data, setData }) => {
  const navigate = useNavigate()
  const { course_id, assignment_id } = useParams()
  const survey = useSelector(surveySelector)
  const section = survey.sections.find((s) => s.pk === data.section)
  const question = section.questions.find((q) => q.pk === data.question)
  const [form] = useForm()
  const [messageApi, contextHolder] = useMessage()
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [data])

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (e) {
      console.error(e)
      return
    }
    try {
      const { text, sender, id, ...rest } = data
      const response = form.getFieldValue('response')
      const jsonData = JSON.stringify({
        ...rest,
        request: text,
        feedback_request_id: id,
        response
      })
      const res = await sendNotification({
        type: 'FEEDBACK_RESPONSE',
        text: jsonData,
        receiver: sender
      })
      if (res.status === 201) {
        navigate(`/courses/${course_id}/assignments/${assignment_id}/view`)
        setData(null)
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }
  return (
    <Modal
      mask={false}
      open={data}
      onOk={handleSubmit}
      onCancel={() => setData(null)}
      width={data.slide_review ? 1000 : 500}
      style={{ top: 20, left: data.slide_review ? '' : '20%' }}>
      {contextHolder}
      <Form form={form}>
        <Typography.Title level={5} className="mb-1">
          Your reviewee wants additional feedback on:
          <br />
          Section: {section.title}
          <br />
          Question: {question.text}
        </Typography.Title>
        {data.slide_review && data.artifact && data.page ? (
          <>
            <Document file={data.artifact.file_path}>
              {' '}
              <Page pageNumber={data.page} width={data.slide_review ? 800 : 500} />
            </Document>
            <Typography.Text>
              Your answer was:
              <br />
              {data.answer_text}
            </Typography.Text>
            <br />
          </>
        ) : null}
        <Typography.Text>
          They ask:
          <br />
          {data.text}
        </Typography.Text>
        <Form.Item
          className="mt-3"
          label="Response"
          name="response"
          rules={[{ required: true, message: 'Please provide a response.' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RespondToFeedbackRequestModal
