import { Typography, Divider } from 'antd'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'

const CourseDetails = () => {
  const { course_id } = useParams()

  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)

  return (
    <div className="m-5 text-center">
      <Typography.Title level={2}>{course.course_name}</Typography.Title>
      <Typography.Title level={3}>{course.course_number}</Typography.Title>
      <Typography.Title level={4}>{course.semester}</Typography.Title>
      <Divider />
      <div className="text-left">
        <Typography.Text className="font-weight-bold">Syllabus:</Typography.Text>
        <br />
        <Typography.Text>{course.syllabus}</Typography.Text>
      </div>
    </div>
  )
}

export default CourseDetails
