import { useEffect, useState, useRef } from 'react'
import { Form, Row, Col, Select, Input, Checkbox, InputNumber } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import AddQuestionModal from '../AddQuestionModal'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { Document, Page, pdfjs } from 'react-pdf'
import SlideReviewModal from './SlideReviewModal'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQuestion, editAnswer } from '../../../store/survey/surveySlice'
import surveySelector from '../../../store/survey/selectors'
import { useDrag, useDrop } from 'react-dnd'
import themeSelector from '../../../store/theme/selectors'
import userSelector from '../../../store/user/selectors'
import renderScene from '../../../components/multiple-choice/renderMultipleChoiceAnimation'
import { getRandomEmoji } from './emojis'
import coursesSelector from '../../../store/courses/selectors'
import { useParams } from 'react-router'
import styles from '../../../styles/Question.module.css'
import { gamified_mode } from '../../../gamified'
import { Slider } from 'antd'

const randomEmoji = getRandomEmoji('positive')

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
            <Page pageNumber={answer && answer.length ? parseInt(answer[0].page) : 1} width={200} />
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
      gamified
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
  3: ['😭', '😐', '😄'],
  5: ['😭', '😟', '😐', '🙂', '😄'],
  7: ['😭', '😟', '🥲', '😐', '🙂', '😊', '😄']
}
const generateFeedbackTexts = (length) => {
  switch (length) {
    case 3:
      return ['Disagree', 'Neutral', 'Agree']
    case 5:
      return ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    case 7:
      return [
        'Strongly Disagree',
        'Disagree',
        'Somewhat Disagree',
        'Neutral',
        'Somewhat Agree',
        'Agree',
        'Strongly Agree'
      ]
    default:
      console.error(`Unsupported scale length: ${length}`)
      return []
  }
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
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const dispatch = useDispatch()
  const [sliderValue, setSliderValue] = useState(Math.floor(number_of_scale / 2))
  const emojis = scaleOptions[number_of_scale] || []
  const [showOverlay, setShowOverlay] = useState(false)
  const feedbackTexts = generateFeedbackTexts(emojis.length)

  useEffect(() => {
    // Initialize with existing answer, if applicable
    if (answer && answer.length) {
      const index = emojis.indexOf(answer[0].text)
      if (index !== -1) {
        setSliderValue(index)
      }
    }
  }, [answer, emojis])

  //overlay effct
  const handleSliderChange = (value) => {
    setSliderValue(value)
    const feedbackTexts = generateFeedbackTexts(emojis.length)
    const selectedFeedbackText = feedbackTexts[value]
    // Set the form field value
    form.setFieldValue(name, selectedFeedbackText)
    // Dispatch an action to update the answer
    dispatch(editAnswer({ questionIdx, sectionIdx, answer: selectedFeedbackText, question_type }))
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 5000)
  }

  const thumbWidth = 30
  const getEmojiStyle = (value) => {
    const offsetPercent = value * (100 / (emojis.length - 1))
    return {
      position: 'absolute',
      left: `calc(${offsetPercent}% - ${thumbWidth / 2}px)`,
      userSelect: 'none',
      lineHeight: `${thumbWidth}px`,
      textAlign: 'center',
      marginTop: `-30px`,
      fontSize: `25px`
    }
  }

  const overlayPosition = (value) => ({
    position: 'absolute',
    left: `calc(${value * (100 / (emojis.length - 1))}% - ${thumbWidth / 2}px)`,
    transform: 'translateX(-50%)',
    userSelect: 'none'
  })

  return (
    <Form.Item
      name={name}
      rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
      <div style={{ zIndex: 2, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
          {emojis.map((emoji) => (
            <span key={emoji}>{emoji}</span>
          ))}
        </div>
        <Slider
          min={0}
          max={emojis.length - 1}
          value={sliderValue}
          onChange={handleSliderChange}
          step={1}
          trackStyle={{
            backgroundColor: 'transparent'
          }}
          handleStyle={{
            visibility: 'hidden' // Make the slider handle invisible
          }}
          railStyle={{
            backgroundImage: 'linear-gradient(to right, red, orange, yellow, green)',
            height: '8px'
          }}
        />
        <div style={getEmojiStyle(sliderValue)}>{emojis[sliderValue]}</div>
        {showOverlay && (
          <div style={{ ...overlayPosition(sliderValue), marginTop: '-60px' }}>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '10px',
                whiteSpace: 'nowrap',
                width: 'auto',
                maxWidth: '100%'
              }}>
              {feedbackTexts[sliderValue]}
            </span>
          </div>
        )}
      </div>
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
        <Input onBlur={handleBlur} className={styles.input} />
      </Form.Item>
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
  const user = useSelector(userSelector)
  useEffect(() => {
    if (answer && idx < answer.length) {
      form.setFieldValue(name, answer[idx].text)
      !response && answer[idx].text && gamified_mode(user) && setResponse(randomEmoji)
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
        <Input className={styles.input} />
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

const Number = ({
  sectionIdx,
  questionIdx,
  answer,
  question_type,
  is_required,
  gamified,
  min,
  max
}) => {
  const name = `${sectionIdx}-${questionIdx}`
  const form = useFormInstance()
  const value = Form.useWatch(name, form)
  const [response, setResponse] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(name, answer[0].text)
      !response && gamified_mode() && setResponse(randomEmoji)
    }
  }, [answer])

  useEffect(() => {
    if (answer && (value === 0 || value)) {
      dispatch(editAnswer({ sectionIdx, questionIdx, answer: value, question_type }))
    }
  }, [value])
  return (
    <Row align="middle">
      <Form.Item
        name={name}
        rules={[{ required: is_required, message: 'Please complete the above question.' }]}>
        <InputNumber type="number" min={min} max={max} className={styles.input} />
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
    </div>
  )
}

const Question = (question) => {
  const { text, handleReorderQuestions, index, ...questionProps } = question
  const courses = useSelector(coursesSelector)
  const { course_id } = useParams()
  const user = useSelector(userSelector)
  const course = courses.find(
    ({ course_number }) => parseInt(course_id) === parseInt(course_number)
  )
  questionProps.gamified = questionProps.gamified && !user.is_staff && gamified_mode(user)
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
  const isMultipleChoice = ['SCALEMULTIPLECHOICE', 'MULTIPLECHOICE', 'MULTIPLESELECT'].includes(
    question_type
  )
  const handleDeleteQuestion = () => dispatch(deleteQuestion({ ...question }))
  let questionText
  if (question_type === 'SLIDEREVIEW') questionText = 'Click on the slide to open the questionnaire'
  else if (question_type === 'NUMBER' && !isNaN(questionProps.min) && !isNaN(questionProps.max))
    questionText = `${text} (Enter a number in between [${questionProps.min}, ${questionProps.max}])`
  else questionText = text
  return (
    <div id={id} className="mb-5">
      <Form.Item
        className={isMultipleChoice && styles.questionWrapper}
        rules={[
          { required: questionProps.is_required, message: 'Please complete the above question.' }
        ]}
        style={{
          marginBottom: '80px'
        }}>
        <div
          className={`${questionProps.is_required ? 'required-field py-3' : 'py-3'} questionText`}
          style={{ opacity: isDragging ? 0.2 : 1, wordWrap: 'break-word', whiteSpace: 'normal' }}
          ref={dragDropRef}>
          {questionText}
        </div>

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
              {question_type !== 'SLIDEREVIEW' && (
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
              )}
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
