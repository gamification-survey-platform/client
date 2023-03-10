import { useEffect, useState } from 'react'
import { Form, Row, Col, Select, Input, Slider } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import AddQuestionModal from '../AddQuestionModal'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { Document, Page, pdfjs } from 'react-pdf'

const SlideReview = ({ pk, artifact, answer }) => {
  const form = useFormInstance()
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    if (answer && answer.length) {
      form.setFieldValue(pk, answer[0].text)
    }
  }, [answer])
  return (
    <Form.Item name={pk}>
      <Row>
        <Col span={8}>
          <Input.TextArea rows={10} />
        </Col>
        <Col offset={1}>
          {artifact && answer && answer.length && (
            <Document file={artifact}>
              {' '}
              <Page pageNumber={answer[0].page} width={400} />
            </Document>
          )}
        </Col>
      </Row>
    </Form.Item>
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
  const {
    text,
    question_type,
    is_required,
    sectionIdx,
    survey,
    setSurvey,
    studentView,
    ...questionProps
  } = question
  const { pk } = questionProps
  const [questionModalOpen, setQuestionModalOpen] = useState(false)

  const handleDeleteQuestion = () => {
    const questions = survey.sections[sectionIdx].questions.filter((question) => question.pk !== pk)
    const sections = survey.sections.map((section, i) =>
      i === sectionIdx ? { ...section, questions } : section
    )
    setSurvey({ ...survey, sections })
  }
  console.log(survey)
  return (
    <Form.Item label={text}>
      {/*rules={[{ required: is_required, message: 'Please complete the above question.' }]}>*/}
      <Row>
        <Col span={question_type !== 'SLIDEREVIEW' ? 12 : 20}>
          {question_type === 'MULTIPLECHOICE' && <MultipleChoice {...questionProps} />}
          {question_type === 'NUMBER' && <MultipleChoiceScale {...questionProps} />}
          {question_type === 'FIXEDTEXT' && <FixedText {...questionProps} />}
          {question_type === 'MULTIPLETEXT' && <MultiLineText {...questionProps} />}
          {question_type === 'TEXTAREA' && <TextArea {...questionProps} />}
          {question_type === 'SLIDEREVIEW' && (
            <SlideReview {...questionProps} artifact={survey.artifact} />
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
          sectionIdx={sectionIdx}
          open={questionModalOpen}
          setOpen={setQuestionModalOpen}
          survey={survey}
          setSurvey={setSurvey}
          editingQuestion={question}
        />
      </Row>
    </Form.Item>
  )
}

export default Question
