import { Form, Select, Modal, Input, Switch, Upload, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { addCourseReward, editCourseReward } from '../../api/rewards'
import coursesSelector from '../../store/courses/selectors'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

const RewardsModal = ({ open, setOpen, setRewards, rewards, editingReward }) => {
  const [form] = useForm()
  const [showQuantity, setShowQuantity] = useState(false)
  const [showFile, setShowFile] = useState(false)
  const [picture, setPicture] = useState()
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)

  const typeWatch = Form.useWatch('type', form)
  useEffect(() => {
    form.resetFields()
    setShowQuantity(false)
    setShowFile(false)
    if (editingReward) {
      if (editingReward.picture) {
        setPicture(editingReward.picture)
      }
      form.setFieldsValue(editingReward)
    }
  }, [open])

  useEffect(() => {
    if (typeWatch === 'Bonus' || typeWatch === 'Late Submission') {
      setShowQuantity(true)
      setShowFile(false)
    } else if (typeWatch === 'Other') {
      setShowFile(true)
      setShowQuantity(false)
    } else {
      setShowFile(false)
      setShowQuantity(false)
    }
  }, [typeWatch])

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      if (editingReward) {
        const reward = { ...editingReward, ...form.getFieldsValue() }
        const resp = await editCourseReward({
          course_id: course.pk,
          reward_pk: editingReward.pk,
          reward,
          picture
        })
        if (resp.status === 200) {
          const newRewards = rewards.map((r) => (r.pk === editingReward.pk ? { ...resp.data } : r))
          setRewards(newRewards)
        }
      } else {
        const reward = form.getFieldsValue()
        console.log(reward)
        const resp = await addCourseReward({ course_id: course.pk, reward, picture })
        if (resp.status === 200) setRewards([...rewards, resp.data])
      }
    } catch (e) {
      console.error(e)
    }
    setOpen(false)
  }

  return (
    <Modal
      title={editingReward ? 'Edit reward' : 'Create new reward'}
      open={open}
      onOk={handleSubmit}
      forceRender
      onCancel={() => setOpen(false)}>
      <Form form={form}>
        <Form.Item
          label="Reward Name"
          name="name"
          rules={[{ required: true, message: 'Please input reward name' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Reward description"
          name="description"
          rules={[{ required: true, message: 'Please add a description for the reward' }]}>
          <Input.TextArea rows={4} cols={10} />
        </Form.Item>
        <Form.Item
          label="Reward type"
          name="type"
          rules={[{ required: true, message: 'Please choose one of the options' }]}>
          <Select
            className="text-left"
            options={[
              { value: 'Bonus', label: 'Bonus' },
              { value: 'Late Submission', label: 'Late Submission' },
              { value: 'Theme', label: 'Theme (System level)' },
              { value: 'Other', label: 'Other' }
            ]}></Select>
        </Form.Item>
        <Form.Item
          label="Inventory (number of rewards remaining)"
          name="inventory"
          rules={[
            {
              required: true,
              message: 'A positive number must be entered.',
              pattern: new RegExp(/^[0-9]+$/)
            }
          ]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Cost"
          name="exp_points"
          rules={[
            {
              required: true,
              message: 'A positive number must be entered.',
              pattern: new RegExp(/^[0-9]+$/)
            }
          ]}>
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
        {showFile ? (
          <Form.Item
            name="picture"
            label="Image Showcase"
            rules={[
              {
                required: true,
                message: 'Image must be provided'
              }
            ]}>
            <Upload
              beforeUpload={(file) => {
                setPicture(file)
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
