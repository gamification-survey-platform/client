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
import themeSelector from '../../../store/theme/selectors'
import renderScene from '../../../components/multiple-choice/renderMultipleChoiceAnimation'
import TextFeedback from '../../../components/TextFeedback'
import { getRandomEmoji } from './emojis'

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
          <Document file={artifact.file_path} onClick={() => setOpen(!open)}>
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
  is_required,
  gamified
}) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  const initialOptions = option_choices.map((opt) => ({
    transitioned: false,
    ...opt
  }))
  const { multiple_choice_item, multiple_choice_target } = useSelector(themeSelector)
  const [options, setOptions] = useState(initialOptions)
  const [initialRender, setInitialRender] = useState(true)

  useEffect(() => {
    const element = document.getElementById(name)
    if (answer && answer.length && initialRender) {
      form.setFieldValue(name, answer[0].text)
      const newOptions = options.map((opt) => {
        if (opt.text === answer[0].text) return { ...opt, transitioned: true }
        else return opt
      })
      setOptions(newOptions)
      const { width, height } = element.getBoundingClientRect()
      gamified &&
        renderScene({
          width,
          height,
          ref: element,
          options: newOptions,
          handleSelect,
          item: multiple_choice_item,
          target: multiple_choice_target,
          questionType: 'MULTIPLECHOICE'
        })
    } else if (element && initialRender) {
      const { width, height } = element.getBoundingClientRect()
      gamified &&
        renderScene({
          width,
          height,
          ref: element,
          options,
          handleSelect,
          item: multiple_choice_item,
          target: multiple_choice_target,
          questionType: 'MULTIPLECHOICE'
        })
    } else if (!initialRender && answer && answer.length) {
      const newOptions = options.map((opt) => {
        if (opt.text === answer[0].text) return { ...opt, transitioned: true }
        else return { ...opt, transitioned: false }
      })
      setOptions(newOptions)
      gamified && renderScene({ ref: element, options: newOptions, update: true })
    }
    setInitialRender(false)
  }, [answer])

  const handleSelect = (answer) => {
    form.setFieldValue(name, answer)
  }

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ questionIdx, sectionIdx, answer: value, question_type }))
  }, [value])

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
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
  is_required,
  gamified
}) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  const { multiple_select_item, multiple_select_target } = useSelector(themeSelector)
  const initialOptions = option_choices.map((opt) => ({
    transitioned: false,
    ...opt
  }))
  const [options, setOptions] = useState(initialOptions)
  const [initialRender, setInitialRender] = useState(true)

  useEffect(() => {
    const element = document.getElementById(name)
    if (answer && answer.length && initialRender) {
      const answers = answer.map((a) => a.text)
      form.setFieldValue(name, answers)
      const newOptions = options.map((opt) => {
        if (answers.indexOf(opt.text) !== -1) return { ...opt, transitioned: true }
        else return opt
      })
      setOptions(newOptions)
      const { width, height } = element.getBoundingClientRect()
      gamified &&
        renderScene({
          width,
          height,
          ref: element,
          options: newOptions,
          handleSelect,
          item: multiple_select_item,
          target: multiple_select_target,
          questionType: 'MULTIPLESELECT'
        })
    } else if (element && initialRender) {
      const { width, height } = element.getBoundingClientRect()
      gamified &&
        renderScene({
          width,
          height,
          ref: element,
          options,
          handleSelect,
          item: multiple_select_item,
          target: multiple_select_target,
          questionType: 'MULTIPLESELECT'
        })
    } else if (!initialRender && answer) {
      const answers = answer.map((a) => a.text)
      const newOptions = options.map((opt) => {
        if (answers.indexOf(opt.text) !== -1) return { ...opt, transitioned: true }
        else return { ...opt, transitioned: false }
      })
      setOptions(newOptions)
      gamified && renderScene({ ref: element, options: newOptions, update: true })
    }
    setInitialRender(false)
  }, [answer])

  const handleSelect = (answers) => {
    form.setFieldValue(name, answers)
  }

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
        options={options.map((option) => ({
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
  number_of_scale,
  gamified
}) => {
  const initialOptions = scaleOptions[number_of_scale].map((text) => ({
    transitioned: false,
    text
  }))
  const [options, setOptions] = useState(initialOptions)
  const [initialRender, setInitialRender] = useState(true)
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const { scale_multiple_choice_item, scale_multiple_choice_target } = useSelector(themeSelector)
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()

  useEffect(() => {
    const element = document.getElementById(name)
    if (answer && answer.length && initialRender) {
      form.setFieldValue(name, answer[0].text)
      const newOptions = options.map((opt) => {
        if (opt.text === answer[0].text) return { ...opt, transitioned: true }
        else return opt
      })
      setOptions(newOptions)
      const { width, height } = element.getBoundingClientRect()
      gamified &&
        renderScene({
          width,
          height,
          ref: element,
          options: newOptions,
          item: scale_multiple_choice_item,
          target: scale_multiple_choice_target,
          handleSelect,
          questionType: 'SCALEMULTIPLECHOICE'
        })
    } else if (element && initialRender) {
      const { width, height } = element.getBoundingClientRect()
      gamified &&
        renderScene({
          width,
          height,
          ref: element,
          options,
          handleSelect,
          item: scale_multiple_choice_item,
          target: scale_multiple_choice_target,
          questionType: 'SCALEMULTIPLECHOICE'
        })
    } else if (!initialRender && answer && answer.length) {
      const newOptions = options.map((opt) => {
        if (opt.text === answer[0].text) return { ...opt, transitioned: true }
        else return { ...opt, transitioned: false }
      })
      setOptions(newOptions)
      gamified && renderScene({ ref: element, options: newOptions, update: true })
    }
    setInitialRender(false)
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ questionIdx, sectionIdx, answer: value, question_type }))
  }, [value])

  const handleSelect = (answer) => {
    form.setFieldValue(name, answer)
  }

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <Select
        options={options.map((option) => ({
          label: option.text,
          value: option.text
        }))}
      />
    </Form.Item>
  )
}

const FixedText = ({ sectionIdx, questionIdx, answer, question_type, is_required, gamified }) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
  }, [value])

  const handleBlur = () => {
    const text = form.getFieldValue(name)
    setText(text)
  }

  return (
    <div>
      <Form.Item
        name={name}
        rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
        <Input onBlur={handleBlur} />
      </Form.Item>
      {text && gamified && <TextFeedback text={text} />}
    </div>
  )
}

const MultiLineField = ({
  sectionIdx,
  questionIdx,
  question_type,
  idx,
  answer,
  number_of_text,
  is_required,
  gamified
}) => {
  const name = `${sectionIdx}-${questionIdx}-${idx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const [response, setResponse] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && idx < answer.length) {
      form.setFieldValue(name, answer[idx].text)
      !response && answer[idx].text && setResponse(getRandomEmoji('positive'))
    }
  }, [answer])
  useEffect(() => {
    if (answer && value) {
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
    }
  }, [value])

  return (
    <Row align="middle">
      <Form.Item
        name={name}
        rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
        <Input />
      </Form.Item>
      {response && gamified ? (
        <h3
          className="ml-3"
          dangerouslySetInnerHTML={{
            __html: `${response}`
          }}
        />
      ) : null}
    </Row>
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

const Number = ({ sectionIdx, questionIdx, answer, question_type, is_required, gamified }) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const [response, setResponse] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
      !response && setResponse(getRandomEmoji('positive'))
    }
  }, [answer])

  useEffect(() => {
    if (answer && value) {
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
    }
  }, [value])

  return (
    <Row align="middle">
      <Form.Item
        name={name}
        rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
        <Input type="number" />
      </Form.Item>
      {response && gamified ? (
        <h1
          className="ml-3"
          dangerouslySetInnerHTML={{
            __html: `${response}`
          }}
        />
      ) : null}
    </Row>
  )
}

const TextArea = ({ sectionIdx, questionIdx, answer, question_type, is_required, gamified }) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
    }
  }, [answer])

  useEffect(() => {
    if (answer && value)
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
  }, [value])

  const handleBlur = () => {
    const text = form.getFieldValue(name)
    setText(text)
  }

  return (
    <div>
      <Form.Item
        name={name}
        rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
        <Input.TextArea rows={4} onBlur={handleBlur} />
      </Form.Item>
      {text && gamified && <TextFeedback text={text} />}
    </div>
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
  const { sectionIdx, questionIdx } = question
  const id = `${sectionIdx}-${questionIdx}`
  const ref = useRef()
  const dragDropRef = dragRef(dropRef(ref))

  const handleDeleteQuestion = () => dispatch(deleteQuestion({ ...question }))
  return (
    <div id={id}>
      <Form.Item
        rules={[
          { required: questionProps.is_required, message: 'Please complete the above question.' }
        ]}
        label={
          <div
            className={questionProps.is_required ? 'required-field py-3' : 'py-3'}
            style={{ opacity: isDragging ? 0.2 : 1 }}
            ref={dragDropRef}>
            {question_type === 'SLIDEREVIEW'
              ? 'Click on the slide to open the questionnaire'
              : text}
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
    </div>
  )
}

export default Question
