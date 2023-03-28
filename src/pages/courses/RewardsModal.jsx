import { Form, Select, Modal, Input, Switch, Upload, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { addCourseReward } from '../../api/rewards'

const RewardsModal = ({ open, setOpen, setRewards, rewards, course_id }) => {
  const [form] = useForm()
  const [showQuantity, setShowQuantity] = useState(false)
  const [showFile, setShowFile] = useState(false)
  const typeWatch = Form.useWatch('type', form)
  console.log(showFile)
  useEffect(() => {
    form.resetFields()
    setShowQuantity(false)
    setShowFile(false)
  }, [open])

  useEffect(() => {
    if (typeWatch === 'Bonus' || typeWatch === 'Late Submission') {
      setShowQuantity(true)
    } else if (typeWatch === 'other' || typeWatch === 'Badge') {
      setShowFile(true)
    }
  }, [typeWatch])

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
        <Form.Item label="Reward Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Reward description" name="description">
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item label="Reward type" name="type">
          <Select
            className="text-left"
            options={[
              { value: 'Badge', label: 'Badge' },
              { value: 'Bonus', label: 'Bonus' },
              { value: 'Late Submission', label: 'Late Submission' },
              { value: 'Theme', label: 'Theme (System level)' },
              { value: 'other', label: 'other' }
            ]}></Select>
        </Form.Item>
        <Form.Item label="Inventory" name="inventory">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Cost" name="xp_points">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="is_active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
        {showQuantity ? (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: 'A positive number must be entered.',
                pattern: new RegExp(/^[0-9]+$/)
              }
            ]}>
            <Input type="number" />
          </Form.Item>
        ) : null}
        {showQuantity ? (
          <Form.Item name="quantity" label="Quantity">
            <Input type="number" />
          </Form.Item>
        ) : null}
        {showFile ? (
          <Form.Item name="picture" label="Image Showcase">
            <Upload
              beforeUpload={(file) => {
                const url = URL.createObjectURL(file)
                console.log(url)
                return false
              }}>
              <Button>Please upload an image showcasing the reward.</Button>
            </Upload>
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  )
}

export default RewardsModal
/*
rules={[{ required: true, message: 'Please input reward name' }]}>
rules={[
  {
    required: true,
    message: 'Image must be provided'
  }
]}>
rules={[
  {
    required: true,
    message: 'A positive number must be entered.',
    pattern: new RegExp(/^[0-9]+$/)
  }
]}>
rules={[
  {
    required: true,
    message: 'A positive number must be entered.',
    pattern: new RegExp(/^[0-9]+$/)
  }
]}>
rules={[
  {
    required: true,
    message: 'A positive number must be entered.',
    pattern: new RegExp(/^[0-9]+$/)
  }
]}>
rules={[{ required: true, message: 'Please choose one of the options' }]}>
rules={[{ required: true, message: 'Please add a description for the reward' }]}>
*/
