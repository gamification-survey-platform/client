import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import AddQuestionModal from './AddQuestionModal'
import Question from './question/Question'

const Section = ({ section, sectionIdx, survey, setSurvey }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { title, description, required, questions } = section
  let className = 'text-left ml-3'
  if (required) className += 'required-field'
  const style = {
    marginTop: -15,
    marginBottom: 0,
    padding: '0 5px',
    backgroundColor: 'white',
    width: 'fit-content'
  }
  return (
    <div className="border border-light mb-3">
      <Row>
        <Col xs="9">
          <h3 className={className} style={style}>
            {title}
          </h3>
        </Col>
        <Col xs="3">
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              fontSize: '2em',
              color: '#0a58ca',
              margin: 10,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
            onClick={() => setModalOpen(true)}
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
          />
          <AddQuestionModal
            sectionIdx={sectionIdx}
            show={modalOpen}
            setShow={setModalOpen}
            survey={survey}
            setSurvey={setSurvey}
          />
        </Col>
      </Row>
      <Row>
        <h4 className="text-left ml-3">{description}</h4>
      </Row>
      {questions.map((question, i) => (
        <Question key={i} {...question} />
      ))}
    </div>
  )
}

export default Section
