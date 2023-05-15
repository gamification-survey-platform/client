import { useEffect, useState } from 'react'
import { Row, Col, Button, Alert, Form, Typography, message } from 'antd'
import { useParams, useNavigate } from 'react-router'
import Spinner from '../../components/Spinner'
import Section from '../survey/Section'
import { useDispatch, useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import {
  getArtifactReview,
  saveArtifactReview,
  submitArtifactReviewExp
} from '../../api/artifactReview'
import { getArtifact } from '../../api/artifacts'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { useForm } from 'antd/es/form/Form'
import { surveySelector, setSurvey } from '../../store/survey/surveySlice'
import userSelector from '../../store/user/selectors'
import { setUser } from '../../store/user/userSlice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { addCoursePoints } from '../../store/courses/coursesSlice'

const AssignmentReview = () => {
  const { course_id, assignment_id, review_id } = useParams()
  const [progressData, setProgressData] = useState({ startPct: 0, endPct: 0 })
  const user = useSelector(userSelector)
  const [messageApi, contextHolder] = message.useMessage()
  const [spin, setSpin] = useState(false)
  const [form] = useForm()
  const [artifact, setArtifact] = useState()
  const dispatch = useDispatch()
  const courses = useSelector(coursesSelector)
  const survey = useSelector(surveySelector)

  const navigate = useNavigate()

  useEffect(() => {
    console.log('fetch review')
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
        console.log(e)
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
    setProgressData({
      startPct: progressData.endPct,
      endPct: filledFields.length / allFieldsLength
    })
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

  const setProgress = () => {
    const numberOfQuestions = survey.sections.reduce(
      (prev, section) => prev + section.questions.length,
      0
    )
    const filledFields = survey.sections.reduce((prev, section) => {
      const questionsAnswered = section.questions.reduce(
        (prev, question) => (question.answer.length ? prev + 1 : prev),
        0
      )
      return prev + questionsAnswered
    }, 0)
    setProgressData({
      startPct: progressData.endPct,
      endPct: filledFields / numberOfQuestions
    })
  }

  return (
    <>
      {contextHolder}
      {spin ? (
        <Spinner show={spin} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Form form={form} className="m-5 w-75" onFieldsChange={setProgress}>
            <div
              style={{
                position: 'fixed',
                top: '10%',
                right: 0,
                zIndex: 1,
                width: 300,
                height: 300
              }}>
              <ChartWrapper type="progressBar" data={progressData} />
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
                <div className="fixed-bottom" style={{ left: '90%', bottom: '5%' }}>
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
