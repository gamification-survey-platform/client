import { Row, Col, Typography } from 'antd'
import { EditTwoTone, PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useState } from 'react'
import AddQuestionModal from './AddQuestionModal'
import Question from './question/Question'
import AddSectionModal from './AddSectionModal'
import { useDispatch, useSelector } from 'react-redux'
import { surveySelector } from '../../store/survey/surveySlice'
import { deleteSection } from '../../store/survey/surveySlice'

const Section = ({ pk, studentView, artifact }) => {
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const survey = useSelector(surveySelector)
  const dispatch = useDispatch()

  const section = survey.sections.find((section) => section.pk === pk) || {
    title: '',
    is_required: false,
    questions: []
  }
  const { title, is_required, questions } = section
  let className = 'text-left mb-3'
  if (is_required) className += ' required-field'

  const handleDeleteSection = () => dispatch(deleteSection({ pk }))

  return (
    <div className="border border-light mb-3">
      <Row>
        <Col span={18}>
          <Typography.Title className={className} style={{ marginTop: -15 }} level={3}>
            {title}
          </Typography.Title>
        </Col>
        {!studentView && (
          <Col span={6}>
            <PlusCircleTwoTone
              twoToneColor="#0a58ca"
              style={{
                fontSize: '2em',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => setQuestionModalOpen(true)}
            />
            <EditTwoTone
              twoToneColor="#ffd43b"
              style={{
                fontSize: '2em',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => setSectionModalOpen(true)}
            />
            <DeleteTwoTone
              twoToneColor="#dc3545"
              style={{
                fontSize: '2em',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={handleDeleteSection}
            />
            <AddQuestionModal
              sectionPk={pk}
              open={questionModalOpen}
              setOpen={setQuestionModalOpen}
            />
            <AddSectionModal open={sectionModalOpen} setOpen={setSectionModalOpen} sectionPk={pk} />
          </Col>
        )}
      </Row>
      {questions &&
        questions.map((question, i) => (
          <Question
            key={i}
            {...question}
            sectionPk={pk}
            studentView={studentView}
            artifact={artifact}
          />
        ))}
    </div>
  )
}

export default Section
