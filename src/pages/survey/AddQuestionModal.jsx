import { useEffect } from 'react'
import { Modal, Form, Input, Select, Checkbox, Popover, Typography, Space, theme } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, editQuestion } from '../../store/survey/surveySlice'
import surveySelector from '../../store/survey/selectors'
import { QuestionCircleTwoTone } from '@ant-design/icons'

const AddQuestionModal = ({ open, setOpen, sectionIdx, questionIdx }) => {
  const initialValues = {
    question_type: 'MULTIPLECHOICE',
    option_choices: 1,
    number_of_text: 1,
    number_of_scale: 3,
    gamified: true,
    phrased_positively: true
  }
  const [form] = useForm()
  const dispatch = useDispatch()
  const question_type = Form.useWatch('question_type', form)
  const option_choices = Form.useWatch('option_choices', form)
  const survey = useSelector(surveySelector)
  const { defaultAlgorithm, defaultSeed } = theme
  const { colorSuccess, colorError } = defaultAlgorithm(defaultSeed)
  const editingQuestion =
    questionIdx >= 0
      ? survey.sections.find((s, i) => sectionIdx === i).questions.find((q, j) => j === questionIdx)
      : undefined
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
    if (
      editingQuestion &&
      question_type === 'MULTIPLECHOICE' &&
      options.length &&
      editingQuestion.option_choices
    ) {
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
      if (
        formObj.question_type === 'MULTIPLECHOICE' ||
        formObj.question_type === 'MULTIPLESELECT'
      ) {
        let option_choices = Object.keys(formObj)
          .filter((k) => k.startsWith('option-'))
          .map((k) => formObj[k])
        if (editingQuestion && editingQuestion.option_choices) {
          option_choices = option_choices.map((t, i) => ({
            pk:
              editingQuestion.option_choices.length > i
                ? editingQuestion.option_choices[i].pk
                : undefined,
            text: t
          }))
        } else {
          option_choices = option_choices.map((t) => ({ text: t }))
        }
        payload = { option_choices }
      } else if (formObj.question_type === 'SCALEMULTIPLECHOICE') {
        payload = { number_of_scale: parseInt(formObj.number_of_scale) }
      } else if (formObj.question_type === 'MULTIPLETEXT') {
        payload = { number_of_text: parseInt(formObj.number_of_text) }
      }
      const { text, question_type, is_required, gamified, phrased_positively, ...rest } = formObj
      const questionObj = {
        text,
        question_type,
        is_required: !!is_required,
        gamified: !!gamified,
        phrased_positively: !!phrased_positively,
        ...payload
      }
      if (questionIdx >= 0) {
        dispatch(editQuestion({ question: questionObj, questionIdx, sectionIdx }))
      } else {
        dispatch(addQuestion({ question: questionObj, sectionIdx }))
      }
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
              { value: 'MULTIPLESELECT', label: 'Multiple Select' },
              { value: 'NUMBER', label: 'Number' },
              { value: 'SCALEMULTIPLECHOICE', label: 'Multiple Choice With Scale' },
              { value: 'FIXEDTEXT', label: 'Fixed Text' },
              { value: 'MULTIPLETEXT', label: 'Multi-line Text' },
              { value: 'TEXTAREA', label: 'Textarea' }
            ]}
          />
        </Form.Item>
        {(question_type === 'MULTIPLECHOICE' || question_type === 'MULTIPLESELECT') && (
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
        {question_type === 'SCALEMULTIPLECHOICE' && (
          <Form.Item
            name="number_of_scale"
            label="Number of options"
            rules={[{ required: true, message: 'Please enter the number of options' }]}>
            <Select
              options={[
                { value: '3', label: '3 (agree, neutral, disagree)' },
                {
                  value: '5',
                  label: '5 (strongly agree, agree, neutral, disagree, strongly disagree)'
                },
                {
                  value: '7',
                  label:
                    '7 (strongly agree, agree, weakly agree, neutral, weakly disagree, disagree, strongly disagree)'
                }
              ]}
            />
          </Form.Item>
        )}
        {question_type === 'MULTIPLETEXT' && (
          <Form.Item label="Choose number of lines" name="number_of_text">
            <Input type="number" />
          </Form.Item>
        )}
        {question_type !== 'MULTIPLESELECT' && (
          <Form.Item name="is_required" label="Required?" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )}
        <Form.Item
          name="gamified"
          label={
            <div>
              Enable Gamification
              <Popover
                content={() => (
                  <Space style={{ maxWidth: 500 }} direction="vertical">
                    <div>
                      Enabling this feature gamifies the survey form filling process by adding user
                      interaction and feedback.
                    </div>
                    <div>
                      This includes sentiment analysis, feedback, and interactive multiple choice
                      effects.
                    </div>
                  </Space>
                )}>
                {' '}
                <QuestionCircleTwoTone
                  style={{ fontSize: '1.2em', pointerEvents: 'auto', cursor: 'pointer' }}
                />
              </Popover>
            </div>
          }
          valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="phrased_positively"
          label={
            <div>
              Positively phrased
              <Popover
                content={() => (
                  <Space style={{ maxWidth: 500 }} direction="vertical">
                    A positively phrased question is a question where a higher response means the
                    student/team performed better in this element.
                    <div>For example:</div>
                    <i style={{ color: colorSuccess }}>
                      {"The student's delivery skills were good"}
                    </i>
                    <>Is positively phrased</>
                    <i style={{ color: colorError }}>{"The student's delivery skills were poor"}</i>
                    <>Is negatively phrased</>
                    <strong>Why do we need this?</strong>
                    <>
                      The platform uses sentiment analysis to calculate each section&rsquo;s
                      sentiment and aggregates the result to provide the student with an overall
                      survey sentiment.
                    </>
                  </Space>
                )}>
                {' '}
                <QuestionCircleTwoTone
                  style={{ fontSize: '1.2em', pointerEvents: 'auto', cursor: 'pointer' }}
                />
              </Popover>
            </div>
          }
          valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </Form>
    </Modal>
  )
}
//            'E.g. "Was the student\'s delivery good?" vs. "Was the student\'s delivery poor?'

export default AddQuestionModal
