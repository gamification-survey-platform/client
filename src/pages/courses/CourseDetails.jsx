import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useMatch } from 'react-router'
import { getCourse } from '../../api/courses'
import { mockCourse as course } from '../../utils/mockData'

const CourseDetails = () => {
  const {
    params: { courseId }
  } = useMatch('/courses/:courseId')
  const [course, setCourse] = useState({
    course_name: '',
    course_number: '',
    semester: '',
    syllabus: ''
  })

  useEffect(async () => {
    try {
      const res = await getCourse(courseId)
      if (res.status === 200) {
        const course = res.data
        setCourse(course)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

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
