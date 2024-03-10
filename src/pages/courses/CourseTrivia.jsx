import { useState } from 'react';
import Form from 'antd/es/form/Form';
import Input from 'antd/es/input/Input';
import { Button, Row } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';

const CourseTrivia = ({ hints, setHints, form }) => {
  const handleDeleteHint = (idx) => {
    const newHints = hints.filter((_, i) => i !== idx);
    setHints(newHints);
    form.setFieldsValue({hints: newHints});
  };

  return (
    <div className="w-50">
      <Form.Item
        name="triviaQuestion" 
        label="Trivia Question"
        rules={[{ required: true, message: 'Please input a trivia question.' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="triviaAnswer"
        label="Trivia Answer"
        rules={[{ required: true, message: 'Please input a trivia answer.' }]}>
        <Input />
      </Form.Item>
      {hints.map((hint, i) => (
        <Row key={i} align="middle">
          <Form.Item
            label={`Hint #${i + 1}`}
            name={`hint-${i}`}
            rules={[{ required: i === 0, message: 'Please input at least one hint.' }]} 
          >
            <Input value={hint} onChange={e => {
              const updatedHints = [...hints];
              updatedHints[i] = e.target.value;
              setHints(updatedHints);
              form.setFieldsValue({[`hint-${i}`]: e.target.value});
            }} />
          </Form.Item>
          <DeleteTwoTone
            twoToneColor="#dc3545"
            style={{ fontSize: '1.2em', marginLeft: 10, cursor: 'pointer' }}
            onClick={() => handleDeleteHint(i)}
          />
        </Row>
      ))}
      <Form.Item className="text-center">
        <Button type="dashed" onClick={() => setHints([...hints, ''])}>Add Hint</Button>
      </Form.Item>
    </div>
  );
};

export default CourseTrivia;
