import { useEffect, useState } from 'react'
import { Form, Row, Col, Select, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import AddQuestionModal from '../AddQuestionModal'

const MultipleChoice = ({ pk, option_choices, answer }) => {
  useEffect(() => {
    if (answer && answer.length) {
      console.log(answer)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Select
        options={[...Array.from(option_choices)].map((option) => ({
          label: option.text,
          value: option.text
        }))}
      />
    </Form.Item>
  )
}

const MultipleChoiceScale = ({ pk, answer }) => {
  useEffect(() => {
    if (answer && answer.length) {
      console.log(answer)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Select
        options={[...Array.from(10)].map((i) => ({
          label: i,
          value: i
        }))}
      />
    </Form.Item>
  )
}

const FixedText = ({ pk, answer }) => {
  useEffect(() => {
    if (answer && answer.length) {
      console.log(answer)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Input />
    </Form.Item>
  )
}

const MultiLineText = ({ pk, number_of_text, answer }) => {
  useEffect(() => {
    if (answer && answer.length) {
      console.log(answer)
    }
  }, [answer])
  return (
    <>
      {[...Array(number_of_text).keys()].map((i) => {
        return (
          <Form.Item name={pk} key={i}>
            <Input />
          </Form.Item>
        )
      })}
    </>
  )
}

const TextArea = ({ pk, answer }) => {
  useEffect(() => {
    if (answer && answer.length) {
      console.log(answer)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Input.TextArea rows={4} />
    </Form.Item>
  )
}

const Question = (question) => {
  const { text, question_type, is_required, sectionIdx, survey, setSurvey, studentView, ...rest } =
    question
  const [questionModalOpen, setQuestionModalOpen] = useState(false)

  const handleDeleteQuestion = () => {
    const { pk: pkToDelete } = rest
    const questions = survey.sections[sectionIdx].questions.filter(
      (question) => question.pk !== pkToDelete
    )
    const sections = survey.sections.map((section, i) =>
      i === sectionIdx ? { ...section, questions } : section
    )
    setSurvey({ ...survey, sections })
  }

  return (
    <Form.Item label={text}>
      <Row>
        <Col span={10}>
          {question_type === 'MULTIPLECHOICE' && <MultipleChoice {...rest} />}
          {question_type === 'NUMBER' && <MultipleChoiceScale {...rest} />}
          {question_type === 'FIXEDTEXT' && <FixedText {...rest} />}
          {question_type === 'MULTIPLETEXT' && <MultiLineText {...rest} />}
          {question_type === 'TEXTAREA' && <TextArea {...rest} />}
        </Col>
        {!studentView && (
          <Col span={4}>
            <FontAwesomeIcon
              icon={faEdit}
              style={{
                fontSize: '1em',
                color: '#ffd43b',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => setQuestionModalOpen(true)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              style={{
                fontSize: '1em',
                color: '#dc3545',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={handleDeleteQuestion}
            />
          </Col>
        )}
        <AddQuestionModal
          sectionIdx={sectionIdx}
          open={questionModalOpen}
          setOpen={setQuestionModalOpen}
          survey={survey}
          setSurvey={setSurvey}
          editingQuestion={question}
        />
      </Row>
    </Form.Item>
  )
}

export default Question
