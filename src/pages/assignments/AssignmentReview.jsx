import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Button,
  Alert,
  Form,
  Typography,
  message,
  Input,
  notification,
  Tooltip,
  Modal
} from 'antd'
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
import coursesSelector from '../../store/courses/selectors'
import RespondToFeedbackRequestModal from '../../components/RespondToFeedbackRequestModal'
import Lottie from 'react-lottie'
import coin from '../../assets/coin.json'
import { postGPT } from '../../api/gpt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Bonus from '../../assets/bonus.png'

import fivePoints from '../../assets/5points.png'
import { gamified_mode } from '../../gamified'

const AssignmentReview = () => {
  const { state = null } = useLocation()
  const { course_id, assignment_id, review_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(
    ({ course_number }) => parseInt(course_number) === parseInt(course_id)
  )
  const user = useSelector(userSelector)
  const isGamified = gamified_mode(user)
  const [messageApi, contextHolder] = message.useMessage()
  const [_, notificationContextHolder] = notification.useNotification()
  const [spin, setSpin] = useState(false)
  const [form] = useForm()
  const [artifact, setArtifact] = useState()
  const dispatch = useDispatch()
  const survey = useSelector(surveySelector)
  const progress = survey.progress
  const [respondToRequestFeedbackData, setRespondToRequestFeedbackData] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [isIconHovered, setIsIconHovered] = useState(false)

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

  const coinOption = {
    loop: true,
    autoplay: true,
    animationData: coin,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [feedbackData, setFeedbackData] = useState([])
  const [hasUsedGPTFeedback, setHasUsedGPTFeedback] = useState(false)
  const [hasGotGPTPoint, setHasGotGPTPoint] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [gptScore, setGptScore] = useState(-1)
  const [isLowScoreReminder, setIsLowScoreReminder] = useState(false)

  const getGPTScoreAndFeedback = async (e, showFeedback) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    if (form.validateFields()) {
      try {
        let questionData = []
        const question_ids = []
        const answers = []
        survey.sections.forEach((s) => {
          s.questions.forEach((q) => {
            const { question_type, answer, use_genai_assistant } = q
            if (question_type === 'TEXTAREA' && use_genai_assistant) {
              question_ids.push(q.pk)
              questionData.push({ id: q.pk, text: q.text })
              answer.forEach((a) => answers.push(a.text))
            }
          })
        })
        if (answers.length === 0) {
          setLoading(false)
          setAlertVisible(true)
          return
        }

        const res = await postGPT({
          question_ids,
          answers,
          artifact_review_id: review_id
        })
        if (res.status === 200) {
          const { score, feedback_array, got_gpt_point } = res.data
          if (showFeedback) {
            setFeedbackVisible(true)
          }
          setFeedbackData(
            questionData.map((q, idx) => ({
              question: q.text,
              feedback: res.data.feedback_array[idx]
            }))
          )
          setHasUsedGPTFeedback(true)
          setHasGotGPTPoint(got_gpt_point)
          setGptScore(score)
        }
      } catch (e) {
        console.error(e)
        messageApi.open({ type: 'error', content: e.message })
      }
      setLoading(false)
    }
  }

  const handleSaveReview = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    var hasOpenendedQuestions = false
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
              if (q.question_type === 'TEXTAREA') {
                hasOpenendedQuestions = true
              }
              review.push({
                question_pk: q.pk,
                answer_text: answer.length ? answer[0].text : ''
              })
            }
          })
        })

        const bonus = localStorage.getItem('bonus')
        const res = await saveArtifactReview({
          course_id: course.pk,
          assignment_id: assignment_id,
          review_id,
          review,
          bonus: bonus === undefined ? 'No Bonus' : bonus
        })
        if (res.status === 200) {
          const { exp, level, next_exp_level, points } = res.data
          dispatch(setUser({ ...user, exp, level, next_exp_level }))
          dispatch(addCoursePoints({ course_id, points }))
          if (hasOpenendedQuestions) {
            await getGPTScoreAndFeedback(e, false)
            if (gptScore >= 0 && gptScore < 6) {
              setIsLowScoreReminder(true)
              setAlertVisible(true)
            } else {
              navigate(-1)
            }
          } else {
            navigate(-1)
          }
        }
      } catch (e) {
        console.error(e)
        messageApi.open({ type: 'error', content: e.message })
      }
    }
  }

  const handleCancel = () => {
    setAlertVisible(false)
    if (isLowScoreReminder) {
      navigate(-1)
    }
  }

  return (
    <>
      {contextHolder}
      {notificationContextHolder}
      <div
        style={{
          position: 'fixed',
          zIndex: 1050,
          width: '100%',
          height: '100%',
          display: loading ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Spinner show={loading} />
      </div>
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
                <div style={{ position: 'fixed', right: 10, top: 80 }}>
                  {localStorage.getItem('bonus') === '0 Points' ||
                  localStorage.getItem('bonus') === null ? null : (
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>
                        <Lottie options={coinOption} width={70} height={70} />
                      </span>
                      <strong
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          color: 'gold',
                          fontSize: '25px'
                        }}>{`${localStorage.getItem('bonus')}`}</strong>
                    </div>
                  )}
                </div>
                <div style={{ position: 'fixed', right: 150, bottom: 10 }}>
                  {isGamified && !hasUsedGPTFeedback && (
                    <Tooltip
                      title={
                        <span>
                          Get 5 points when you use the robot Pepper for the first time on this
                          assignment!
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            style={{ fontSize: '16px', marginLeft: '5px' }}
                          />
                          <FontAwesomeIcon
                            icon={faRobot}
                            style={{ fontSize: '16px', marginLeft: '5px' }}
                          />
                        </span>
                      }>
                      <img
                        src={fivePoints}
                        alt="5 Points Reward"
                        style={{
                          width: '60px',
                          height: '60px',
                          cursor: 'pointer',
                          position: 'absolute',
                          top: '25px',
                          right: '150px'
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="I am robot Pepper, here to assist with the quality of feedback. Click for insights.">
                    <Button
                      onClick={(e) => getGPTScoreAndFeedback(e, true)}
                      onMouseEnter={() => setIsIconHovered(true)}
                      onMouseLeave={() => setIsIconHovered(false)}
                      style={{ border: 'none', background: 'transparent' }}>
                      <FontAwesomeIcon
                        icon={faRobot}
                        style={{
                          fontSize: '86px',
                          color: isIconHovered ? '#30D5C8' : '#333333'
                        }}
                      />
                    </Button>
                  </Tooltip>
                </div>
                <div style={{ position: 'fixed', right: 15, bottom: 10 }}>
                  <Tooltip
                    title={
                      !hasUsedGPTFeedback ? (
                        <span>
                          Consider using the robot Pepper for better insights before submitting!
                          <FontAwesomeIcon
                            icon={faRobot}
                            style={{ fontSize: '16px', marginLeft: '5px' }}
                          />
                          <FontAwesomeIcon icon={faArrowLeft} style={{ marginLeft: '5px' }} />
                        </span>
                      ) : (
                        ''
                      )
                    }>
                    <Button type="primary" onClick={handleSaveReview}>
                      Submit Review
                    </Button>
                  </Tooltip>
                </div>
              </>
            }
          </Form>
        </DndProvider>
      )}
      <Modal
        open={alertVisible}
        onOk={() => setAlertVisible(false)}
        onCancel={handleCancel}
        footer={null}>
        <Alert
          message={isLowScoreReminder ? 'Reminder' : 'Alert'}
          description={
            isLowScoreReminder
              ? 'The open-ended feedback provided could be significantly improved. Next time use the feedback assistant to do better :)'
              : 'Please only use the feedback assistant if there are open ended questions'
          }
          type="warning"
          showIcon
        />
      </Modal>
      <Modal
        title="Robot Pepper's Feedback"
        visible={feedbackVisible}
        onOk={() => setFeedbackVisible(false)}
        onCancel={() => setFeedbackVisible(false)}
        footer={null}>
        {hasGotGPTPoint ? (
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <img src={Bonus} alt="Bonus Icon" width={50} />
            <p>+5 points for using the feedback assistant for the first time!</p>
          </div>
        ) : null}
        {feedbackData.map((item, index) => (
          <Alert
            key={index}
            message={`Feedback for your answer to "${item.question}"`}
            description={item.feedback}
            type="info"
            showIcon
            style={{ marginBottom: '10px' }}
          />
        ))}
      </Modal>
    </>
  )
}

export default AssignmentReview
