import { Col, Form, Button, Alert } from 'react-bootstrap'

const FileSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <Col xs="3">
      <Form.Control
        type="file"
        acceptCharset="utf-8"
        ref={inputRef}
        onChange={(e) => setSubmission(e.target.files[0])}
      />
      <Button disabled={!submission} onClick={handleSubmit} className="mt-5">
        Submit
      </Button>
    </Col>
  )
}

const TextSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <Col xs="5">
      <Form.Label>Enter text:</Form.Label>
      <Form.Control
        as="textarea"
        ref={inputRef}
        rows={5}
        onChange={(e) => setSubmission(e.target.value)}
      />
      <Button disabled={!submission} onClick={handleSubmit} className="mt-5">
        Submit
      </Button>
    </Col>
  )
}

const URLSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  console.log(submission)
  return (
    <Col xs="3">
      <Form.Label>Enter URL:</Form.Label>
      <Form.Control ref={inputRef} onChange={(e) => setSubmission(e.target.value)} />
      <Button disabled={!submission} onClick={handleSubmit} className="mt-5">
        Submit
      </Button>
    </Col>
  )
}

export { FileSubmission, URLSubmission, TextSubmission }
