import { useEffect, useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { login, register, STATUS } from '../store/user/userSlice'
import userSelector from '../store/user/selectors'
import { useSelector, useDispatch } from 'react-redux'

const Landing = () => {
  const [andrewId, setAndrewId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, status } = useSelector(userSelector)
  const [message, setMessage] = useState()

  useEffect(() => {
    if (user && status == STATUS.LOGIN_SUCCESS) {
      navigate('/dashboard')
    } else if (!user) {
      setAndrewId('')
      setPassword('')
      setMessage(status)
    }
  }, [user, status])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login({ andrewId, password }))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    dispatch(register({ andrewId, password }))
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
        {message === STATUS.LOGIN_FAILED && (
          <Alert className="mt-5" variant="danger">
            Failed to login
          </Alert>
        )}
        {message === STATUS.REGISTRATION_SUCCESS && (
          <Alert className="mt-5" variant="success">
            Successfully registered! Please re-enter your AndrewID and password
          </Alert>
        )}
        {message === STATUS.REGISTRATION_FAILED && (
          <Alert className="mt-5" variant="danger">
            Failed to register
          </Alert>
        )}
      </Form>
    </Card>
  )
}

export default Landing
