import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import AddSectionModal from '../survey/AddSectionModal'
import surveySelector from '../../store/survey/selectors'
import Section from '../survey/Section'
import AddSurvey from '../survey/AddSurvey'
import { saveSurvey, resetSurvey } from '../../store/survey/surveySlice'

const AssignmentSurvey = () => {
  const { survey, status } = useSelector(surveySelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (status === 'failed') setShowError(true)
    else if (status === 'success') {
      dispatch(resetSurvey())
      navigate(-1)
    }
  }, [status])

  const handleSaveSurvey = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(saveSurvey(survey))
  }

  return (
    <div>
      {survey ? (
        <Container className="my-5">
          <Row>
            <Col xs="6">
              {survey && (
                <div>
                  <h2>{survey.instruction}</h2>
                  <h2>{survey.information}</h2>
                </div>
              )}
            </Col>
            <Col>
              <Button variant="warning" className="m-3">
                Edit Survey
              </Button>
              <Button variant="info" className="m-3">
                Student View
              </Button>
              <Button variant="primary" className="m-3" onClick={() => setModalOpen(true)}>
                Add Section
              </Button>
            </Col>
            <AddSectionModal show={modalOpen} setShow={setModalOpen} />
          </Row>
          <hr />
          {survey &&
            survey.sections &&
            survey.sections.map((section, i) => (
              <Section key={i} section={section} sectionIdx={i} />
            ))}
          <Button onClick={handleSaveSurvey}>Save Survey</Button>
          {showError && <Alert variant="danger">Failed to create course.</Alert>}
        </Container>
      ) : (
        <AddSurvey />
      )}
    </div>
  )
}

export default AssignmentSurvey
