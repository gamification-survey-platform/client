import { Form, Input, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const FileSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <Form>
      <Form.Item label="Submit assignment">
        <Upload
          accept="application/pdf"
          maxCount={1}
          beforeUpload={(file) => {
            setSubmission(file)
            return false
          }}>
          <Button icon={<UploadOutlined />}>Click to upload submission</Button>
        </Upload>
      </Form.Item>
      <Button type="primary" disabled={!submission} onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  )
}

const TextSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <Form>
      <Form.Item label="Enter text:">
        <Input.TextArea
          as="textarea"
          ref={inputRef}
          rows={5}
          onChange={(e) => setSubmission(e.target.value)}
        />
      </Form.Item>
      <Button type="primary" disabled={!submission} onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  )
}

const URLSubmission = ({ submission, setSubmission, handleSubmit, inputRef }) => {
  return (
    <Form>
      <Form.Item label="Enter URL:">
        <Input ref={inputRef} onChange={(e) => setSubmission(e.target.value)} />
      </Form.Item>
      <Button disabled={!submission} onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  )
}

export { FileSubmission, URLSubmission, TextSubmission }
