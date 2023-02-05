import { Container } from 'react-bootstrap'
import { mockCourse as course } from '../utils/mockData'

const CourseDetails = () => {
  return (
    <Container className="mt-5">
      <h2>{course.course_name}</h2>
      <h3>{course.course_number}</h3>
      <h4>{course.semester}</h4>
      <hr />
      <div className="text-left">
        <p className="font-weight-bold">Syllabus</p>
        <p>{course.syllabus}</p>
      </div>
    </Container>
  )
}

export default CourseDetails
