import { useEffect, useState } from 'react'
import { Typography, Divider, Button, Row, Col, Alert, Form, message, Input, notification } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { useForm } from 'antd/es/form/Form'
import { submitTriviaAnswer } from '../../api/trivia'
import { setUser } from '../../store/user/userSlice'
import { addCoursePoints } from '../../store/courses/coursesSlice'

const CourseDetails = () => {
  const { course_id } = useParams()
  const dispatch = useDispatch();
  const user = useSelector(userSelector); 
  const courses = useSelector(coursesSelector)
  const [triviaForm] = useForm()
  const [triviaProgress, setTriviaProgress] = useState(0)
  const course = courses.find(({ course_number }) => course_number === course_id)
  const [progress, setProgress] = useState({ endPct: 0 });
  useEffect(() => {
    if (course.trivia && !course.trivia.completed) {
      const { hints } = course.trivia
      const hintsToShow = hints.length ? Math.floor(progress.endPct * hints.length) : 0
      for (let i = triviaProgress; i <= hintsToShow; i++) {
        if (i === 0) {
          notification.open({
            message: 'This course has a trivia question!',
            description: 'Answer at the bottom of the course for more experience points',
            key: i
          })
        } else {
          notification.open({
            message: `Trivia Hint ${i}`,
            description: hints[i - 1],
            key: i
          })
        }
      }
      setTriviaProgress(hintsToShow + 1)
    }
  }, [progress])

  const handleTriviaSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await triviaForm.validateFields()
    } catch (e) {
      console.error(e)
      return
    }
    try {
      const answer = triviaForm.getFieldValue('answer')
      const res = await submitTriviaAnswer({
        course_id: course.pk,
        answer
      })
      if (res.status === 201) {
        const { message, exp, level, next_exp_level, points } = res.data
        dispatch(setUser({ ...user, exp, level, next_exp_level }))
        dispatch(addCoursePoints({ course_id, points }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleTriviaEnter = async (e) => {
    if (course.trivia && e.keyCode === 13) {
      await handleTriviaSubmit(e)
    }
  }

  return (
    <div className="m-5 text-center" onKeyDown={handleTriviaEnter}>
      <Typography.Title level={2}>{course.course_name}</Typography.Title>
      <Typography.Title level={3}>{course.course_number}</Typography.Title>
      <Typography.Title level={4}>{course.semester}</Typography.Title>
      <Divider />
      <div className="text-left">
        <Typography.Text className="font-weight-bold">Syllabus:</Typography.Text>
        <br />
        <Typography.Text>{course.syllabus}</Typography.Text>
      </div>
      {course.trivia && !course.trivia.completed ? (
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid #d9d9d9',
                  borderRadius: '5%',
                  position: 'fixed',
                  top: 75,
                  right: 10,
                  zIndex: 1,
                  width: 250
                }}>
                <Form
                  form={triviaForm}
                  className="m-3"
                  style={{ marginBottom: '100!important' }}
                  onKeyDown={handleTriviaEnter}>
                  <div className="text-center">
                    <Typography.Text className="my-1">Trivia Question</Typography.Text>
                  </div>
                  <Typography.Text className="mb-1"> {course.trivia.question}</Typography.Text>
                  <Form.Item
                    name="answer"
                    rules={[{ required: true, message: 'Please enter a valid answer!' }]}>
                    <Input placeholder="Enter answer." />
                  </Form.Item>
                  <Row justify="center">
                    <Form.Item>
                      <Button onClick={handleTriviaSubmit}>Submit Trivia Answer</Button>
                    </Form.Item>
                  </Row>
                </Form>
              </div>
            ) : null}
    </div>
  )
}

export default CourseDetails
