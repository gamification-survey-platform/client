import { Col, Form, Button, Alert } from 'react-bootstrap'

const FileSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <>
      <Form.Control
        type="file"
        acceptCharset="utf-8"
        ref={inputRef}
        onChange={(e) => setSubmission(e.target.files[0])}
      />
      <Button disabled={!submission} onClick={handleSubmit} className="mt-5">
        Submit
      </Button>
    </>
  )
}

const TextSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <>
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
    </>
  )
}

const URLSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <>
      <Form.Label>Enter URL:</Form.Label>
      <Form.Control ref={inputRef} onChange={(e) => setSubmission(e.target.value)} />
      <Button disabled={!submission} onClick={handleSubmit} className="mt-5">
        Submit
      </Button>
    </>
  )
}

export { FileSubmission, URLSubmission, TextSubmission }
