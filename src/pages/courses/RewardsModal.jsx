import { Form, Select, Modal, Input, Switch, Upload, Button, Image } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { addCourseReward, editCourseReward } from '../../api/rewards'
import coursesSelector from '../../store/courses/selectors'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import useMessage from 'antd/es/message/useMessage'

const RewardsModal = ({ open, setOpen, setRewards, rewards, editingReward }) => {
  const [form] = useForm()
  const [showQuantity, setShowQuantity] = useState(false)
  const [messageApi, contextHolder] = useMessage()
  const [showFile, setShowFile] = useState(true)
  const [picture, setPicture] = useState()
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)
  const [showOldImage, setShowOldImage] = useState(!!editingReward)
  const [fileList, setFileList] = useState([])

  const handleFileChange = (info) => {
    setFileList(info.fileList)

    if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
      setPicture(info.fileList[0].originFileObj)
    } else {
      setPicture(null)
    }
  }

  const typeWatch = Form.useWatch('type', form)
  useEffect(() => {
    if (editingReward) {
      form.setFieldsValue({
        name: editingReward.name,
        description: editingReward.description,
        type: editingReward.type,
        inventory: editingReward.inventory,
        points: editingReward.points,
        is_active: editingReward.is_active
      })

      if (editingReward.picture) {
        setFileList([
          {
            uid: '-1',
            name: 'ExistingImage.png',
            status: 'done',
            url: editingReward.picture
          }
        ])
      } else {
        setFileList([])
      }
    }
  }, [editingReward, form])

  useEffect(() => {
    if (typeWatch === 'Bonus' || typeWatch === 'Late Submission') {
      setShowQuantity(true)
    } else {
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
          const { upload_url = null, download_url = null, ...rest } = resp.data
          if (download_url) {
            const newRewards = rewards.map((r) =>
              r.pk === editingReward.pk ? { ...rest, picture: download_url } : r
            )
            setRewards(newRewards)
          } else {
            const newRewards = rewards.map((r) =>
              r.pk === editingReward.pk ? { ...resp.data } : r
            )
            setRewards(newRewards)
          }
        }
      } else {
        const reward = form.getFieldsValue()
        const resp = await addCourseReward({ course_id: course.pk, reward, picture })
        if (resp.status === 200) {
          messageApi.open({ type: 'success', content: 'Successfully added course reward.' })
        }
      }
      setOpen(false)
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }

  return (
    <Modal
      title={editingReward ? 'Edit reward' : 'Create new reward'}
      open={open}
      onOk={handleSubmit}
      forceRender
      onCancel={() => setOpen(false)}>
      {contextHolder}
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
          name="points"
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
        <Form.Item>
          {showOldImage ? <Image width={200} src={editingReward.picture} /> : null}
        </Form.Item>
        {showFile ? (
          <Form.Item name="picture" label="Image Showcase">
            <Upload
              accept="image/png, image/jpeg"
              maxCount={1}
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}>
              <Button>{editingReward ? 'Change Image (Optional)' : 'Upload Image'}</Button>
            </Upload>
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  )
}

export default RewardsModal
