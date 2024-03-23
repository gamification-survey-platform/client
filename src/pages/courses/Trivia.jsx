import React from 'react'
import { Form, Input, Button, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const TriviaItem = ({ trivia, index, onTriviaChange, onRemove }) => {
  const handleHintChange = (hintIndex, value) => {
    const newHints = [...trivia.hints]
    newHints[hintIndex] = value
    onTriviaChange(index, { ...trivia, hints: newHints })
  }

  const addHint = () => {
    const newHints = [...trivia.hints, '']
    onTriviaChange(index, { ...trivia, hints: newHints })
  }

  const removeHint = (hintIndex) => {
    const newHints = trivia.hints.filter((_, i) => i !== hintIndex);
    onTriviaChange(index, { ...trivia, hints: newHints })
  }

  return (
    <div>
      <Form.Item
        name={`trivia[${index}].question`}
        label="Trivia Question"
        rules={[{ required: true, message: 'Please input a trivia question.' }]}
      >
        <Input
          value={trivia.question}
          onChange={(e) => onTriviaChange(index, { ...trivia, question: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        name={`trivia[${index}].answer`}
        label="Trivia Answer"
        rules={[{ required: true, message: 'Please input a trivia answer.' }]}
      >
        <Input
          value={trivia.answer}
          onChange={(e) => onTriviaChange(index, { ...trivia, answer: e.target.value })}
        />
      </Form.Item>
      {trivia.hints.map((hint, hintIndex) => (
        <Form.Item
          label={`Hint #${hintIndex + 1}`}
          key={hintIndex}
        >
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 40px)' }}
              value={hint}
              onChange={(e) => handleHintChange(hintIndex, e.target.value)}
            />
            <Button
              type="danger"
              onClick={() => removeHint(hintIndex)}
              icon={<MinusCircleOutlined />}
            />
          </Input.Group>
        </Form.Item>
      ))}
      <Button type="dashed" onClick={addHint} block icon={<PlusOutlined />}>
        Add Hint
      </Button>
      {index > 0 && (
        <Button type="link" onClick={() => onRemove(index)}>
          Remove Trivia
        </Button>
      )}
    </div>
  )
}

const Trivia = ({ triviaList, setTriviaList }) => {
  const handleTriviaChange = (index, updatedTrivia) => {
    const newTriviaList = [...triviaList];
    newTriviaList[index] = updatedTrivia;
    setTriviaList(newTriviaList);
  }

  const addTrivia = () => {
    setTriviaList([...triviaList, { question: '', answer: '', hints: [''] }])
  }

  const removeTrivia = (index) => {
    setTriviaList(triviaList.filter((_, i) => i !== index))
  }

  return (
    <div>
      {triviaList.map((trivia, index) => (
        <TriviaItem
          key={index}
          index={index}
          trivia={trivia}
          onTriviaChange={handleTriviaChange}
          onRemove={removeTrivia}
        />
      ))}
      <Button type="dashed" onClick={addTrivia} block icon={<PlusOutlined />}>
        Add Trivia
      </Button>
    </div>
  )
}

export default Trivia
