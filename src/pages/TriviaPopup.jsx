import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message, Card } from 'antd'
import { getCourseTrivia } from '../api/trivia'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const TriviaPopup = ({ courseId, courses }) => {
    const courseNumber = courseId;
    const [visible, setVisible] = useState(false)
    const [trivia, setTrivia] = useState(null)
    const [userAnswer, setUserAnswer] = useState('');
    const [currentHintIndex, setCurrentHintIndex] = useState(0)
    const [messageApi, contextHolder] = message.useMessage()
    const selectedCourse = courses.find(course => course.course_number === courseNumber)

    const showNextHint = () => setCurrentHintIndex(prevIndex => Math.min(prevIndex + 1, trivia?.hints.length - 1))
    const showPreviousHint = () => setCurrentHintIndex(prevIndex => Math.max(prevIndex - 1, 0))

    useEffect(() => {
        if (visible && selectedCourse && selectedCourse.pk) {
            const fetchTrivia = async () => {
                try {
                    const res = await getCourseTrivia(selectedCourse.pk);
                    setTrivia(res || null); 
                } catch (error) {
                    console.error('Fetching trivia failed:', error)
                    setTrivia(null)
                }
            };
            fetchTrivia();
        }
    }, [selectedCourse, visible]);

    const handleAnswerSubmit = () => {
        if (trivia && trivia.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
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
                footer={trivia && (
                    <Button key="submit" type="primary" onClick={handleAnswerSubmit} size="large" style={{ height: '50px', fontSize: '18px' }}>
                        Submit Answer
                    </Button>
                )}
            >
                {trivia ? (
                    <div className="trivia-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {trivia.question && (
                            <Card title="Question" headStyle={{ fontSize: '22px', color: '#3d405b' }} bodyStyle={{ fontSize: '18px', color: '#4B0082' }}>
                                {trivia.question}
                            </Card>
                        )}
                        {trivia.hints && trivia.hints.length > 0 && (
                            <Card title={`Hint ${currentHintIndex + 1}/${trivia.hints.length}`} extra={
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
                    <p style={{ fontSize: '20px', textAlign: 'center', color: '#36454F', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '15px', border: '2px dashed #36454F', marginTop: '20px'}}>
                        😅 Oh no! It seems like this course has no trivia! Check back later or explore other courses for more trivia fun! 🎓🚀
                    </p>
                )}
            </Modal>
            {contextHolder}
        </>
    )
}

export default TriviaPopup;
