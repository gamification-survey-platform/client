import { Col, Container, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAssignment } from '../../api/assignments'
import coursesSelector from '../../store/courses/selectors'

const AssignmentDetails = () => {
  const { assignment_id, course_id } = useParams()
  const [assignment, setAssignment] = useState({
    assignment_name: '',
    assignment_type: '',
    description: '',
    total_score: 0,
    weight: 0,
    date_due: new Date()
  })
  const [error, setShowError] = useState(false)
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  useEffect(() => {
    const fetchAssignment = async () => {
      const res = await getAssignment(selectedCourse.pk, assignment_id)
      if (res.status === 200) setAssignment(res.data.assignment)
      else setShowError(true)
    }
    fetchAssignment()
  }, [])

  return (
    <Container className="m-3">
      <Row>
        <Col xs="9">
          <h3>{assignment.assignment_name}</h3>
          <hr />
          <Row>
            <Col>Type: {assignment.assignment_type}</Col>
          </Row>
          <hr />
          <Row>
            <Col>Total Score: {assignment.total_score}</Col>
            <Col>Weight: {assignment.weight}</Col>
            <Col>Due date: {assignment.date_due.toDateString()}</Col>
          </Row>
          <hr />
          <p>{assignment.description}</p>
        </Col>
        <Col xs="2" className="mt-5">
          <h4>Admin Page:</h4>
          <h5>Comments:</h5>
        </Col>
      </Row>
    </Container>
  )
}

export default AssignmentDetails
