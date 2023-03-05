import { useEffect, useState, useRef } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import AddQuestionModal from '../AddQuestionModal'

const MultipleChoice = ({ pk, option_choices, answer }) => {
  const inputRef = useRef()
  useEffect(() => {
    if (inputRef && inputRef.current && answer && answer.length) {
      inputRef.current.value = answer[0]
    }
  }, [answer, inputRef])
  return (
    <Form.Select name={pk} ref={inputRef}>
      {Array.from(option_choices).map((option) => (
        <option key={option.pk}>{option.text}</option>
      ))}
    </Form.Select>
  )
}

const MultipleChoiceScale = ({ pk, answer }) => {
  const inputRef = useRef()
  useEffect(() => {
    if (inputRef && inputRef.current && answer && answer.length) {
      inputRef.current.value = answer[0]
    }
  }, [answer, inputRef])

  return (
    <Form.Select name={pk} ref={inputRef}>
      {[...Array(10).keys()].map((option, i) => (
        <option key={i}>{option + 1}</option>
      ))}
    </Form.Select>
  )
}

const FixedText = ({ pk, answer }) => {
  const inputRef = useRef()
  useEffect(() => {
    if (inputRef && inputRef.current && answer && answer.length) {
      inputRef.current.value = answer[0]
    }
  }, [answer, inputRef])
  return <Form.Control name={pk} ref={inputRef} />
}

const MultiLineText = ({ pk, number_of_text, answer }) => {
  const inputRefs = [...Array(number_of_text).keys()].map((_) => useRef())
  useEffect(() => {
    if (inputRefs.length && inputRefs[0].current && answer && answer.length) {
      inputRefs.forEach((ref, i) => {
        ref.current.value = answer[i]
      })
    }
  }, [answer, inputRefs])
  return (
    <>
      {[...Array(number_of_text).keys()].map((i) => {
        return <Form.Control name={pk} key={i} ref={inputRefs[i]} className="mb-3" />
      })}
    </>
  )
}

const TextArea = ({ pk, answer }) => {
  const inputRef = useRef()
  useEffect(() => {
    if (inputRef && inputRef.current && answer) {
      console.log(answer)
      inputRef.current.value = answer[0]
    }
  }, [answer, inputRef])
  return <Form.Control as="textarea" name={pk} ref={inputRef} rows={4} />
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
    <Form.Group className="m-5">
      <Row>
        <Col xs="5">
          <Form.Label className={is_required ? 'required-field' : ''}>{text}</Form.Label>
        </Col>
        <Col xs="5">
          {question_type === 'MULTIPLECHOICE' && <MultipleChoice {...rest} />}
          {question_type === 'NUMBER' && <MultipleChoiceScale {...rest} />}
          {question_type === 'FIXEDTEXT' && <FixedText {...rest} />}
          {question_type === 'MULTIPLETEXT' && <MultiLineText {...rest} />}
          {question_type === 'TEXTAREA' && <TextArea {...rest} />}
        </Col>
        {!studentView && (
          <Col xs="2">
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
          show={questionModalOpen}
          setShow={setQuestionModalOpen}
          survey={survey}
          setSurvey={setSurvey}
          editingQuestion={question}
        />
      </Row>
    </Form.Group>
  )
}

export default Question
