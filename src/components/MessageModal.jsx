import { Form, Modal, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { sendNotification } from '../api/notifications'

const MessageModal = ({ open, setOpen }) => {
  const [form] = useForm()
  const [messageApi, contextHolder] = useMessage()

  const handleSubmit = async () => {
    try {
      form.validateFields()
      const data = form.getFieldsValue()
      const res = await sendNotification({ type: 'MESSAGE', ...data })
      if (res.status === 201) {
        messageApi.open({
          type: 'success',
          content: `Successfully sent message to ${data.receiver}`
        })
        setOpen(false)
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }

  return (
    <Modal
      title={'Create New Message'}
      open={open}
      onOk={handleSubmit}
      forceRender
      onCancel={() => setOpen(false)}>
      {contextHolder}
      <Form form={form}>
        <Form.Item
          name="receiver"
          label="Recipient"
          rules={[{ required: true, message: 'Please input a Andrew ID!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="text"
          label="Content"
          rules={[{ required: true, message: 'Your message requires some content.' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MessageModal
