import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'

const CourseDetails = () => {
  const { course_id } = useParams()

  const { courses } = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)

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
