import { useEffect, useState } from 'react'
import { Form, Row, Col, Select, Input, Slider } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import AddQuestionModal from '../AddQuestionModal'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { Document, Page, pdfjs } from 'react-pdf'
import SlideReviewModal from './SlideReviewModal'
import { useDispatch } from 'react-redux'
import { deleteQuestion } from '../../../store/survey/surveySlice'

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

const MultipleChoice = ({ pk, option_choices, answer }) => {
  const form = useFormInstance()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(pk, answer[0].text)
    }
  }, [answer])
  const ticks = option_choices.reduce((acc, el, i) => ({ ...acc, [i]: el.text }), {})
  return (
    <Form.Item name={pk}>
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

const MultipleChoiceScale = ({ pk, answer }) => {
  const form = useFormInstance()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(pk, answer[0].text)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Select
        options={[...Array.from(10)].map((i) => ({
          label: i,
          value: i
        }))}
      />
    </Form.Item>
  )
}

const FixedText = ({ pk, answer }) => {
  const form = useFormInstance()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(pk, answer[0].text)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Input />
    </Form.Item>
  )
}

const MultiLineText = ({ pk, number_of_text, answer }) => {
  const form = useFormInstance()
  useEffect(() => {
    if (answer && answer.length) {
      answer.forEach((a, i) => {
        form.setFieldValue(`${pk}-${i}`, a.text)
      })
    }
  }, [answer])
  return (
    <>
      {[...Array(number_of_text).keys()].map((i) => {
        return (
          <Form.Item key={i} name={`${pk}-${i}`}>
            <Input key={i} />
          </Form.Item>
        )
      })}
    </>
  )
}

const TextArea = ({ pk, answer }) => {
  const form = useFormInstance()
  useEffect(() => {
    if (answer && answer.length) {
      form.setFieldValue(pk, answer[0].text)
    }
  }, [answer])

  return (
    <Form.Item name={pk}>
      <Input.TextArea rows={4} />
    </Form.Item>
  )
}

const Question = (question) => {
  const { text, question_type, is_required, sectionPk, studentView, ...questionProps } = question
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const dispatch = useDispatch()

  const handleDeleteQuestion = () =>
    dispatch(deleteQuestion({ sectionPk, questionPk: question.pk }))

  return (
    <Form.Item
      label={
        question_type === 'SLIDEREVIEW' ? 'Click on the slide to open the questionnaire' : text
      }>
      {/*rules={[{ required: is_required, message: 'Please complete the above question.' }]}>*/}
      <Row>
        <Col span={question_type !== 'SLIDEREVIEW' ? 12 : 20}>
          {question_type === 'MULTIPLECHOICE' && <MultipleChoice {...questionProps} />}
          {question_type === 'NUMBER' && <MultipleChoiceScale {...questionProps} />}
          {question_type === 'FIXEDTEXT' && <FixedText {...questionProps} />}
          {question_type === 'MULTIPLETEXT' && <MultiLineText {...questionProps} />}
          {question_type === 'TEXTAREA' && <TextArea {...questionProps} />}
          {question_type === 'SLIDEREVIEW' && (
            <SlideReview {...questionProps} sectionPk={sectionPk} />
          )}
        </Col>
        {!studentView && (
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
          sectionPk={sectionPk}
          questionPk={question.pk}
        />
      </Row>
    </Form.Item>
  )
}

export default Question
