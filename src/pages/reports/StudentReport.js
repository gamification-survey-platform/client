import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router'
import { getArtifactAnswers, getKeywords, getStudentStatistics } from '../../api/reports'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { Row, Typography, Form, Collapse, Col } from 'antd'
import { useSelector } from 'react-redux'
import { useForm } from 'antd/es/form/Form'
import { scaleOptions } from '../survey/question/Question'
import courseSelector from '../../store/courses/selectors'
import SlideReviewReport from '../survey/question/SlideReviewReport'
import { QuestionCircleTwoTone } from '@ant-design/icons'
import { Document, Page, pdfjs } from 'react-pdf'
import FeedbackRequestModal from '../../components/FeedbackRequestModal'
import ResponseToRequestFeedbackModal from '../../components/ResponseToFeedbackRequestModal'

const StudentReport = () => {
  const { course_id: course_number, assignment_id, artifact_id } = useParams()
  const { state = null } = useLocation()
  const courses = useSelector(courseSelector)
  const [report, setReport] = useState()
  const [statistics, setStatistics] = useState()
  const [form] = useForm()
  const [keywords, setKeywords] = useState()
  const course = courses.find((course) => course.course_number === course_number)
  const [openSlideReview, setOpenSlideReview] = useState(false)
  const [requestFeedbackData, setRequestFeedbackData] = useState()
  const [responseToRequestFeedbackData, setResponseToRequestFeedbackData] = useState()

  useEffect(() => {
    if (state && report) {
      const { section, question } = state
      const name = `${section}-${question}`
      const questionElement = document.getElementById(name)
      if (questionElement) questionElement.scrollIntoView(true)
      setTimeout(() => setResponseToRequestFeedbackData({ report, ...state }), 1000)
    }
  }, [state, report])

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [])

  useEffect(() => {
    const fetchArtifactAnswers = async () => {
      const res = await getArtifactAnswers({ course_id: course.pk, assignment_id, artifact_id })
      if (res.status === 200) {
        setReport(res.data)
      }
    }
    fetchArtifactAnswers()
  }, [])

  useEffect(() => {
    const fetchStatistics = async () => {
      const res = await getStudentStatistics({ course_id: course.pk, assignment_id, artifact_id })
      if (res.status === 200) {
        setStatistics(res.data)
      }
    }
    fetchStatistics()
  }, [])

  useEffect(() => {
    const fetchKeywords = async () => {
      const res = await getKeywords({ course_id: course.pk, assignment_id, artifact_id })
      if (res.status === 200) {
        setKeywords(res.data)
      }
    }
    fetchKeywords()
  }, [])

  const handleFeedbackClick = async (section, question, answer, slide_review = false) => {
    setRequestFeedbackData({ section, question, answer, slide_review })
  }

  return (
    <>
      {requestFeedbackData ? (
        <FeedbackRequestModal data={requestFeedbackData} setData={setRequestFeedbackData} />
      ) : null}
      {responseToRequestFeedbackData ? (
        <ResponseToRequestFeedbackModal
          data={responseToRequestFeedbackData}
          setData={setResponseToRequestFeedbackData}
        />
      ) : null}
      <Form form={form} className="m-5 w-75" disabled={true}>
        <Typography.Title level={2} className="text-center">
          Student Report
        </Typography.Title>
        <Typography.Title level={5}>
          Click on <QuestionCircleTwoTone /> to ask for more feedback from your reviewer
        </Typography.Title>
        {report &&
          report.sections.map((section, i) => {
            const { title } = section
            return (
              <Collapse
                key={i}
                size="large"
                className="mb-3"
                defaultActiveKey={state ? 0 : undefined}>
                <Collapse.Panel header={title}>
                  {section.questions.map((question, i) => {
                    const {
                      artifact_reviews,
                      text,
                      question_type,
                      number_of_scale = undefined,
                      option_choices = undefined,
                      file_path = undefined
                    } = question
                    let data
                    if (statistics && statistics.sections[title]) {
                      const questionStatistics = statistics.sections[title][text]
                      const { labels, counts } = questionStatistics
                      const rawData = labels.reduce(
                        (prev, l, i) => ({ ...prev, [l]: counts[i] }),
                        {}
                      )
                      data = { data: rawData, title: text }
                    }

                    return (
                      <Row key={i}>
                        <Col span={data ? 10 : 20}>
                          <Typography.Title level={4} id={`${section.pk}-${question.pk}`} style={{ marginTop: 150, marginLeft: 40 }}>
                            {text}
                          </Typography.Title>
                          {question_type === 'SLIDEREVIEW' && (
                            <div style={{ cursor: 'pointer' }}>
                              <Row>
                                <Document
                                  file={file_path}
                                  onClick={() => setOpenSlideReview(!openSlideReview)}>
                                  {' '}
                                  <Page pageNumber={1} width={400} />
                                </Document>
                                <div>Click on submission to view feedback.</div>
                              </Row>
                              <SlideReviewReport
                                section={section}
                                question={question}
                                handleFeedbackClick={handleFeedbackClick}
                                file_path={file_path}
                                artifact_reviews={artifact_reviews}
                                open={openSlideReview}
                                setOpen={setOpenSlideReview}
                              />
                            </div>
                          )}
                          {/* {question_type === 'SCALEMULTIPLECHOICE' ? (
                            <Row className="ml-3">
                              <Typography.Title level={5}>
                                Options: {scaleOptions[number_of_scale].join(', ')}
                              </Typography.Title>
                            </Row>
                          ) : null} */}
                          {question_type === 'MULTIPLECHOICE' ||
                          question_type === 'MULTIPLESELECT' ? (
                            <Row className="ml-3">
                              <Typography.Title level={5}>
                                Options: {option_choices.map((opt) => opt.text).join(', ')}
                              </Typography.Title>
                            </Row>
                          ) : null}
                          {question_type !== 'SLIDEREVIEW' && question_type === 'SCALEMULTIPLECHOICE' && (
                            <>
                              <Row className="ml-3">
                                <Typography.Title level={5}>Answers</Typography.Title>
                              </Row>
                              {artifact_reviews.map((review, i) => {
                                return (
                                  <Row key={i} className="ml-5">
                                    {review.map((r, i) => r.text).join(', ')}
                                    <QuestionCircleTwoTone
                                      className="ml-3"
                                      role="button"
                                      onClick={() => handleFeedbackClick(section, question, review)}
                                    />
                                  </Row>
                                )
                              })}
                            </>
                          )}
                        </Col>
                        {data && !responseToRequestFeedbackData ? (
                          <Col span={8}>
                            <div style={{ height: 400 }}>
                              <ChartWrapper type="donut" data={data} />
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    )
                  })}
                </Collapse.Panel>
              </Collapse>
            )
          })}
        {keywords && (
          <>
            <Typography.Title level={3}>Review Word Frequency</Typography.Title>
            <div style={{ height: 400, width: 400 }}>
              <ChartWrapper type="wordcloud" data={keywords} />
            </div>
          </>
        )}
      </Form>
    </>
  )
}

export default StudentReport
