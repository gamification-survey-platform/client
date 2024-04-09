import { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Row, Form, Space, Typography, Input, Button, Alert, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/login'
import { setUser } from '../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../components/Spinner'
import '../styles/Login.css'
import { addMember } from '../api/members'

const Landing = () => {
  const [form] = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const [spin, setSpin] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    form.validateFields(['andrewId', 'password'])
    const { andrewId, password } = form.getFieldsValue()
    setSpin(true)
    try {
      const res = await loginApi({ andrewId, password })
      if (res.status === 200) {
        const { token, id, ...rest } = res.data
        localStorage.setItem('userId', id)
        dispatch(setUser(rest))
        navigate('/dashboard')
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
    setSpin(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { andrewId, password } = form.getFieldsValue()
    try {
      await form.validateFields(['andrewId', 'password'])
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: 'Please fill out the relevant fields!' })
      return
    }
    try {
      const res = await registerApi({ andrewId, password })
      if (res.status === 200) {
        messageApi.open({
          type: 'success',
          content: `Successfully registered! Please login to continue.`
        })
        try {
          const addMemberResponse = await addMember({
            course_id: '6',
            memberId: andrewId,
            memberRole: 'Student'
          })
          const addMemberResponse2 = await addMember({
            course_id: '7',
            memberId: andrewId,
            memberRole: 'Student'
          })
          if (addMemberResponse.status === 201) {
            messageApi.open({
              type: 'success',
              content: `You've been registered to Welcome course as well!`
            })
          } else {
            console.error(addMemberResponse)
            messageApi.open({
              type: 'error',
              content: 'There was an issue registering you to Welcome course.'
            })
          }
          if (addMemberResponse2.status === 201) {
            messageApi.open({
              type: 'success',
              content: `You've been registered to How to Provide Effective Feedback course as well!`
            })
          } else {
            console.error(addMemberResponse2)
            messageApi.open({
              type: 'error',
              content:
                'There was an issue registering you to How to Provide Effective Feedback course.'
            })
          }
        } catch (e) {
          console.error(e)
          messageApi.open({
            type: 'error',
            content: 'Failed to automatically register to welcome course.'
          })
        }
        form.setFieldsValue({ andrewId: '', password: '' })
      }
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }

  const handleEnter = (e) => e.keyCode === 13 && handleLogin(e)

  return (
    <Space
      direction="vertical"
      size="large"
      align="center"
      className="login-container" // use className for custom styling
    >
      {contextHolder}
      {spin ? (
        <Spinner show={spin} />
      ) : (
        <Card className="login-card">
          <Row justify="center" className="login-header">
            <Typography.Title level={1}>Welcome!</Typography.Title>
          </Row>
          <Row justify="center">
            <Typography.Title level={4} className="login-subheader">
              Let&lsquo;s get started.
            </Typography.Title>
          </Row>
          <Form form={form} onFinish={handleLogin} onKeyUp={handleEnter} className="login-form">
            <Form.Item
              name="andrewId"
              rules={[{ required: true, message: 'Please input your Andrew ID!' }]}
              className="login-form-item">
              <Input prefix={<UserOutlined />} placeholder="Andrew ID" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
              className="login-form-item">
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Row justify="center">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={handleLogin}>
                  Log in
                </Button>
              </Form.Item>
            </Row>
            <Row justify="center">
              <Form.Item>
                <Button onClick={handleRegister} className="register-button">
                  Register!
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Card>
      )}
    </Space>
  )
}

export default Landing
