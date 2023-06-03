import { useEffect, useState } from 'react'
import { Row, Col, Button, Alert, Form, Typography, message, Input, notification } from 'antd'
import { useParams, useNavigate } from 'react-router'
import Spinner from '../../components/Spinner'
import Section from '../survey/Section'
import { useDispatch, useSelector } from 'react-redux'
import { getArtifactReview, saveArtifactReview, submitTriviaAnswer } from '../../api/artifactReview'
import { getArtifact } from '../../api/artifacts'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { useForm } from 'antd/es/form/Form'
import { surveySelector, setSurvey, setProgress } from '../../store/survey/surveySlice'
import userSelector from '../../store/user/selectors'
import { setUser } from '../../store/user/userSlice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { addCoursePoints } from '../../store/courses/coursesSlice'
import { getSentimentEmoji } from '../survey/sentiment'

const AssignmentReview = () => {
  const { course_id, assignment_id, review_id } = useParams()
  const user = useSelector(userSelector)
  const [messageApi, contextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [spin, setSpin] = useState(false)
  const [form] = useForm()
  const [triviaForm] = useForm()
  const [artifact, setArtifact] = useState()
  const dispatch = useDispatch()
  const survey = useSelector(surveySelector)
  const progress = survey.progress
  const [triviaProgress, setTriviaProgress] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    if (survey.trivia) {
      const { hints } = survey.trivia
      const hintsToShow = hints.length ? Math.floor(progress.endPct * hints.length) : 0
      for (let i = triviaProgress; i <= hintsToShow; i++) {
        if (i === 0) {
          notification.open({
            message: 'This survey has a trivia question!',
            description: 'Answer at the bottom of the survey for more experience points',
            key: i
          })
        } else {
          notification.open({
            message: `Hint ${i}`,
            description: hints[i - 1],
            key: i
          })
        }
      }
      setTriviaProgress(hintsToShow + 1)
    }
  }, [progress])

  useEffect(() => {
    const fetchReview = async () => {
      setSpin(true)
      try {
        const res = await getArtifactReview({
          course_id,
          assignment_id: assignment_id,
          review_id
        })
        if (res.status === 200) {
          dispatch(setSurvey({ ...res.data, instructorView: false }))
          const { artifact_pk } = res.data
          if (artifact_pk) {
            const artifactRes = await getArtifact({
              course_id,
              assignment_id: assignment_id,
              artifact_pk
            })
            if (artifactRes.status === 200) {
              setArtifact(artifactRes.data)
            }
          }
        }
      } catch (e) {
        messageApi.open({ type: 'error', content: `Failed to fetch review. ${e.message}` })
      }
      setSpin(false)
    }
    fetchReview()
  }, [])

  useEffect(() => {
    const filledFields = Object.values(form.getFieldsValue()).filter(
      (v) => v !== undefined && v.length
    )
    const allFields = Object.values(form.getFieldsValue())
    const allFieldsLength = allFields.length > 0 ? allFields.length : 1
    dispatch(
      setProgress({
        startPct: progress.endPct,
        endPct: filledFields.length / allFieldsLength
      })
    )
  }, [])

  const handleSaveReview = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (form.validateFields()) {
      try {
        const review = []
        survey.sections.forEach((s) => {
          s.questions.forEach((q) => {
            const { question_type, answer } = q
            if (
              question_type === 'SLIDEREVIEW' ||
              question_type === 'MULTIPLETEXT' ||
              question_type === 'MULTIPLESELECT'
            )
              answer.forEach((a) => review.push({ question_pk: q.pk, answer_text: a.text || '' }))
            else {
              review.push({
                question_pk: q.pk,
                answer_text: answer.length ? answer[0].text : ''
              })
            }
          })
        })
        const res = await saveArtifactReview({
          course_id,
          assignment_id: assignment_id,
          review_id,
          review
        })
        if (res.status === 200) {
          const { exp, level, next_exp_level, points } = res.data
          dispatch(setUser({ ...user, exp, level, next_exp_level }))
          dispatch(addCoursePoints({ course_id, points }))
          navigate(-1)
        }
      } catch (e) {
        console.error(e)
        messageApi.open({ type: 'error', content: e.message })
      }
    }
  }

  const handleTriviaSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      triviaForm.validateFields()
      const answer = triviaForm.getFieldValue('answer')
      const res = await submitTriviaAnswer({ course_id, assignment_id, review_id, answer })
      if (res.status === 201) messageApi.open({ type: 'success', content: res.data.message })
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: e.message })
    }
  }

  return (
    <>
      {contextHolder}
      {notificationContextHolder}
      {spin ? (
        <Spinner show={spin} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Form form={form} className="m-5 w-75">
            <div
              style={{
                position: 'fixed',
                top: '10%',
                right: 0,
                zIndex: 1,
                width: 300,
                height: 300
              }}>
              <ChartWrapper type="progressBar" data={progress} />
            </div>
            <Row justify="space-between">
              <Col span={14}>
                <div>
                  <Typography.Title level={2}>{survey.name}</Typography.Title>
                  <Typography.Title level={4}>{survey.instructions}</Typography.Title>
                  <Typography.Title level={4}>{survey.other_info}</Typography.Title>
                </div>
              </Col>
            </Row>
            {
              <>
                {survey.sections.map((_, i) => (
                  <Section key={i} sectionIdx={i} artifact={artifact} />
                ))}
                {survey.sentiment ? (
                  <div
                    className="fixed-bottom mr-3"
                    style={{ bottom: '10%', left: '85%', display: 'flex', alignItems: 'center' }}>
                    <Typography.Title level={5} className="mr-3">
                      Survey sentiment:
                    </Typography.Title>
                    <h1
                      dangerouslySetInnerHTML={{
                        __html: `${getSentimentEmoji(survey.sentiment)}`
                      }}
                    />
                  </div>
                ) : null}
                <div className="fixed-bottom" style={{ left: '90%', bottom: '5%' }}>
                  <Button type="primary" onClick={handleSaveReview}>
                    Submit Review
                  </Button>
                </div>
              </>
            }
          </Form>
          {survey.trivia ? (
            <Form form={triviaForm} className="m-5 w-75" style={{ marginBottom: '100!important' }}>
              <Typography.Title level={4}>
                Trivia Question: {survey.trivia.question}
              </Typography.Title>
              <Form.Item
                label="Enter your answer to the trivia here:"
                name="answer"
                rules={[{ required: true, message: 'Please input a valid answer.' }]}>
                <Input />
              </Form.Item>
              <Row justify="center">
                <Form.Item>
                  <Button onClick={handleTriviaSubmit}>Submit Trivia Answer</Button>
                </Form.Item>
              </Row>
            </Form>
          ) : null}
        </DndProvider>
      )}
    </>
  )
}

export default AssignmentReview
