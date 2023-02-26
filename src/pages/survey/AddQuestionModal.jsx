import { useEffect, useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const AddQuestionModal = ({ show, setShow, sectionIdx, survey, setSurvey, editingQuestion }) => {
  const [validated, setValidated] = useState(false)
  const [options, setOptions] = useState([])
  const [questionType, setQuestionType] = useState('MULTIPLECHOICE')
  const formRef = useRef()

  useEffect(() => {
    setQuestionType('MULTIPLECHOICE')
    setOptions([])
    setValidated(false)
    if (editingQuestion && formRef.current) {
      formRef.current.getElementsByTagName('input')[0].value = editingQuestion.text
      const numInputs = formRef.current.getElementsByTagName('input').length
      formRef.current.getElementsByTagName('input')[numInputs - 1].checked =
        editingQuestion.is_required
      setQuestionType(editingQuestion.question_type)
      if (editingQuestion.question_type === 'MULTIPLECHOICE') {
        setOptions(editingQuestion.option_choices)
      }
    }
  }, [show])

  useEffect(() => {
    if (questionType === 'MULTIPLECHOICE' && options.length) {
      for (let i = 0; i < options.length; i++) {
        formRef.current.getElementsByTagName('input')[i + 2].value = options[i].text
      }
    }
  }, [options])

  const handleClose = () => setShow(false)

  const handleSubmit = (event) => {
    const form = formRef.current
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      const formData = new FormData(form)
      const formObj = Object.fromEntries(formData.entries())
      let payload = {}
      if (formObj.question_type === 'MULTIPLECHOICE') {
        let options, required
        if (formObj.required) {
          required = true
          options = Object.values(formObj).slice(2, -1)
        } else {
          required = false
          options = Object.values(formObj).slice(2)
        }
        payload = { options, required }
      } else if (formObj.question_type === 'NUMBER') {
        payload = { numberOfOptions: parseInt(formObj.options), required: !!formObj.required }
      } else if (formObj.question_type === 'MULTIPLETEXT') {
        payload = { numberOfLines: parseInt(formObj.lines), required: !!formObj.required }
      }
      const { text, question_type, ...rest } = formObj
      const questionObj = { text, question_type, ...payload }
      survey.sections[sectionIdx].questions.push(questionObj)
      setSurvey(survey)
      handleClose()
    }
    setValidated(true)
  }

  const setNumberOfOptions = (e) => {
    const options = parseInt(e.target.value)
    if (isNaN(options)) setOptions([])
    else setOptions(Array.from(Array(options).keys()))
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={formRef} noValidate validated={validated}>
          <Form.Group className="m-3">
            <Form.Label>Question:</Form.Label>
            <Form.Control required name="text"></Form.Control>
            <Form.Control.Feedback type="invalid">Please enter a question</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Question Type:</Form.Label>
            <Form.Select
              name="question_type"
              onChange={(e) => setQuestionType(e.target.value)}
              value={questionType}>
              <option value="MULTIPLECHOICE">Multiple Choice</option>
              <option value="NUMBER">Multiple Choice With Scale</option>
              <option value="FIXEDTEXT">Fixed Text</option>
              <option value="MULTIPLETEXT">Multi-line Text</option>
              <option value="TEXTAREA">Textarea</option>
            </Form.Select>
          </Form.Group>
          {questionType === 'MULTIPLECHOICE' && (
            <Form.Group className="m-3">
              <Form.Label>Choose number of options</Form.Label>
              <Form.Control
                onChange={setNumberOfOptions}
                required
                value={options.length === 0 ? '' : options.length}
              />
              {options.map((_, i) => {
                return (
                  <Form.Group className="mt-3" key={i}>
                    <Form.Label>Option {i + 1}</Form.Label>
                    <Form.Control required name={`option-${i}`} />
                  </Form.Group>
                )
              })}
            </Form.Group>
          )}
          {questionType === 'NUMBER' && (
            <Form.Group className="m-3">
              <Form.Label>Choose number of options</Form.Label>
              <Form.Select
                name="option_choices"
                onChange={setNumberOfOptions}
                value={options.length}>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
              </Form.Select>
            </Form.Group>
          )}
          {questionType === 'MULTIPLETEXT' && (
            <Form.Group className="m-3">
              <Form.Label>Choose number of lines</Form.Label>
              <Form.Control name="lines" defaultValue={1}></Form.Control>
            </Form.Group>
          )}
          <Form.Group className="m-3">
            <Form.Check label="Required?" name="is_required"></Form.Check>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddQuestionModal
