import { useEffect, useState, useRef } from 'react'
import { Form, Row, Col, Select, Input, Checkbox } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import AddQuestionModal from '../AddQuestionModal'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { Document, Page, pdfjs } from 'react-pdf'
import SlideReviewModal from './SlideReviewModal'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQuestion, editAnswer, surveySelector } from '../../../store/survey/surveySlice'
import { useDrag, useDrop } from 'react-dnd'

const SlideReview = (props) => {
  const [open, setOpen] = useState(false)
  const { artifact, answer } = props
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [])

  return (
    <Col offset={1} style={{ cursor: 'pointer' }}>
      {artifact && (
        <>
          <Document file={artifact} onClick={() => setOpen(!open)}>
            {' '}
            <Page pageNumber={answer && answer.length ? answer[0].page : 1} width={200} />
          </Document>
          <SlideReviewModal {...props} open={open} setOpen={setOpen} />
        </>
      )}
    </Col>
  )
}

const MultipleChoice = ({
  sectionIdx,
  questionIdx,
  option_choices,
  answer,
  question_type,
  is_required
}) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()

  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ questionIdx, sectionIdx, answer: value, question_type }))
  }, [value])
  const ticks = option_choices.reduce((acc, el, i) => ({ ...acc, [i]: el.text }), {})
  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      {/* <Slider marks={ticks} max={option_choices.length - 1} tooltip={{ open: false }} /> */}
      <Select
        options={[...Array.from(option_choices)].map((option) => ({
          label: option.text,
          value: option.text
        }))}
      />
    </Form.Item>
  )
}

const MultipleSelect = ({
  sectionIdx,
  questionIdx,
  option_choices,
  answer,
  question_type,
  is_required
}) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()

  useEffect(() => {
    if (answer && answer.length) {
      const answers = answer.map((a) => a.text)
      form.setFieldValue(name, answers)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value) {
      dispatch(editAnswer({ questionIdx, sectionIdx, answer: value, question_type }))
    }
  }, [value])
  const ticks = option_choices.reduce((acc, el, i) => ({ ...acc, [i]: el.text }), {})
  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      {/* <Slider marks={ticks} max={option_choices.length - 1} tooltip={{ open: false }} /> */}
      <Checkbox.Group
        options={[...Array.from(option_choices)].map((option) => ({
          label: option.text,
          value: option.text
        }))}
      />
    </Form.Item>
  )
}

const scaleOptions = {
  3: ['disagree', 'neutral', 'agree'],
  5: ['strongly disagree', 'disagree', 'neutral', 'agree', 'strongly agree'],
  7: [
    'strongly disagree',
    'disagree',
    'weakly disagree',
    'neutral',
    'weakly agree',
    'agree',
    'strongly agree'
  ]
}

const MultipleChoiceScale = ({
  sectionIdx,
  questionIdx,
  answer,
  question_type,
  is_required,
  number_of_scale
}) => {
  const options = scaleOptions[number_of_scale]
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()

  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ questionIdx, sectionIdx, answer: value, question_type }))
  }, [value])
  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <Select
        options={options.map((option) => ({
          label: option,
          value: option
        }))}
      />
    </Form.Item>
  )
}

const FixedText = ({ sectionIdx, questionIdx, answer, question_type, is_required }) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
  }, [value])

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <Input />
    </Form.Item>
  )
}

const MultiLineField = ({
  sectionIdx,
  questionIdx,
  question_type,
  idx,
  answer,
  number_of_text,
  is_required
}) => {
  const name = `${sectionIdx}-${questionIdx}-${idx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && idx < answer.length) {
      form.setFieldValue(name, answer[idx].text)
    }
  }, [answer])
  useEffect(() => {
    if (answer && value)
      dispatch(
        editAnswer({
          questionIdx,
          sectionIdx,
          answer: value,
          question_type,
          idx,
          number_of_text
        })
      )
  }, [value])

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <Input />
    </Form.Item>
  )
}

const MultiLineText = (props) => {
  const { number_of_text } = props

  return (
    <>
      {[...Array(number_of_text).keys()].map((i) => (
        <MultiLineField key={i} idx={i} {...props} />
      ))}
    </>
  )
}

const Number = ({ sectionIdx, questionIdx, answer, question_type, is_required }) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
  }, [value])

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <Input type="number" />
    </Form.Item>
  )
}

const TextArea = ({ sectionIdx, questionIdx, answer, question_type, is_required }) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
  }, [value])

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <Input.TextArea rows={4} />
    </Form.Item>
  )
}

const Question = (question) => {
  const { text, handleReorderQuestions, index, ...questionProps } = question
  const survey = useSelector(surveySelector)
  const { question_type } = question
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const dispatch = useDispatch()
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'QUESTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))
  const [, dropRef] = useDrop(() => ({
    accept: 'QUESTION',
    hover: (item, monitor) => {
      if (!survey.instructorView) return
      const dragIndex = item.index
      const hoverIndex = index
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top

      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

      handleReorderQuestions(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      handlerId: monitor.getHandlerId()
    })
  }))

  const ref = useRef()
  const dragDropRef = dragRef(dropRef(ref))

  const handleDeleteQuestion = () => dispatch(deleteQuestion({ ...question }))
  return (
    <Form.Item
      rules={[
        { required: questionProps.is_required, message: 'Please complete the above question.' }
      ]}
      label={
        <div
          className={questionProps.is_required ? 'required-field py-3' : 'py-3'}
          style={{ opacity: isDragging ? 0.2 : 1 }}
          ref={dragDropRef}>
          {question_type === 'SLIDEREVIEW' ? 'Click on the slide to open the questionnaire' : text}
        </div>
      }>
      <Row>
        <Col span={question_type !== 'SLIDEREVIEW' ? 12 : 20}>
          {question_type === 'MULTIPLECHOICE' && <MultipleChoice {...questionProps} />}
          {question_type === 'MULTIPLESELECT' && <MultipleSelect {...questionProps} />}
          {question_type === 'SCALEMULTIPLECHOICE' && <MultipleChoiceScale {...questionProps} />}
          {question_type === 'NUMBER' && <Number {...questionProps} />}
          {question_type === 'FIXEDTEXT' && <FixedText {...questionProps} />}
          {question_type === 'MULTIPLETEXT' && <MultiLineText {...questionProps} />}
          {question_type === 'TEXTAREA' && <TextArea {...questionProps} />}
          {question_type === 'SLIDEREVIEW' && <SlideReview {...questionProps} />}
        </Col>
        {survey.instructorView && (
          <Col span={2}>
            <EditTwoTone
              twoToneColor="#ffd43b"
              style={{
                fontSize: '1em',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => setQuestionModalOpen(true)}
            />
            <DeleteTwoTone
              twoToneColor="#dc3545"
              style={{
                fontSize: '1em',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={handleDeleteQuestion}
            />
          </Col>
        )}
        <AddQuestionModal
          open={questionModalOpen}
          setOpen={setQuestionModalOpen}
          sectionIdx={question.sectionIdx}
          questionIdx={question.questionIdx}
        />
      </Row>
    </Form.Item>
  )
}

export default Question
