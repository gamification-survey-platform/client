import { useEffect } from 'react'
import { Modal, Form, Input, Select, Checkbox } from 'antd'
import { useForm } from 'antd/es/form/Form'

const AddQuestionModal = ({ open, setOpen, sectionIdx, survey, setSurvey, editingQuestion }) => {
  const initialValues = { question_type: 'MULTIPLECHOICE', option_choices: 1, number_of_text: 1 }
  const [form] = useForm()
  const question_type = Form.useWatch('question_type', form)
  const option_choices = Form.useWatch('option_choices', form)
  const options =
    !isNaN(parseInt(option_choices)) && parseInt(option_choices) > 0
      ? [...Array(parseInt(option_choices))].map((_, i) => i)
      : []

  useEffect(() => {
    form.resetFields()
    if (editingQuestion && form) {
      form.setFieldsValue(editingQuestion)
      if (editingQuestion.question_type === 'MULTIPLECHOICE') {
        form.setFieldValue('option_choices', editingQuestion.option_choices.length)
      }
    }
  }, [open])

  useEffect(() => {
    if (editingQuestion && question_type === 'MULTIPLECHOICE' && options.length) {
      options.forEach(
        async (_, i) =>
          await form.setFieldValue(`option-${i}`, editingQuestion.option_choices[i].text)
      )
    }
  }, [options])

  const handleClose = () => setOpen(false)

  const handleSubmit = async (event) => {
    const validFields = await form.validateFields()
    if (!validFields) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      const formObj = await form.getFieldsValue()
      let payload = {}
      console.log(formObj)
      if (formObj.question_type === 'MULTIPLECHOICE') {
        let option_choices = Object.keys(formObj)
          .filter((k) => k.startsWith('option-'))
          .map((k) => formObj[k])
        if (editingQuestion) {
          option_choices = option_choices.map((t, i) => ({
            pk: editingQuestion.option_choices[i].pk,
            text: t
          }))
        } else {
          option_choices = option_choices.map((t) => ({ text: t }))
        }
        payload = { option_choices }
      } else if (formObj.question_type === 'NUMBER') {
        payload = { option_choices: parseInt(formObj.option_choices) }
      } else if (formObj.question_type === 'MULTIPLETEXT') {
        payload = { number_of_text: parseInt(formObj.number_of_text) }
      }
      const { text, question_type, is_required, ...rest } = formObj
      const questionObj = { text, question_type, is_required, ...payload }
      let questions
      if (editingQuestion) {
        questions = survey.sections[sectionIdx].questions.map((q) =>
          q.pk === editingQuestion.pk ? { ...q, ...questionObj } : q
        )
      } else {
        questions = survey.sections[sectionIdx].questions.concat([questionObj])
      }
      setSurvey({
        ...survey,
        sections: survey.sections.map((section, i) =>
          i === sectionIdx ? { ...section, questions } : section
        )
      })
      handleClose()
      await form.resetFields()
    }
  }

  return (
    <Modal
      title={editingQuestion ? 'Edit Question' : 'Add Question'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}>
      <Form form={form} initialValues={initialValues}>
        <Form.Item
          name="text"
          label="Question"
          rules={[{ required: true, message: 'Please enter a question' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="question_type"
          label="Question Type"
          rules={[{ required: true, message: 'Please enter a question' }]}>
          <Select
            options={[
              { value: 'MULTIPLECHOICE', label: 'Multiple Choice' },
              { value: 'NUMBER', label: 'Multiple Choice With Scale' },
              { value: 'FIXEDTEXT', label: 'Fixed Text' },
              { value: 'MULTIPLETEXT', label: 'Multi-line Text' },
              { value: 'TEXTAREA', label: 'Textarea' }
            ]}
          />
        </Form.Item>
        {question_type === 'MULTIPLECHOICE' && (
          <div>
            <Form.Item
              label="Choose number of options"
              name="option_choices"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[1-9]+$/),
                  message: 'Please enter a number between 1-9'
                }
              ]}>
              <Input type="number" />
            </Form.Item>
            {options.length > 0 && (
              <div>
                {options.map((opt, i) => {
                  return (
                    <Form.Item
                      key={i}
                      label={`Option ${i + 1}`}
                      name={`option-${i}`}
                      rules={[{ required: true, message: 'Please enter an option' }]}>
                      <Input />
                    </Form.Item>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {question_type === 'NUMBER' && (
          <Form.Item
            name="option_choices"
            label="Number of options"
            rules={[{ required: true, message: 'Please enter the number of options' }]}>
            <Select
              options={[
                { value: '3', label: '3' },
                { value: '5', label: '5' },
                { value: '7', label: '7' }
              ]}
            />
          </Form.Item>
        )}
        {question_type === 'MULTIPLETEXT' && (
          <Form.Item label="Choose number of lines" name="number_of_text">
            <Input />
          </Form.Item>
        )}
        <Form.Item name="is_required" label="Required?" valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddQuestionModal
