import { useEffect, useState } from 'react'
import { Modal, Row, Col, Divider, Typography } from 'antd'
import { Document, Page, pdfjs } from 'react-pdf'
import { RightCircleFilled, LeftCircleFilled, QuestionCircleTwoTone } from '@ant-design/icons'
import FeedbackRequestModal from '../../../components/FeedbackRequestModal'

const SlideReviewReport = ({
  file_path,
  artifact_reviews,
  open,
  setOpen,
  handleFeedbackClick,
  section,
  question
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [requestFeedbackData, setRequestFeedbackData] = useState()
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

  const handlePageBackward = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const handlePageForward = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  return (
    <Modal
      forceRender
      title={'Slide Reviews'}
      open={open}
      onCancel={() => {
        setPageNumber(1)
        setOpen(false)
      }}
      width={1000}
      footer={null}>
      {requestFeedbackData ? (
        <FeedbackRequestModal
          data={requestFeedbackData}
          setData={setRequestFeedbackData}
          slide_review={true}
        />
      ) : null}
      <div>
        <Row>
          <Col offset={1} span={10}>
            <Document file={file_path} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {' '}
              <Page pageNumber={pageNumber} width={500} />
            </Document>
          </Col>
          <Col offset={1} span={10}>
            <Typography.Title level={5}>
              Peer feedback is separated by dividing lines
            </Typography.Title>
            {artifact_reviews.map((review, i) => {
              const pageAnswer = review.find((r) => parseInt(r.page) === pageNumber)
              const text = pageAnswer && pageAnswer.text ? pageAnswer.text : ''
              return (
                <div key={i}>
                  <Divider />
                  <Row>
                    <div key={i}>{text}</div>
                    <QuestionCircleTwoTone
                      className="ml-3"
                      role="button"
                      onClick={() => handleFeedbackClick(section, question, pageAnswer, true)}
                    />
                  </Row>
                </div>
              )
            })}
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
      </div>
    </Modal>
  )
}

export default SlideReviewReport
