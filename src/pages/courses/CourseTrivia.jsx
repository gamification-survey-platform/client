import { useState } from 'react'
import Form from 'antd/es/form/Form'
import Input from 'antd/es/input/Input'
import { Button, Row } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { DeleteTwoTone } from '@ant-design/icons'

const CourseTrivia = ({ hints, setHints }) => {
  const handleDeleteHint = (idx) => {
    const newHints = hints.filter((_, i) => i !== idx)
    setHints(newHints)
  }
  return (
    <div className="w-50">
      <Form.Item
        name="question"
        label="Trivia Question"
        rules={[{ required: true, message: 'Please input a trivia question.' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="answer"
        label="Trivia Answer"
        rules={[{ required: true, message: 'Please input a trivia answer.' }]}>
        <Input />
      </Form.Item>
      {hints.map((hint, i) => {
        return (
          <Row key={i} align="middle">
            <Form.Item label={`Hint #${i}`} name={`hint-${i}`}>
              <Input />
            </Form.Item>
            <DeleteTwoTone
              twoToneColor="#dc3545"
              style={{
                fontSize: '1em',
                marginLeft: 10,
                marginTop: -30,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => handleDeleteHint(i)}
            />
          </Row>
        )
      })}
      <Form.Item className="text-center">
        <Button onClick={() => setHints([...hints, ''])}>Add hint</Button>
      </Form.Item>
    </div>
  )
}

export default CourseTrivia
