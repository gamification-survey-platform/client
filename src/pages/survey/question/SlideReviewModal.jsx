import { useEffect, useState } from 'react'
import { Modal, Form, Input, Row, Col, Divider, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Document, Page, pdfjs } from 'react-pdf'
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { editAnswer } from '../../../store/survey/surveySlice'

const SlideReviewModal = ({ pk, artifact, answer, open, setOpen, sectionPk }) => {
  const [form] = useForm()
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const dispatch = useDispatch()
  const enableBackward = pageNumber > 1
  const enableForward = pageNumber < numPages

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [open])

  const backwardStyles = enableBackward
    ? { cursor: 'pointer', fontSize: 20 }
    : { opacity: 0.5, cursor: 'auto', fontSize: 20 }
  const forwardStyles = enableForward
    ? { cursor: 'pointer', fontSize: 20 }
    : { opacity: 0.5, cursor: 'auto', fontSize: 20 }

  const saveAnswer = () => {
    const answer = (form.getFieldValue(`${pk}`) || '').trim()
    dispatch(
      editAnswer({
        questionPk: pk,
        sectionPk,
        answer,
        page: pageNumber,
        question_type: 'SLIDEREVIEW'
      })
    )
  }

  const handlePageBackward = () => {
    if (pageNumber > 1) {
      saveAnswer()
      setPageNumber(pageNumber - 1)
      const newPageAnswer = answer.find((a) => a.page === pageNumber - 1)
      const answerText = newPageAnswer ? newPageAnswer.text : ''
      form.setFieldValue(`${pk}`, answerText)
    }
  }

  const handlePageForward = () => {
    if (pageNumber < numPages) {
      saveAnswer()
      setPageNumber(pageNumber + 1)
      const newPageAnswer = answer.find((a) => a.page === pageNumber + 1)
      const answerText = newPageAnswer ? newPageAnswer.text : ''
      form.setFieldValue(`${pk}`, answerText)
    }
  }

  return (
    <Modal
      forceRender
      title={'Slide Reviews'}
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <div>
          <Divider />
          <Row justify="center">
            <Button type="primary" onClick={() => setOpen(false)}>
              Save
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
