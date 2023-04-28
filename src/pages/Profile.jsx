import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import userSelector from '../store/user/selectors'
import DefaultImage from '../assets/default.jpg'
import { Upload, Row, Col, Form, Image, Button, Typography } from 'antd'

import { useForm } from 'antd/es/form/Form'
import Input from 'antd/es/input/Input'
import { editProfile, updateProfilePic } from '../api/profile'
import useMessage from 'antd/es/message/useMessage'
import { setUser } from '../store/user/userSlice'

const Profile = () => {
  const user = useSelector(userSelector)
  const [editing, setEditing] = useState(false)
  const [messageApi, contextHolder] = useMessage()
  const { first_name, last_name, email, date_joined: unformattedDate } = user
  const dispatch = useDispatch()
  const [form] = useForm()
  const date_joined = new Date(unformattedDate).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  const initialValues = { first_name, last_name, email, date_joined }

  const handleClick = async (e) => {
    if (!editing) {
      setEditing(true)
    } else {
      try {
        await form.validateFields()
        const { first_name, last_name, email } = form.getFieldsValue()
        const res = await editProfile({ first_name, last_name, email })
        dispatch(setUser(res.data))
        setEditing(false)
      } catch (e) {
        console.error(e)
        messageApi.open({ type: 'error', content: e.message })
      }
    }
  }

  const handleUpload = async (file) => {
    try {
      const res = await updateProfilePic(file)
      dispatch(setUser(res.data))
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
    return false
  }
  return (
    <Row className="mt-5">
      {contextHolder}
      <Col span={8} offset={2}>
        <Row justify="center" className="mb-3">
          <Image
            src={user && user.image ? user.image : DefaultImage}
            width={100}
            style={{ borderRadius: '50%' }}
          />
        </Row>
        <Row className="mb-3" justify="center">
          <Upload
            showUploadList={false}
            maxCount={1}
            className="d-flex justify-content-center"
            accept="image/png, image/jpeg"
            beforeUpload={handleUpload}>
            <Button>Update profile picture</Button>
          </Upload>
        </Row>
        <Row justify="center">
          <Typography.Title level={2}>
            {user.first_name} {user.last_name}
          </Typography.Title>
        </Row>
        <Row justify="center">
          <Typography.Title level={3}>AndrewID: {user.andrew_id}</Typography.Title>
        </Row>
      </Col>
      <Col span={10} offset={2}>
        <Form initialValues={initialValues} form={form}>
          <Form.Item
            name="first_name"
            label="First name"
            rules={[{ required: true, message: 'Please add a first name' }]}>
            <Input readOnly={!editing} />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last name"
            rules={[{ required: true, message: 'Please add a last name' }]}>
            <Input readOnly={!editing} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please add a last name' }]}>
            <Input readOnly={!editing} />
          </Form.Item>
          <Form.Item name="date_joined" label="Date Joined">
            <Input readOnly />
          </Form.Item>
          <Row justify="center">
            <Button onClick={handleClick} type={editing ? 'primary' : 'default'}>
              {editing ? 'Save' : 'Edit Profile'}
            </Button>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}
export default Profile
