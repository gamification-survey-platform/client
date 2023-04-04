import { useEffect } from 'react'
import { Modal, Button, Form, Checkbox, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { addSection, editSection, surveySelector } from '../../store/survey/surveySlice'
import { useDispatch, useSelector } from 'react-redux'

const AddSectionModal = ({ open, setOpen, sectionPk }) => {
  const [form] = useForm()
  const dispatch = useDispatch()
  const survey = useSelector(surveySelector)

  useEffect(() => {
    if (sectionPk) {
      const editingSection = survey.sections.find((s) => s.pk === sectionPk)
      form.setFieldsValue(editingSection)
    } else {
      form.resetFields()
    }
  }, [open])

  const handleClose = () => setOpen(false)

  const handleSubmit = (event) => {
    if (!form.validateFields()) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      const formObj = form.getFieldsValue()
      formObj.is_required = !!formObj.is_required
      sectionPk
        ? dispatch(editSection({ section: formObj, pk: sectionPk }))
        : dispatch(addSection(formObj))
      handleClose()
    }
  }

  return (
    <Modal
      title={sectionPk ? 'Edit Section' : 'Add Section'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleSubmit}>
          {sectionPk ? 'Edit' : 'Add'}
        </Button>
      ]}>
      <Form form={form}>
        <Form.Item
          name="title"
          label="Section title"
          rules={[{ required: true, message: 'Please input a section title' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="is_required" label="Required?" valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddSectionModal
