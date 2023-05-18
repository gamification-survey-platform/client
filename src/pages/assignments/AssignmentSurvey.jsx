import { useEffect, useState, useRef, useCallback } from 'react'
import { Row, Col, Button, Alert, Form, Typography, Divider, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useParams, useNavigate } from 'react-router'
import AddSectionModal from '../survey/AddSectionModal'
import Section from '../survey/Section'
import { getSurveyDetails, saveSurvey } from '../../api/survey'
import { useDispatch, useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import Spinner from '../../components/Spinner'
import {
  changeView,
  reorderSections,
  setSurvey,
  surveySelector
} from '../../store/survey/surveySlice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const AssignmentSurvey = () => {
  const survey = useSelector(surveySelector)
  const dispatch = useDispatch()
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
          dispatch(setSurvey({ ...res.data, instructorView: true }))
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

  const handleReorderSections = useCallback(
    (dragIndex, hoverIndex) => {
      dispatch(reorderSections({ i: dragIndex, j: hoverIndex }))
    },
    [survey.sections]
  )

  const handleEditSurvey = () => {
    navigate(`add`, { state: { editingSurvey: survey } })
  }

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <DndProvider backend={HTML5Backend}>
      <Form form={form} className="m-5">
        {contextHolder}
        <Row justify="space-between">
          <Col span={14}>
            {survey && (
              <div>
                <Typography.Title level={2}>{survey.name}</Typography.Title>
                <Typography.Title level={4}>{survey.instructions}</Typography.Title>
                <Typography.Title level={4}>{survey.other_info}</Typography.Title>
                {survey.instructorView ? (
                  <>
                    <Typography.Text>
                      Drag and Drop sections or questions to reorder elements
                    </Typography.Text>
                    <Typography.Text>
                      Please organize your questions into designated questions to ensure
                      intrasection answer consistency.
                    </Typography.Text>
                  </>
                ) : null}
              </div>
            )}
          </Col>
          <Col span={10}>
            <Row>
              <Button danger onClick={handleEditSurvey}>
                Edit or Modify Survey Template
              </Button>
            </Row>
            <Row>
              <Button className="my-3" onClick={() => dispatch(changeView())}>
                {survey.instructorView ? 'Student View' : 'Instructor View'}
              </Button>
              <Button type="primary" className="ml-3 my-3" onClick={() => setModalOpen(true)}>
                Add Section
              </Button>
            </Row>
          </Col>
          <AddSectionModal open={modalOpen} setOpen={setModalOpen} />
        </Row>
        <Divider />
        {survey.sections.length && (
          <div>
            {survey.sections.map((_, i) => (
              <Section key={i} sectionIdx={i} handleReorderSections={handleReorderSections} />
            ))}
            <div className="fixed-bottom" style={{ left: '90%', bottom: '5%' }}>
              <Button type="primary" onClick={handleSaveSurvey} style={{ position: 'absolute' }}>
                Save Survey
              </Button>
            </div>
          </div>
        )}
      </Form>
    </DndProvider>
  )
}

export default AssignmentSurvey
