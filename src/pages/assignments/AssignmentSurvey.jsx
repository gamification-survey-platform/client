import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'
import { useMatch, useNavigate } from 'react-router'
import AddSectionModal from '../survey/AddSectionModal'
import Section from '../survey/Section'
import AddSurvey from '../survey/AddSurvey'
import { getSurvey, saveSurvey } from '../../api/survey'
import { mockSurvey } from '../../utils/mockData'

const AssignmentSurvey = () => {
  const [survey, setSurvey] = useState({
    instruction: '',
    information: '',
    sections: []
  })
  const [surveyExists, setSurveyExists] = useState(true)
  const {
    params: { courseId, assignmentId }
  } = useMatch('/courses/:courseId/assignments/:assignmentId/survey')
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await getSurvey({ courseId, assignmentId })
        if (res.status === 200) {
          if (assignmentId === '2') setSurvey(mockSurvey)
          else setSurveyExists(false)
        }
      } catch (e) {
        setShowError(true)
      }
    }
    fetchSurvey()
  }, [])

  const handleSaveSurvey = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await saveSurvey({ courseId, assignmentId, survey })
      if (res.status === 200) navigate(-1)
    } catch (e) {
      setShowError(true)
    }
  }

  return (
    <div>
      {surveyExists ? (
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
            <AddSectionModal
              show={modalOpen}
              setShow={setModalOpen}
              survey={survey}
              setSurvey={setSurvey}
            />
          </Row>
          <hr />
          {survey &&
            survey.sections &&
            survey.sections.map((section, i) => (
              <Section
                key={i}
                section={section}
                sectionIdx={i}
                survey={survey}
                setSurvey={setSurvey}
              />
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
