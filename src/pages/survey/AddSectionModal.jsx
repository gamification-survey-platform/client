import { useEffect, useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

const AddSectionModal = ({ show, setShow, survey, setSurvey, editingSection }) => {
  const [validated, setValidated] = useState(false)
  const formRef = useRef()

  useEffect(() => {
    setValidated(false)
    if (editingSection && formRef.current) {
      const form = formRef.current
      form.getElementsByTagName('input')[0].value = editingSection.title
      form.getElementsByTagName('input')[1].checked = editingSection.is_required
    }
  }, [show, formRef])

  const handleClose = () => setShow(false)

  const handleSubmit = (event) => {
    const form = formRef.current
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      const formData = new FormData(form)
      const formObj = Object.fromEntries(formData.entries())
      console.log(formObj)
      formObj.is_required = !!formObj.is_required
      console.log(formObj.is_required, formObj)
      if (editingSection) {
        survey.sections = survey.sections.map((section, i) =>
          section.pk === editingSection.pk ? { ...section, ...formObj } : section
        )
      } else {
        formObj.questions = []
        survey.sections.push(formObj)
      }
      console.log(survey)
      setSurvey(survey)
      handleClose()
    }
    setValidated(true)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingSection ? 'Edit Section' : 'Add Section'}</Modal.Title>
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
            <Form.Check label="Required?" name="is_required"></Form.Check>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          {editingSection ? 'Edit' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddSectionModal
