import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message, Card } from 'antd'
import { getCourseTrivia} from '../api/trivia'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

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
    const selectedCourse = courses.find(course => course.course_number === courseNumber)
    // Functions for handling hint navigation
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const showNextHint = () => setCurrentHintIndex((prevIndex) => Math.min(prevIndex + 1, trivia.hints.length - 1))
    const showPreviousHint = () => setCurrentHintIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    useEffect(() => {
        const fetchTrivia = async () => {
            if (selectedCourse && selectedCourse.pk) {
                try {
                    const res = await getCourseTrivia(selectedCourse.pk)
                    if (res && res.question) {
                        setTrivia(res)
                    } else {
                        setTrivia(null)
                    }
                } catch (error) {
                    console.error('Fetching trivia failed:', error)
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

    const handleClose = () => {
        setVisible(false);
        setUserAnswer('');
        setCurrentHintIndex(0);
    };

    return (
        <>
            <Button type="link" onClick={() => setVisible(true)} style={{ marginTop: -10 }}>🚀 Trivia</Button>
            <Modal
                bodyStyle={{ padding: '20px' }} 
                title={<div style={{ fontWeight: 'bold', fontSize: '24px', color: '#3e79f7' }}>Trivia Time!</div>}
                visible={visible}
                onCancel={() => setVisible(false)}
                width={800}
                footer={trivia ? [
                    <Button key="submit" type="primary" onClick={handleAnswerSubmit} size="large" style={{ height: '50px', fontSize: '18px' }}>
                        Submit Answer
                    </Button>,
                ] : []}
            >
                {trivia ? (
                    <div className="trivia-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Card 
                            title="Question" 
                            headStyle={{ fontSize: '22px', color: '#3d405b' }} 
                            bodyStyle={{ fontSize: '18px', color: '#4B0082' }}                        
                            >
                            {trivia.question}
                        </Card>
                        {trivia.hints.length > 0 && (
                            <Card 
                                title={`Hint ${currentHintIndex + 1}/${trivia.hints.length}`} 
                                extra={
                                    <>
                                        <Button icon={<LeftOutlined />} onClick={showPreviousHint} disabled={currentHintIndex === 0} />
                                        <Button icon={<RightOutlined />} onClick={showNextHint} disabled={currentHintIndex === trivia.hints.length - 1} />
                                    </>
                                }
                                headStyle={{ fontSize: '22px', color: '#3d405b' }}
                                bodyStyle={{ fontSize: '18px', color: '#4B0082' }}
                            >
                                {trivia.hints[currentHintIndex]}
                            </Card>
                        )}
                        <Input
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here"
                            onPressEnter={handleAnswerSubmit}
                            size="large" 
                            style={{ fontSize: '18px' }}
                        />
                    </div>
                ) : (
                    <p style={{ fontSize: '18px', textAlign: 'center' }}>No trivia available for this course.</p>
                )}
            </Modal>
            {contextHolder}
        </>
    )
}

export default TriviaPopup;
