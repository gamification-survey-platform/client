import { useEffect, useState } from 'react'
import { Modal, Form, Input, Row, Col, Divider, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Document, Page, pdfjs } from 'react-pdf'
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons'

const SlideReviewModal = ({
  pk,
  artifact,
  answer,
  open,
  setOpen,
  sectionIdx,
  survey,
  setSurvey
}) => {
  const [form] = useForm()
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const enableBackward = pageNumber > 1
  const enableForward = pageNumber < numPages

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    form.resetFields()
  }, [open])

  const backwardStyles = enableBackward
    ? { cursor: 'pointer', fontSize: 20 }
    : { opacity: 0.5, cursor: 'auto', fontSize: 20 }
  const forwardStyles = enableForward
    ? { cursor: 'pointer', fontSize: 20 }
    : { opacity: 0.5, cursor: 'auto', fontSize: 20 }

  const saveAnswer = () => {
    const newAnswer = (form.getFieldValue(`${pk}`) || '').trim()
    const oldAnswer = answer.find((a) => a.page === pageNumber)
    let newAnswers = [...answer]
    if (oldAnswer) {
      newAnswers = answer.map((a, i) => (i === pageNumber - 1 ? newAnswer : a))
    } else if (newAnswer.length) {
      newAnswers.push({ page: pageNumber, text: newAnswer })
    }
    const questions = survey.sections[sectionIdx].questions.map((question) =>
      question.pk === pk ? { ...question, answer: newAnswers } : question
    )
    const sections = survey.sections.map((section, i) =>
      i === sectionIdx ? { ...section, questions } : section
    )
    setSurvey({ ...survey, sections })
  }

  const handlePageBackward = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
      saveAnswer()
      const newPageAnswer = answer.find((a) => a.page === pageNumber - 1)
      form.setFieldValue(`${pk}`, newPageAnswer)
    }
  }

  const handlePageForward = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
      saveAnswer()
      const newPageAnswer = answer.find((a) => a.page === pageNumber + 1)
      form.setFieldValue(`${pk}`, newPageAnswer)
    }
  }

  return (
    <Modal
      forceRender
      title={'Slide Reviews'}
      open={open}
      footer={
        <div>
          <Divider />
          <Row justify="center">
            <Button type="primary" onClick={() => setOpen(false)}>
              Submit
            </Button>
          </Row>
        </div>
      }
      width={1000}>
      <Form form={form}>
        <Row className="text-center">
          <Col span={10}>
            <Form.Item name={pk}>
              <Input.TextArea rows={20} style={{ height: 'auto' }} />
            </Form.Item>
          </Col>
          <Col offset={1} span={10}>
            <Document file={artifact} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {' '}
              <Page pageNumber={pageNumber} width={500} />
            </Document>
          </Col>
        </Row>
        <Row justify="center">
          <div className="mt-3">
            <LeftCircleFilled
              style={backwardStyles}
              role="button"
              className="mr-3"
              onClick={handlePageBackward}
            />
            <span>{` ${pageNumber} of ${numPages}`}</span>
            <RightCircleFilled
              style={forwardStyles}
              role="button"
              className="ml-3"
              onClick={handlePageForward}
            />
          </div>
        </Row>
      </Form>
    </Modal>
  )
}

export default SlideReviewModal
