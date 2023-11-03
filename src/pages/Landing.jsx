import { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Row, Form, Space, Typography, Input, Button, Alert, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/login'
import { setUser } from '../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../components/Spinner'
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
        const { token, ...rest } = res.data
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
    e.preventDefault();
    const { andrewId, password } = form.getFieldsValue();
    try {
        await form.validateFields(['andrewId', 'password']);
    } catch (e) {
        console.error(e);
        messageApi.open({ type: 'error', content: 'Please fill out the relevant fields!' });
        return;
    }
    try {
        const res = await registerApi({ andrewId, password });
        if (res.status === 200) {
            messageApi.open({
                type: 'success',
                content: `Successfully registered! Please login to continue.`
            });
            try {
                const addMemberResponse = await addMember({
                    course_id: "1000",
                    memberId: andrewId,
                    memberRole: 'Student'
                });
                if (addMemberResponse.status === 201) {
                    messageApi.open({
                        type: 'success',
                        content: `You've been registered to welcome course as well!`
                    });
                } else {
                    console.error(addMemberResponse);
                    messageApi.open({
                        type: 'error',
                        content: 'There was an issue registering you to welcome course.'
                    });
                }
            } catch (e) {
                console.error(e);
                messageApi.open({
                    type: 'error',
                    content: 'Failed to automatically register to welcome course.'
                });
            }
        form.setFieldsValue({ andrewId: '', password: '' }); 
        }
    } catch (e) {
        console.error(e);
        messageApi.open({ type: 'error', content: e.message });
    }
}

  const handleEnter = (e) => e.keyCode === 13 && handleLogin(e)

  return (
    <Space
      direction="vertical"
      size="middle"
      align="center"
      style={{ width: '100%', marginTop: '5rem' }}>
      {contextHolder}
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
          </Form>
        </Card>
      )}
    </Space>
  )
}

export default Landing
