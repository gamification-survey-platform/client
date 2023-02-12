import { useEffect, useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { addQuestion } from '../../store/survey/surveySlice'

const AddQuestionModal = ({ show, setShow, sectionIdx }) => {
  const [validated, setValidated] = useState(false)
  const [options, setOptions] = useState([])
  const [questionType, setQuestionType] = useState('mc')
  const formRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    setQuestionType('mc')
    setOptions([])
    setValidated(false)
  }, [show])

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
      if (formObj.type === 'mc') {
        let options, required
        if (formObj.required) {
          required = true
          options = Object.values(formObj).slice(2, -1)
        } else {
          required = false
          options = Object.values(formObj).slice(2)
        }
        payload = { options, required }
      } else if (formObj.type === 'mcs') {
        payload = { numberOfOptions: parseInt(formObj.options), required: !!formObj.required }
      } else if (formObj.type === 'multilineText') {
        payload = { numberOfLines: parseInt(formObj.lines), required: !!formObj.required }
      }
      const { question, type, ...rest } = formObj
      dispatch(addQuestion({ question: { question, type, ...payload }, sectionIdx }))
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
            <Form.Control required name="question"></Form.Control>
            <Form.Control.Feedback type="invalid">Please enter a question</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Question Type:</Form.Label>
            <Form.Select
              name="type"
              onChange={(e) => setQuestionType(e.target.value)}
              value={questionType}>
              <option value="mc">Multiple Choice</option>
              <option value="mcs">Multiple Choice With Scale</option>
              <option value="fixedText">Fixed Text</option>
              <option value="multilineText">Multi-line Text</option>
              <option value="textarea">Textarea</option>
            </Form.Select>
          </Form.Group>
          {questionType === 'mc' && (
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
          {questionType === 'mcs' && (
            <Form.Group className="m-3">
              <Form.Label>Choose number of options</Form.Label>
              <Form.Select name="options" onChange={setNumberOfOptions} value={options.length}>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
              </Form.Select>
            </Form.Group>
          )}
          {questionType === 'multilineText' && (
            <Form.Group className="m-3">
              <Form.Label>Choose number of lines</Form.Label>
              <Form.Control name="lines" defaultValue={1}></Form.Control>
            </Form.Group>
          )}
          <Form.Group className="m-3">
            <Form.Check label="Required?" name="required"></Form.Check>
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
