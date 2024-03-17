import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message } from 'antd'
import { getCourseTrivia, submitTriviaAnswer } from '../api/trivia'
import { style } from 'd3'
import { useParams } from 'react-router'
import userSelector from '../store/user/selectors'
import { useSelector } from 'react-redux'
import coursesSelector from '../store/courses/selectors'
import { addCoursePoints } from '../store/courses/coursesSlice'
import { setUser } from '../store/user/userSlice'
import { useDispatch } from 'react-redux'


const TriviaPopup = () => {
    const { course_id, trivia_id } = useParams()
    const user = useSelector(userSelector)
    const courses = useSelector(coursesSelector)
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    const [trivia, setTrivia] = useState({
        question: '',
        answer: ''
    
    });
    const [answer, setAnswer] = useState()
    const [messageApi, contextHolder] = message.useMessage()
    const selectedCourse = courses.find((course) => course.course_number === course_id)
    useEffect(() => {
        const fetchTrivia = async () => {
            const res = await getCourseTrivia(selectedCourse.pk);
            if (res.status === 200) {
                setTrivia(res.data);
            } else {
                messageApi.open({ content: 'Failed to fetch trivia.', type: 'error' });
            }
        };
        if (selectedCourse) fetchTrivia();
    }, [selectedCourse]);
    

    const showModal = () => setVisible(true);
    const handleClose = () => setVisible(false);

    const handleAnswerSubmit = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const handleAnswerSubmit = async () => {
                const res = await submitTriviaAnswer({course_id: selectedCourse.pk, trivia_id, answer})
                messageApi.open({ type:'success', content: 'You got it right!' })
                if (res.status === 201) {
                    const {exp, points} = res.data
                    dispatch(setUser({...user, exp}))
                    dispatch(addCoursePoints({course_id: selectedCourse.pk, points}))
                }
                setAnswer()
                setVisible(false)
            }
            handleAnswerSubmit();
        } catch (e) {
            console.error(e)
            messageApi.open({ type:'error', content: e.message })
            setAnswer()
        }
  };

  return (
    <>
    <Button type="link" onClick={showModal} style={{ marginTop: -10 }}>🚀 Trivia</Button>
      <Modal
        title="Trivia Time!"
        visible={visible}
        onOk={handleAnswerSubmit}
        onCancel={handleClose}
        footer={[
          <Button key="submit" type="primary" onClick={handleAnswerSubmit}>
            Submit Answer
          </Button>,
        ]}
      >
        {trivia ? (
          <>
            <p>{trivia.question}</p>
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here"
            />
          </>
        ) : (
          <p>No trivia available for this course.</p>
        )}
      </Modal>
    </>
  );
};

export default TriviaPopup