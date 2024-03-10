import { useEffect, useState } from 'react'
import { Typography, Divider, Button, Form, Input, notification } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { submitTriviaAnswer } from '../../api/trivia'
import { setUser } from '../../store/user/userSlice'
import { addCoursePoints } from '../../store/courses/coursesSlice'
import { useForm } from 'antd/es/form/Form'

const CourseDetails = () => {
  const { course_id } = useParams()
  const [triviaForm] = useForm()
  const [triviaProgress, setTriviaProgress] = useState(0)
  const [showTrivia, setShowTrivia] = useState(false)
  const dispatch = useDispatch()
  const courses = useSelector(coursesSelector)
  const user = useSelector(userSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)

  useEffect(() => {
    if (course && course?.trivia && !course.trivia.completed) {
      const { hints } = course.trivia;
      const hintsToShow = hints.length ? Math.floor(course.trivia.endPct * hints.length) : 0; 
      for (let i = triviaProgress; i <= hintsToShow; i++) {
        notification.open({
          message: `Trivia Hint ${i}`,
          description: hints[i - 1],
          key: i
        });
      }
      setTriviaProgress(hintsToShow + 1);
    }
  }, [course, triviaProgress]);

  const handleTriviaSubmit = async () => {
    try {
      const values = await triviaForm.validateFields();
      const res = await submitTriviaAnswer({
        course_id: course.id, 
        answer: values.answer
      });
      if (res.status === 201) {
        const { message, exp, level, next_exp_level, points } = res.data;
        notification.success({ message });
        dispatch(setUser({ ...user, exp, level, next_exp_level }));
        dispatch(addCoursePoints({ course_id: course.id, points }));
        setShowTrivia(false); // Hide trivia after successful submission
      }
    } catch (e) {
      console.error(e);
      notification.error({ message: e.message });
    }
  }

  return (
    <div className="m-5 text-center">
      <Typography.Title level={2}>{course?.course_name}</Typography.Title>
      <Typography.Title level={3}>{course?.course_number}</Typography.Title>
      <Typography.Title level={4}>{course?.semester}</Typography.Title>
      <Divider />
      <div className="text-left">
        <Typography.Text strong>Syllabus:</Typography.Text>
        <br />
        <Typography.Text>{course?.syllabus}</Typography.Text>
      </div>
      {showTrivia && course?.trivia && !course.trivia.completed && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '300px',
          zIndex: 1000,
          backgroundColor: '#f0f2f5',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ position: 'relative' }}>
            <Button style={{ position: 'absolute', top: '5px', right: '10px' }} type="text" onClick={() => setShowTrivia(false)}>
              X
            </Button>
            <Typography.Title level={5}>Trivia Time!</Typography.Title>
            <Typography.Text>{course.trivia.question}</Typography.Text>
            <Form form={triviaForm} onFinish={handleTriviaSubmit}>
              <Form.Item
                name="answer"
                rules={[{ required: true, message: 'Please enter your answer!' }]}
              >
                <Input placeholder="Enter your answer" />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Answer
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
