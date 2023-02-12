import { useEffect, useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { addSection } from '../../store/survey/surveySlice'

const AddSectionModal = ({ show, setShow }) => {
  const [validated, setValidated] = useState(false)
  const formRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => setValidated(false), [show])

  const handleClose = () => setShow(false)

  const handleSubmit = (event) => {
    const form = formRef.current
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      const formData = new FormData(form)
      const formObj = Object.fromEntries(formData.entries())
      dispatch(addSection(formObj))
      handleClose()
    }
    setValidated(true)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Section</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={formRef} noValidate validated={validated}>
          <Form.Group className="m-3">
            <Form.Label>Section Title:</Form.Label>
            <Form.Control required name="title"></Form.Control>
            <Form.Control.Feedback type="invalid">
              Please enter a section title
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Section Description:</Form.Label>
            <Form.Control required name="description"></Form.Control>
            <Form.Control.Feedback type="invalid">Please enter a description</Form.Control.Feedback>
          </Form.Group>
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

export default AddSectionModal
