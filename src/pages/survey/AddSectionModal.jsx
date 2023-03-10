import { useEffect, useState } from 'react'
import { Modal, Button, Form, Checkbox, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'

const AddSectionModal = ({ open, setOpen, survey, setSurvey, editingSection }) => {
  const [form] = useForm()

  useEffect(() => {
    if (editingSection) {
      form.setFieldValue(editingSection)
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
      if (editingSection) {
        survey.sections = survey.sections.map((section, i) =>
          section.pk === editingSection.pk ? { ...section, ...formObj } : section
        )
      } else {
        formObj.questions = []
        survey.sections.push(formObj)
      }
      setSurvey(survey)
      handleClose()
    }
  }

  return (
    <Modal
      title={editingSection ? 'Edit Section' : 'Add Section'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleSubmit}>
          {editingSection ? 'Edit' : 'Add'}
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
