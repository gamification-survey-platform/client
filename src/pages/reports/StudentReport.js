import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getArtifactAnswers, getKeywords, getStudentStatistics } from '../../api/reports'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { Row, Typography, Form, Collapse, Col } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'antd/es/form/Form'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { scaleOptions } from '../survey/question/Question'
import courseSelector from '../../store/courses/selectors'

const StudentReport = () => {
  const { course_id: course_number, assignment_id, artifact_id } = useParams()
  const courses = useSelector(courseSelector)
  const [report, setReport] = useState()
  const [statistics, setStatistics] = useState()
  const [form] = useForm()
  const dispatch = useDispatch()
  const [keywords, setKeywords] = useState()
  const course = courses.find((course) => course.course_number === course_number)

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

  return (
    <Form form={form} className="m-5 w-75" disabled={true}>
      <DndProvider backend={HTML5Backend}>
        <Typography.Title level={2} className="text-center">
          Student Report
        </Typography.Title>
        {report &&
          report.sections.map((section, i) => {
            const { title } = section
            return (
              <Collapse key={i} size="large" className="mb-3">
                <Collapse.Panel header={title}>
                  {section.questions.map((question, i) => {
                    const {
                      artifact_reviews,
                      text,
                      question_type,
                      number_of_scale = undefined,
                      option_choices = undefined
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
                        <Col span={8}>
                          <Typography.Title level={4}>{text}</Typography.Title>
                          {question_type === 'SCALEMULTIPLECHOICE' ? (
                            <Row className="ml-3">
                              <Typography.Title level={5}>
                                Options: {scaleOptions[number_of_scale].join(', ')}
                              </Typography.Title>
                            </Row>
                          ) : null}
                          {question_type === 'MULTIPLECHOICE' ||
                          question_type === 'MULTIPLESELECT' ? (
                            <Row className="ml-3">
                              <Typography.Title level={5}>
                                Options: {option_choices.map((opt) => opt.text).join(', ')}
                              </Typography.Title>
                            </Row>
                          ) : null}
                          <Row className="ml-3">
                            <Typography.Title level={5}>Answers</Typography.Title>
                          </Row>
                          {artifact_reviews.map((review, i) => {
                            return (
                              <Row key={i} className="ml-5">
                                {review.map((r, i) => r.text).join(', ')}
                              </Row>
                            )
                          })}
                        </Col>
                        {data ? (
                          <Col span={16}>
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
      </DndProvider>
    </Form>
  )
}

export default StudentReport
