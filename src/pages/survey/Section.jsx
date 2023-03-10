import { Row, Col } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
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
  let className = 'text-left ml-3'
  if (is_required) className += ' required-field'
  const style = {
    marginTop: -15,
    marginBottom: 0,
    padding: '0 5px',
    width: 'fit-content'
  }

  const handleDeleteSection = () => {
    const sections = survey.sections.filter((_, i) => i !== sectionIdx)
    setSurvey({ ...survey, sections })
  }

  return (
    <div className="border border-light mb-3">
      <Row>
        <Col span={18}>
          <h3 className={className} style={style}>
            {title}
          </h3>
        </Col>
        {!studentView && (
          <Col span={6}>
            <FontAwesomeIcon
              icon={faPlus}
              style={{
                fontSize: '2em',
                color: '#0a58ca',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => setQuestionModalOpen(true)}
            />
            <FontAwesomeIcon
              icon={faEdit}
              style={{
                fontSize: '2em',
                color: '#ffd43b',
                margin: 10,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => setSectionModalOpen(true)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              style={{
                fontSize: '2em',
                color: '#dc3545',
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
