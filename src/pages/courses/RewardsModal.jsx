import { Form, Button, Modal, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect } from 'react'
import { addCourseReward } from '../../api/rewards'

const RewardsModal = ({ open, setOpen, setRewards, rewards, course_id }) => {
  const [form] = useForm()

  useEffect(() => {
    form.resetFields()
  }, [open])

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const reward = form.getFieldsValue()
      await addCourseReward({ course_id, reward })
      setRewards([...rewards, reward])
    } catch (e) {
      console.error(e)
    }
    setOpen(false)
  }

  return (
    <Modal
      title="Create new reward"
      open={open}
      onOk={handleSubmit}
      onCancel={() => setOpen(false)}>
      <Form form={form}>
        <Form.Item
          label="Reward Title"
          name="title"
          rules={[{ required: true, message: 'Please input reward title' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Reward description"
          name="description"
          rules={[{ required: true, message: 'Please add a description for the reward' }]}>
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item
          label="Cost"
          name="xp_points"
          rules={[
            {
              required: true,
              message: 'A positive number must be entered.',
              pattern: new RegExp(/^[0-9]+$/)
            }
          ]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RewardsModal
