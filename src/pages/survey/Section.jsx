import { Row, Col, Typography } from 'antd'
import { EditTwoTone, PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useState } from 'react'
import AddQuestionModal from './AddQuestionModal'
import Question from './question/Question'
import AddSectionModal from './AddSectionModal'
import { useSelector } from 'react-redux'
import userSelector from '../../store/user/selectors'

const Section = ({ sectionIdx, survey, setSurvey, studentView }) => {
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const section = survey.sections[sectionIdx]
  const { title, is_required, questions } = section
  let className = 'text-left mb-3'
  if (is_required) className += ' required-field'

  const handleDeleteSection = () => {
    const sections = survey.sections.filter((_, i) => i !== sectionIdx)
    setSurvey({ ...survey, sections })
  }

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
              sectionIdx={sectionIdx}
              open={questionModalOpen}
              setOpen={setQuestionModalOpen}
              survey={survey}
              setSurvey={setSurvey}
            />
            <AddSectionModal
              open={sectionModalOpen}
              setOpen={setSectionModalOpen}
              survey={survey}
              setSurvey={setSurvey}
              editingSection={section}
            />
          </Col>
        )}
      </Row>
      {questions.map((question, i) => (
        <Question
          key={i}
          {...question}
          survey={survey}
          setSurvey={setSurvey}
          sectionIdx={sectionIdx}
          studentView={studentView}
        />
      ))}
    </div>
  )
}

export default Section
