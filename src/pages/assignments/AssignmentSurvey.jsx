import { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import AddSectionModal from '../survey/AddSectionModal'
import surveySelector from '../../store/survey/selectors'
import Section from '../survey/Section'
import routeSelector from '../../store/routes/selectors'
import AddSurvey from '../survey/AddSurvey'

const AssignmentSurvey = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { survey } = useSelector(surveySelector)
  const router = useSelector(routeSelector)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      {survey ? (
        <Container className="mt-5">
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
            survey.sections.map((section, i) => <Section key={i} section={section} />)}
        </Container>
      ) : (
        <AddSurvey />
      )}
    </div>
  )
}

export default AssignmentSurvey
