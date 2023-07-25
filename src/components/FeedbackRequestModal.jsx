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
      const artifact_review = data.slideReview
        ? answer.artifact_review_id
        : answer[0].artifact_review_id
      const receiver = data.slideReview
        ? answer.artifact_reviewer_id
        : answer[0].artifact_reviewer_id
      const jsonData = JSON.stringify({
        section: section.pk,
        artifact_review,
        question: question.pk,
        artifact_review_id,
        course_number: course_id,
        assignment_id,
        text,
        slide_review: !!data.slideReview,
        page: data.slideReview ? answer.page : undefined,
        answer_text: data.slideReview ? answer.text : undefined
      })
      const res = await sendNotification({ type: 'FEEDBACK_REQUEST', receiver, text: jsonData })
      console.log(data)
      if (res.status === 201) {
        messageApi.open({
          type: 'success',
          content: `Successfully sent your feedback request.`
        })
        setTimeout(() => setData(), 1000)
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
      <Typography.Text>
        This dialog allows you to contact the reviewer of your deliverable and clarify any questions
        that you might have about a particular answer.
      </Typography.Text>
      {data && (
        <div>
          <Divider />
          <Typography.Title level={5}>Section: {data.section.title}</Typography.Title>
          <Typography.Title level={5}>Question: {data.question.text}</Typography.Title>
          <Divider />
          <Typography.Title level={5}>Review Answer:</Typography.Title>
          {data.slideReview ? (
            <Typography.Text>{data.answer.text}</Typography.Text>
          ) : (
            <Typography.Text>{data.answer.map((r, i) => r.text).join(', ')}</Typography.Text>
          )}
          <Divider />
        </div>
      )}
      <Form form={form} disabled={false}>
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
