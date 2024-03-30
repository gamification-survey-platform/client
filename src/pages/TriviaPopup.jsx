import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message, Card, Badge } from 'antd'
import { getCourseTrivia, markTriviaAsCompleted } from '../api/trivia'
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from '@ant-design/icons'

const TriviaPopup = ({ courseId, courses }) => {
    const [visible, setVisible] = useState(false)
    const [trivias, setTrivias] = useState([])
    const [allCompleted, setAllCompleted] = useState(false)
    const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [currentHintIndex, setCurrentHintIndex] = useState(-1)
    const [hintsUsed, setHintsUsed] = useState(0)
    const [messageApi, contextHolder] = message.useMessage()
    const selectedCourse = courses.find(course => course.course_number === courseId)

    useEffect(() => {
        if (selectedCourse && selectedCourse.pk) {
            const fetchTrivia = async () => {
                try {
                    const res = await getCourseTrivia(selectedCourse.pk)
                    if (res && res.length > 0) {
                        setTrivias(res)
                        setCurrentTriviaIndex(0)
                        setHintsUsed(0)
                    } 
                } catch (error) {
                    if (error.response && error.response.status === 204) {
                        setTrivias([])
                    } else if (error.response && error.response.status === 208) {
                        setAllCompleted(true)
                    } else {
                        message.error(error.toString())
                    }
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
            setCurrentHintIndex(-1)
        }
    }
    const previousTrivia = () => {
        if (currentTriviaIndex > 0) {
            setCurrentTriviaIndex(currentTriviaIndex - 1)
            setCurrentHintIndex(-1)
        }
    }

    const calculatePoints = () => {
        let points = 12
        for (let i = 0; i < hintsUsed; i++) {
            points = Math.max(0, Math.floor(points / 2))
        }
        return points
    }

    const handleAnswerSubmit = async () => {
            try {
                const response = await markTriviaAsCompleted(trivias[currentTriviaIndex].id, hintsUsed, userAnswer)
                if (response.is_correct) {
                    messageApi.open({ type: 'success', content: `Correct answer! 🎉 You gained ${response.points} points.` });
                } else {
                    messageApi.open({ type: 'error', content: 'Wrong answer. But you can try other trivias!' });
                }
                const updatedTrivias = trivias.filter((_, index) => index !== currentTriviaIndex)
                setHintsUsed(0)
                setTrivias(updatedTrivias);
                if (updatedTrivias.length > 0) {
                    const newIndex = currentTriviaIndex >= updatedTrivias.length ? updatedTrivias.length - 1 : currentTriviaIndex
                    setCurrentTriviaIndex(newIndex)
                    setCurrentHintIndex(-1)
                } else {
                    setAllCompleted(true)
                    handleClose()
                }
            } catch (error) {
                messageApi.open({ type: 'error', content: 'Failed to record trivia attempt. Please try again later.' });
            }
        setUserAnswer('')
    }

    const useHint = () => {
        setCurrentHintIndex(0)
        setHintsUsed(1)
    };

    const handleClose = () => {
        setVisible(false)
        setUserAnswer('')
        setCurrentHintIndex(-1)
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
            {allCompleted && (
                <Modal
                bodyStyle={{ padding: '20px' }} 
                title={<div style={{ fontWeight: 'bold', fontSize: '24px', color: '#3e79f7' }}>Trivia Completed!</div>}
                width={800}
                visible={allCompleted}
                footer={[
                    <Button key="ok" type="primary" onClick={() => setAllCompleted(false)}>
                    OK
                    </Button>
                ]}
                >
                <p  style={{fontSize: '22px'}}>🎆🎆🎉🎉You have completed all trivia for this course. Look at other courses for more trivia fun! 🎓🚀</p>
                </Modal>
            )}
            {visible && (
                <Modal
                    bodyStyle={{ padding: '20px' }} 
                    title={<div style={{ fontWeight: 'bold', fontSize: '24px', color: '#3e79f7' }}>Trivia Time!</div>}
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    width={800}
                    footer={trivias.length > 0 ? [
                        <Button key="prev" onClick={previousTrivia} disabled={currentTriviaIndex === 0}>
                            Previous Trivia
                        </Button>,
                        <Button key="next" onClick={nextTrivia} disabled={currentTriviaIndex === trivias.length - 1}>
                            Next Trivia
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleAnswerSubmit}>
                        Submit and earn 
                        <Badge count={calculatePoints()} style={{ backgroundColor: '#00A86B', marginLeft: 4, marginRight:4 }} />
                        points
                        </Button>

                    ] : null}
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
                            {currentHintIndex === -1 && trivias[currentTriviaIndex].hints.length > 0 && (
                            <Card 
                                title="Hint Available"
                                headStyle={{ fontSize: '18px', color: '#3d405b' }}
                                bodyStyle={{ fontSize: '16px', color: '#4B0082' }}
                            >
                                <p>Using a hint will decrease your points to 6 points for this question.</p>
                                <Button type="primary" onClick={useHint} icon={<QuestionCircleOutlined />}>Use Hint</Button>
                            </Card>
                            )}
                            {currentHintIndex >= 0 && trivias[currentTriviaIndex].hints.length > 0 && (
                                <Card
                                    title={`Hint ${currentHintIndex + 1}/${trivias[currentTriviaIndex].hints.length}`}
                                    extra={
                                        <>
                                            <Button key="prev" onClick={showPreviousHint} disabled={currentHintIndex === 0}>Previous</Button>
                                            <Button key="next" onClick={() => { setHintsUsed(hintsUsed + 1); showNextHint(); }} 
                                            disabled={currentHintIndex >= trivias[currentTriviaIndex].hints.length - 1}>
                                            Next Hint (
                                            <Badge count={`-${Math.ceil(calculatePoints() / 2)}`} style={{ backgroundColor: '#f5222d', marginLeft: 4, marginRight:4 }} />
                                            points)
                                            </Button>
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
                            😅 There is no trivia available for you! Please explore other courses for more trivia challenges and fun! 🎓🚀
                        </p>
                    )}
                </Modal>
            )}
            {contextHolder}
        </>
    )
}

export default TriviaPopup
