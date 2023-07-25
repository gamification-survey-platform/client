import { Modal, Typography } from 'antd'
import { Document, Page, pdfjs } from 'react-pdf'
import { useEffect } from 'react'

import { useNavigate } from 'react-router'

const ResponseToFeedbackRequestModal = ({ data, setData }) => {
  const { course_number, assignment_id } = data
  const section = data.report.sections.find((s) => s.pk === data.section)
  const question = section.questions.find((q) => q.pk === data.question)
  const navigate = useNavigate()

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [data])

  return (
    <Modal
      mask={false}
      open={data}
      onCancel={() => {
        navigate(`/courses/${course_number}/assignments/${assignment_id}/view`)
        setData()
      }}
      footer={null}
      width={data.slide_review ? 1000 : 500}
      style={{ top: 20, left: data.slide_review ? '' : '20%' }}>
      <Typography.Title level={5} className="mb-1">
        Your reviewer provided feedback on:
        <br />
        Section: {section.title}
        <br />
        Question: {question.text}
      </Typography.Title>
      {data.slide_review && data.page ? (
        <>
          <Document file={question.file_path}>
            {' '}
            <Page pageNumber={data.page} width={800} />
          </Document>
          <br />
        </>
      ) : null}
      <Typography.Text>
        You asked:
        <br />
        {data.request}
      </Typography.Text>
      <br />
      <Typography.Text>
        They said:
        <br />
        {data.response}
      </Typography.Text>
    </Modal>
  )
}

export default ResponseToFeedbackRequestModal
