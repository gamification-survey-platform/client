import { useEffect, useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/user/userSlice'
import userSelector from '../store/user/selectors'
import { useSelector, useDispatch } from 'react-redux'

const Landing = () => {
  const [andrewId, setAndrewId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, status } = useSelector(userSelector)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (user && status == 'success') {
      navigate('/dashboard')
    } else if (!user && status == 'failed') {
      setShowError(true)
    }
  }, [user, status])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login({ username: andrewId, password }))
  }

  return (
    <Card style={{ width: '50%' }} className="mx-auto mt-5">
      <Form className="m-5" onSubmit={handleLogin}>
        {
          // eslint-disable-next-line react/no-unescaped-entities
          <h2>Welcome! Let's get started.</h2>
        }
        <h3>Sign in to continue.</h3>
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
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login
        </Button>
        {showError && (
          <Alert className="mt-5" variant="danger">
            Invalid username/password
          </Alert>
        )}
      </Form>
    </Card>
  )
}

export default Landing
