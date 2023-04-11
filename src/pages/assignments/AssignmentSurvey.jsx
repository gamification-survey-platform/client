import { useEffect, useState, useRef } from 'react'
import { Row, Col, Button, Alert, Form, Typography, Divider, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useParams, useNavigate } from 'react-router'
import AddSectionModal from '../survey/AddSectionModal'
import Section from '../survey/Section'
import { getSurveyDetails, saveSurvey } from '../../api/survey'
import { useDispatch, useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import Spinner from '../../components/Spinner'
import { setSurvey, surveySelector } from '../../store/survey/surveySlice'

const AssignmentSurvey = () => {
  const survey = useSelector(surveySelector)
  const dispatch = useDispatch()
  const [studentView, setStudentView] = useState(false)
  const { course_id, assignment_id } = useParams()
  const courses = useSelector(coursesSelector)
  const [spin, setSpin] = useState(false)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = useForm()

  useEffect(() => {
    const fetchSurvey = async () => {
      setSpin(true)
      try {
        const res = await getSurveyDetails({
          course_id: selectedCourse.pk,
          assignment_id
        })
        if (res.status === 200) {
          dispatch(setSurvey(res.data))
        }
      } catch (e) {
        messageApi.open({ type: 'error', content: 'Failed to save survey' })
      }
      setSpin(false)
    }
    fetchSurvey()
  }, [])

  const handleSaveSurvey = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await saveSurvey({
        course_id: selectedCourse.pk,
        assignment_id,
        survey
      })
      if (res.status === 200) navigate(-1)
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: 'Failed to save survey.' })
    }
  }

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <Form form={form} className="m-5">
      {contextHolder}
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
        <Col span={10}>
          <Button className="m-3" onClick={() => setStudentView(!studentView)}>
            {studentView ? 'Instructor View' : 'Student View'}
          </Button>
          <Button type="primary" className="m-3" onClick={() => setModalOpen(true)}>
            Add Section
          </Button>
        </Col>
        <AddSectionModal open={modalOpen} setOpen={setModalOpen} />
      </Row>
      <Divider />
      {survey.sections.length && (
        <div>
          {survey.sections.map((section, i) => (
            <Section key={i} pk={section.pk} />
          ))}
          <div className="fixed-bottom" style={{ left: '90%', bottom: '5%' }}>
            <Button type="primary" onClick={handleSaveSurvey} style={{ position: 'absolute' }}>
              Save Survey
            </Button>
          </div>
        </div>
      )}
    </Form>
  )
}

export default AssignmentSurvey
