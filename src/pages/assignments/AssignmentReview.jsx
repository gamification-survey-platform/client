import { useEffect, useState } from 'react'
import { Row, Col, Button, Alert, Form, Typography } from 'antd'
import { useParams, useNavigate } from 'react-router'
import Spinner from '../../components/Spinner'
import Section from '../survey/Section'
import { useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import { getArtifactReview, saveArtifactReview } from '../../api/artifactReview'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { useForm } from 'antd/es/form/Form'

const AssignmentReview = () => {
  const [survey, setSurvey] = useState({
    pk: -1,
    name: '',
    instructions: '',
    other_info: '',
    sections: []
  })
  const { course_id, assignment_id, review_id } = useParams()
  const [progressData, setProgressData] = useState({ startPct: 0, endPct: 0 })
  const [spin, setSpin] = useState(false)
  const [form] = useForm()
  const courses = useSelector(coursesSelector)
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
          setSurvey(res.data)
        }
      } catch (e) {
        setMessage({ type: 'error', message: 'Failed to save survey.' })
      }
      setSpin(false)
    }
    fetchReview()
  }, [])

  useEffect(() => {
    const filledFields = Object.values(form.getFieldsValue()).filter(
      (v) => v !== undefined && v.length
    )
    setProgressData({
      startPct: 0,
      endPct: filledFields.length / Object.values(form.getFieldsValue()).length
    })
  }, [survey])

  const handleSaveReview = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (form.validateFields()) {
      try {
        const fields = form.getFieldsValue()
        const review = Object.keys(fields).map((q_pk, i) => {
          let question_pk = q_pk
          let answer_text = form.getFieldValue(`${question_pk}`) || ''
          if (question_pk.indexOf('-') > 0) {
            question_pk = question_pk.split('-')[0]
          }
          return { question_pk, answer_text }
        })
        const res = await saveArtifactReview({
          course_id: selectedCourse.pk,
          assignment_id: assignment_id,
          review_id,
          review: review
        })
        if (res.status === 200) navigate(-1)
      } catch (e) {
        setMessage({ type: 'error', message: 'Failed to save survey.' })
      }
    }
  }

  const setProgress = (_, allFields) => {
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
          {survey && (
            <div>
              <Typography.Title level={2}>{survey.name}</Typography.Title>
              <Typography.Title level={4}>{survey.instructions}</Typography.Title>
              <Typography.Title level={4}>{survey.other_info}</Typography.Title>
            </div>
          )}
        </Col>
      </Row>
      {survey && survey.sections && (
        <>
          {survey.sections.map((section, i) => (
            <Section
              key={i}
              section={section}
              sectionIdx={i}
              survey={survey}
              setSurvey={setSurvey}
              studentView={true}
            />
          ))}
          <div className="text-center">
            <Button onClick={handleSaveReview}>Save Survey</Button>
            {message && <Alert className="mt-5" {...message} />}
          </div>
        </>
      )}
    </Form>
  )
}

export default AssignmentReview
