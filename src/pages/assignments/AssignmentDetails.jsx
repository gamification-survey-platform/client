import { Col, Container, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getAssignments } from '../../api/assignments'
import { mockAssignmentDetail } from '../../utils/mockData'

const AssignmentDetails = () => {
  const { assignment_id, course_id } = useParams()
  const [assignment, setAssignment] = useState({
    title: '',
    type: '',
    submission: '',
    totalScore: 0,
    weight: 0,
    due: new Date(),
    description: '',
    comments: [],
    artifactList: []
  })
  const [error, setShowError] = useState(false)
  useEffect(() => {
    const fetchAssignment = async () => {
      const res = await getAssignments(course_id, assignment_id)
      if (res.status === 200) setAssignment(mockAssignmentDetail)
      else setShowError(true)
    }
    fetchAssignment()
  }, [])

  return (
    <Container className="m-3">
      <Row>
        <Col xs="9">
          <h3>{assignment.title}</h3>
          <hr />
          <Row>
            <Col>Type: {assignment.type}</Col>
            <Col>Submission: {assignment.submission}</Col>
          </Row>
          <hr />
          <Row>
            <Col>Total Score: {assignment.totalScore}</Col>
            <Col>Weight: {assignment.weight}</Col>
            <Col>Due date: {assignment.due.toDateString()}</Col>
          </Row>
          <hr />
          <p>{assignment.description}</p>
        </Col>
        <Col xs="2" className="mt-5">
          <h4>Admin Page:</h4>
          {assignment.artifactList.map((a, i) => (
            <p key={i}>{a}</p>
          ))}
          <h5>Comments:</h5>
          {assignment.comments.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
        </Col>
      </Row>
    </Container>
  )
}

export default AssignmentDetails
