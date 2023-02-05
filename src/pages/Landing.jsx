import { useState } from 'react'
import { Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const [andrewId, setAndrewId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <Card style={{ width: '50%' }} className="mx-auto mt-5">
      <Form className="m-5" onSubmit={handleLogin}>
        <h2>Welcome! Let's get started.</h2>
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
      </Form>
    </Card>
  )
}

export default Landing
