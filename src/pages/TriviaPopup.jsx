import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message, Card } from 'antd'
import { getCourseTrivia } from '../api/trivia'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const TriviaPopup = ({ courseId, courses }) => {
    const [visible, setVisible] = useState(false)
    const [trivias, setTrivias] = useState([])
    const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0)
    const [userAnswer, setUserAnswer] = useState('');
    const [currentHintIndex, setCurrentHintIndex] = useState(0)
    const [messageApi, contextHolder] = message.useMessage()
    const selectedCourse = courses.find(course => course.course_number === courseId)

    useEffect(() => {
        if (selectedCourse && selectedCourse.pk) {
            const fetchTrivia = async () => {
                const res = await getCourseTrivia(selectedCourse.pk)
                if (res && res.length > 0) {
                    setTrivias(res)
                    setCurrentTriviaIndex(0)
                } else {
                    setTrivias([])
                }
            }
            fetchTrivia()
        }
    }, [selectedCourse])

    const showNextHint = () => setCurrentHintIndex(prevIndex => Math.min(prevIndex + 1, trivias[currentTriviaIndex]?.hints.length - 1))
    const showPreviousHint = () => setCurrentHintIndex(prevIndex => Math.max(prevIndex - 1, 0))
    const nextTrivia = () => {
        if (currentTriviaIndex < trivias.length - 1) {
            setCurrentTriviaIndex(currentTriviaIndex + 1)
            setCurrentHintIndex(0)
        }
    }
    const previousTrivia = () => {
        if (currentTriviaIndex > 0) {
            setCurrentTriviaIndex(currentTriviaIndex - 1)
            setCurrentHintIndex(0)
        }
    }

    const handleAnswerSubmit = () => {
        if (trivias[currentTriviaIndex] && trivias[currentTriviaIndex].answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
            messageApi.open({ type: 'success', content: 'Correct answer! 🎉' });
            nextTrivia()
            setUserAnswer('')
            if (currentTriviaIndex === trivias.length - 1) {
                handleClose()
            }
        } else {
            messageApi.open({ type: 'error', content: 'Wrong answer. Try again!' });
            setUserAnswer('');
        }
    };

    const handleClose = () => {
        setVisible(false)
        setUserAnswer('')
        setCurrentHintIndex(0)
        setCurrentTriviaIndex(0)
    };

    return (
        <>
            <Button 
                type="link" 
                onClick={() => setVisible(true)} 
                style={{ marginTop: '-10px', color: trivias.length > 0 ? '#1890ff' : '#d9d9d9' }}
            >
                🚀 Trivia
            </Button>
            <Modal
                bodyStyle={{ padding: '20px' }} 
                title={<div style={{ fontWeight: 'bold', fontSize: '24px', color: '#3e79f7' }}>Trivia Time!</div>}
                visible={visible}
                onCancel={() => setVisible(false)}
                width={800}
                footer={(trivias.length > 0 && [
                    <Button key="prev" onClick={previousTrivia} disabled={currentTriviaIndex === 0}>
                        Previous Trivia
                    </Button>,
                    <Button key="next" onClick={nextTrivia} disabled={currentTriviaIndex === trivias.length - 1}>
                        Next Trivia
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAnswerSubmit}>
                        Submit Answer
                    </Button>
                ])}
            >
                {trivias.length > 0 ? (
                    <div className="trivia-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Card 
                            title={`Question ${currentTriviaIndex + 1}/${trivias.length}`} 
                            headStyle={{ fontSize: '22px', color: '#3d405b' }} 
                            bodyStyle={{ fontSize: '18px', color: '#4B0082' }}
                        >
                            {trivias[currentTriviaIndex].question}
                        </Card>
                        {trivias[currentTriviaIndex].hints && trivias[currentTriviaIndex].hints.length > 0 && (
                            <Card 
                                title={`Hint ${currentHintIndex + 1}/${trivias[currentTriviaIndex].hints.length}`} 
                                extra={
                                    <>
                                        <Button icon={<LeftOutlined />} onClick={showPreviousHint} disabled={currentHintIndex === 0} />
                                        <Button icon={<RightOutlined />} onClick={showNextHint} disabled={currentHintIndex === trivias[currentTriviaIndex].hints.length - 1} />
                                    </>
                                }
                                headStyle={{ fontSize: '22px', color: '#3d405b' }}
                                bodyStyle={{ fontSize: '18px', color: '#4B0082' }}
                            >
                                {trivias[currentTriviaIndex].hints[currentHintIndex]}
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
                        😅 Oh no! It seems like this course has no trivia! Please explore other courses for more trivia fun! 🎓🚀
                    </p>
                )}
            </Modal>
            {contextHolder}
        </>
    )
}

export default TriviaPopup
