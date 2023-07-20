import { Form, Modal, Input, Typography, Divider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { sendNotification } from '../api/notifications'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'

const ResponseToFeedbackRequestModal = ({ data, setData }) => {
  const { course_number, assignment_id } = data
  const section = data.report.sections.find((s) => s.pk === data.section)
  const question = section.questions.find((q) => q.pk === data.question)
  const navigate = useNavigate()

  return (
    <Modal
      mask={false}
      open={data}
      onCancel={() => {
        navigate(`/courses/${course_number}/assignments/${assignment_id}/view`)
        setData()
      }}
      footer={null}
      style={{ top: 20, left: '20%' }}>
      <Typography.Title level={5} className="mb-1">
        Your reviewer provided feedback on:
        <br />
        Section: {section.title}
        <br />
        Question: {question.text}
      </Typography.Title>
      <Typography.Text>
        They said:
        <br />
        {data.response}
      </Typography.Text>
    </Modal>
  )
}

export default ResponseToFeedbackRequestModal
