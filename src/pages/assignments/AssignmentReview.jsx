import { useEffect, useState } from 'react'
import { Row, Col, Button, Alert, Form, Typography, message, Input, notification } from 'antd'
import { useParams, useNavigate, useLocation } from 'react-router'
import Spinner from '../../components/Spinner'
import Section from '../survey/Section'
import { useDispatch, useSelector } from 'react-redux'
import { getArtifactReview, saveArtifactReview } from '../../api/artifactReview'
import { getArtifact } from '../../api/artifacts'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { useForm } from 'antd/es/form/Form'
import { setSurvey, setProgress } from '../../store/survey/surveySlice'
import surveySelector from '../../store/survey/selectors'
import userSelector from '../../store/user/selectors'
import { setUser } from '../../store/user/userSlice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { addCoursePoints } from '../../store/courses/coursesSlice'
import { getSentimentEmoji } from '../survey/sentiment'
import coursesSelector from '../../store/courses/selectors'
import RespondToFeedbackRequestModal from '../../components/RespondToFeedbackRequestModal'
import { gamified_mode } from '../../gamified'

const AssignmentReview = () => {
  const { state = null } = useLocation()
  const { course_id, assignment_id, review_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(
    ({ course_number }) => parseInt(course_number) === parseInt(course_id)
  )
  const user = useSelector(userSelector)
  const [messageApi, contextHolder] = message.useMessage()
  const [_, notificationContextHolder] = notification.useNotification()
  const [spin, setSpin] = useState(false)
  const [form] = useForm()
  const [artifact, setArtifact] = useState()
  const dispatch = useDispatch()
  const survey = useSelector(surveySelector)
  const progress = survey.progress
  const [respondToRequestFeedbackData, setRespondToRequestFeedbackData] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    if (state && survey.sections.length) {
      const { section, question } = state
      let sectionIdx, questionIdx
      for (let i = 0; i < survey.sections.length; i++) {
        const s = survey.sections[i]
        if (s.pk === section) {
          sectionIdx = i
          for (let j = 0; j < s.questions.length; j++) {
            const q = s.questions[j]
            if (q.pk === question) {
              questionIdx = j
              break
            }
          }
          break
        }
      }
      const name = `${sectionIdx}-${questionIdx}`
      const questionElement = document.getElementById(name)
      if (questionElement) questionElement.scrollIntoView(true)
      setTimeout(() => setRespondToRequestFeedbackData({ ...state, artifact }), 1000)
    }
  }, [state, survey.sections])

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
              course_id: course.pk,
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
            if (question_type === 'MULTIPLETEXT' || question_type === 'MULTIPLESELECT') {
              answer.forEach((a) => review.push({ question_pk: q.pk, answer_text: a.text || '' }))
            } else if (question_type === 'SLIDEREVIEW') {
              for (const a of answer) {
                review.push({
                  question_pk: q.pk,
                  answer_text: a.text.length ? a.text : '',
                  page: a.page
                })
              }
            } else {
              review.push({
                question_pk: q.pk,
                answer_text: answer.length ? answer[0].text : ''
              })
            }
          })
        })

        const res = await saveArtifactReview({
          course_id: course.pk,
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


  return (
    <>
      {contextHolder}
      {notificationContextHolder}
      {spin ? (
        <Spinner show={spin} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Form form={form} className="m-5 w-75">
            {respondToRequestFeedbackData ? (
              <RespondToFeedbackRequestModal
                data={respondToRequestFeedbackData}
                setData={setRespondToRequestFeedbackData}
              />
            ) : null}
            <div
              style={{
                position: 'fixed',
                bottom: 50,
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
                {gamified_mode() && survey.sentiment ? (
                  <div
                    style={{
                      position: 'fixed',
                      bottom: 35,
                      right: 10,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
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
                <div style={{ position: 'fixed', right: 10, bottom: 10 }}>
                  <Button type="primary" onClick={handleSaveReview}>
                    Submit Review
                  </Button>
                </div>
              </>
            }
          </Form>
        </DndProvider>
      )}
    </>
  )
}

export default AssignmentReview
