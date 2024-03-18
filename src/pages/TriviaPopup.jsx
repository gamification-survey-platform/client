import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message } from 'antd'
import { getCourseTrivia} from '../api/trivia'

const TriviaPopup = ({ courseId, courses }) => {
    const courseNumber = courseId;
    const [visible, setVisible] = useState(false)
    const [trivia, setTrivia] = useState({
        question: '',
        answer: '',
        hints: []
    })
    const [userAnswer, setUserAnswer] = useState('');
    const [messageApi, contextHolder] = message.useMessage()
    const selectedCourse = courses.find(course => course.course_number === courseNumber);

    useEffect(() => {
        const fetchTrivia = async () => {
            if (selectedCourse && selectedCourse.pk) {
                try {
                    const res = await getCourseTrivia(selectedCourse.pk);
                    if (res && res.question) {
                        setTrivia(res);
                    } else {
                        messageApi.open({ content: 'Failed to fetch trivia.', type: 'error' });
                    }
                } catch (error) {
                    messageApi.open({ content: error.message, type: 'error' });
                }
            }
        };
        fetchTrivia();
    }, [selectedCourse, messageApi]);
    const handleAnswerSubmit = () => {
        if (trivia.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
            messageApi.open({ type: 'success', content: 'Correct answer! 🎉' });
            handleClose();
        } else {
            messageApi.open({ type: 'error', content: 'Wrong answer. Try again!' });
            setUserAnswer('');
        }
    };

    const showModal = () => setVisible(true);
    const handleClose = () => {
        setVisible(false);
        setUserAnswer('');
    };

    return (
        <>
            <Button type="link" onClick={showModal} style={{ marginTop: -10 }}>🚀 Trivia</Button>
            <Modal
                title="Trivia Time!"
                visible={visible}
                onCancel={handleClose}
                footer={[
                    <Button key="submit" type="primary" onClick={handleAnswerSubmit}>
                        Submit Answer
                    </Button>,
                ]}
            >
                <div className="trivia-content">
                    <p>{trivia.question}</p>
                    {trivia.hints.map((hint, index) => (
                        <p key={index}>Hint: {hint}</p>
                    ))}
                    <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here"
                        onPressEnter={handleAnswerSubmit}
                    />
                </div>
            </Modal>
            {contextHolder}
        </>
    );
};

export default TriviaPopup;
