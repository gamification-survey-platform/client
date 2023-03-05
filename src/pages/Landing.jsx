import { useEffect, useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/login'
import { setUser } from '../store/user/userSlice'
import { useDispatch } from 'react-redux'

const Landing = () => {
  const [andrewId, setAndrewId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [message, setMessage] = useState()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await loginApi({ andrewId, password })
      if (res.status === 200) {
        const { token, ...rest } = res.data
        dispatch(setUser(rest))
        navigate('/dashboard')
      }
    } catch (e) {
      console.error(e)
      setMessage({ type: 'danger', text: 'Failed to login.' })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await registerApi({ andrewId, password })
      if (res.status === 200)
        setMessage({ type: 'success', text: 'Successfully registered! Please login to continue.' })
    } catch (e) {
      console.error(e)
      setMessage({ type: 'danger', text: 'Failed to register.' })
    }
    setAndrewId('')
    setPassword('')
  }

  return (
    <Card style={{ width: '50%' }} className="mx-auto mt-5">
      <Form className="m-5" onSubmit={handleLogin}>
        {
          // eslint-disable-next-line react/no-unescaped-entities
          <h2>Welcome! Let's get started.</h2>
        }
        <h3>Sign in or Register to continue.</h3>
        <Form.Group style={{ textAlign: 'left' }} className="m-5">
          <Form.Label>Andrew ID:</Form.Label>
          <Form.Control
            type="text"
            autoComplete="on"
            placeholder="Enter Andrew ID"
            value={andrewId}
            onChange={(e) => setAndrewId(e.target.value)}
          />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }} className="m-5">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            autoComplete="off"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex flex-column w-25 mx-auto my-0">
          <Button
            disabled={!andrewId || !password}
            variant="primary"
            type="submit"
            onClick={handleLogin}>
            Login
          </Button>
          <Button
            disabled={!andrewId || !password}
            className="mt-3"
            variant="info"
            type="submit"
            onClick={handleRegister}>
            Register
          </Button>
        </div>
        {message && (
          <Alert className="mt-5" variant={message.type}>
            {message.text}
          </Alert>
        )}
      </Form>
    </Card>
  )
}

export default Landing
