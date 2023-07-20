import { Form, Modal, Input, Typography, Divider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { sendNotification } from '../api/notifications'
import { useParams } from 'react-router'

const FeedbackRequestModal = ({ data, setData }) => {
  const [form] = useForm()
  const [messageApi, contextHolder] = useMessage()
  const { course_id, assignment_id } = useParams()
  const handleSubmit = async () => {
    try {
      form.validateFields()
      const text = form.getFieldValue('text')
      const { section, question, artifact_review_id, answer } = data
      const artifact_review = answer[0].artifact_review_id
      const receiver = answer[0].artifact_reviewer_id
      const jsonData = JSON.stringify({
        section: section.pk,
        artifact_review,
        question: question.pk,
        artifact_review_id,
        course_number: course_id,
        assignment_id,
        text
      })
      const res = await sendNotification({ type: 'FEEDBACK_REQUEST', receiver, text: jsonData })
      if (res.status === 201) {
        messageApi.open({
          type: 'success',
          content: `Successfully sent message to ${data.receiver}`
        })
        setData()
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }

  return (
    <Modal
      title={'Get more feedback'}
      open={data}
      onOk={handleSubmit}
      forceRender
      width={1000}
      onCancel={() => setData()}>
      {contextHolder}
      {data && (
        <div>
          <Divider />
          <Typography.Title level={5}>Section: {data.section.title}</Typography.Title>
          <Typography.Title level={5}>Question: {data.question.text}</Typography.Title>
          <Divider />
          <Typography.Title level={5}>Review Answer:</Typography.Title>
          <Typography.Text>{data.answer.map((r, i) => r.text).join(', ')}</Typography.Text>
          <Divider />
        </div>
      )}
      <Form form={form}>
        <Form.Item
          name="text"
          label="Message to reviewer:"
          rules={[
            { required: true, message: 'Please articulate your inquiry about the feedback.' }
          ]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FeedbackRequestModal
