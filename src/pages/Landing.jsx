import { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Row, Form, Space, Typography, Input, Button, Alert } from 'antd'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/login'
import { setUser } from '../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../components/Spinner'

const Landing = () => {
  const [form] = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [message, setMessage] = useState()
  const [spin, setSpin] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    form.validateFields(['andrewId', 'password'])
    const { andrewId, password } = form.getFieldsValue()
    setSpin(true)
    try {
      const res = await loginApi({ andrewId, password })
      if (res.status === 200) {
        const { token, ...rest } = res.data
        dispatch(setUser(rest))
        navigate('/dashboard')
      }
    } catch (e) {
      console.error(e)
      setMessage({ type: 'error', message: 'Failed to login.' })
    }
    setSpin(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    form.validateFields(['andrewId', 'password'])
    const { andrewId, password } = form.getFieldsValue()
    try {
      const res = await registerApi({ andrewId, password })
      if (res.status === 200)
        setMessage({
          type: 'success',
          message: 'Successfully registered! Please login to continue.'
        })
    } catch (e) {
      console.error(e)
      setMessage({ type: 'error', message: 'Failed to register.' })
    }
  }

  const handleEnter = (e) => e.keyCode === 13 && handleLogin(e)

  return (
    <Space
      direction="vertical"
      size="middle"
      align="center"
      style={{ width: '100%', marginTop: '5rem' }}>
      {spin ? (
        <Spinner show={spin} />
      ) : (
        <Card style={{ width: 800 }}>
          <Row justify="center">
            <Typography.Title level={1}>Welcome!</Typography.Title>
          </Row>
          <Row justify="center">
            <Typography.Title level={2}>Let&lsquo;s get started.</Typography.Title>
          </Row>
          <Form form={form} onFinish={handleLogin} onKeyUp={handleEnter}>
            <Row justify="center">
              <Form.Item
                name="andrewId"
                rules={[{ required: true, message: 'Please input a Andrew ID!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Andrew ID" />
              </Form.Item>
            </Row>
            <Row justify="center">
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input a Password!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
            </Row>
            <Row justify="center">
              <Form.Item>
                <Button onClick={handleLogin} type="primary">
                  Log in
                </Button>
              </Form.Item>
            </Row>
            <Row justify="center">
              <Form.Item>
                <Button onClick={handleRegister}>Register Now!</Button>
              </Form.Item>
            </Row>
            {message && (
              <Row justify="center">
                <Alert message={message.message} type={message.type} showIcon />
              </Row>
            )}
          </Form>
        </Card>
      )}
    </Space>
  )
}

export default Landing
