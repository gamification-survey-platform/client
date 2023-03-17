import { useEffect, useState } from 'react'
import { Row, Col, Button, Alert, Form, Typography } from 'antd'
import { useParams, useNavigate } from 'react-router'
import Spinner from '../../components/Spinner'
import Section from '../survey/Section'
import { useDispatch, useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import { getArtifactReview, saveArtifactReview } from '../../api/artifactReview'
import { getArtifact } from '../../api/artifacts'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { useForm } from 'antd/es/form/Form'
import { surveySelector, setSurvey } from '../../store/survey/surveySlice'

const AssignmentReview = () => {
  const { course_id, assignment_id, review_id } = useParams()
  const [progressData, setProgressData] = useState({ startPct: 0, endPct: 0 })
  const [spin, setSpin] = useState(false)
  const [form] = useForm()
  const [artifact, setArtifact] = useState()
  const dispatch = useDispatch()
  const courses = useSelector(coursesSelector)
  const survey = useSelector(surveySelector)

  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [message, setMessage] = useState()

  useEffect(() => {
    const fetchReview = async () => {
      setSpin(true)
      try {
        const res = await getArtifactReview({
          course_id: selectedCourse.pk,
          assignment_id: assignment_id,
          review_id
        })
        if (res.status === 200) {
          const { artifact_pk } = res.data
          if (artifact_pk) {
            const artifactRes = await getArtifact({
              course_id: selectedCourse.pk,
              assignment_id: assignment_id,
              artifact_pk
            })
            if (artifactRes.status === 200) {
              setArtifact(artifactRes.data)
              dispatch(setSurvey(res.data))
            }
          } else {
            setSurvey(res.data)
          }
        }
      } catch (e) {
        setMessage({ type: 'error', message: 'Failed to fetch survey.' })
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
            if (question_type === 'SLIDEREVIEW' || question_type === 'MULTIPLETEXT')
              answer.forEach((a) => review.push({ question_pk: q.pk, answer_text: a.text || '' }))
            else review.push({ question_pk: q.pk, answer_text: answer[0].text || '' })
          })
        })
        const res = await saveArtifactReview({
          course_id: selectedCourse.pk,
          assignment_id: assignment_id,
          review_id,
          review
        })
        if (res.status === 200) navigate(-1)
      } catch (e) {
        setMessage({ type: 'error', message: 'Failed to save survey.' })
      }
    }
  }

  const setProgress = (changedFields, allFields) => {
    const filledFields = Object.values(form.getFieldsValue()).filter(
      (v) => v !== undefined && v.length
    )
    setProgressData({
      startPct: progressData.endPct,
      endPct: filledFields.length / allFields.length
    })
  }

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <Form form={form} className="m-5" onFieldsChange={setProgress}>
      <div style={{ position: 'fixed', top: '10%', right: 0, zIndex: 1, width: 300, height: 300 }}>
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
          {survey.sections.map((section, i) => (
            <Section key={i} pk={section.pk} studentView={true} artifact={artifact} />
          ))}
          <div className="text-center">
            <Button type="primary" onClick={handleSaveReview}>
              Submit Review
            </Button>
            {message && <Alert className="mt-5" {...message} />}
          </div>
        </>
      }
    </Form>
  )
}

export default AssignmentReview
