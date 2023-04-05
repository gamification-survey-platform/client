import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import userSelector from '../store/user/selectors'
import DefaultImage from '../assets/default.jpg'
import { Space, Row, Col, Form, Image, Button, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Input from 'antd/es/input/Input'
import { editProfile } from '../api/profile'

const Profile = () => {
  const user = useSelector(userSelector)
  const [currentUser, setCurrentUser] = useState(user)
  const [editing, setEditing] = useState(false)
  const { first_name, last_name, email, date_joined: unformattedDate } = currentUser
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
      await form.validateFields()
      const { first_name, last_name, email } = form.getFieldsValue()
      await editProfile({ first_name, last_name, email })
      setEditing(false)
    }
  }

  return (
    <Row className="mt-5">
      <Col span={8} offset={2}>
        <Row justify="center">
          <Image src={DefaultImage} width={100} style={{ borderRadius: '50%' }} />
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
