import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'

const AssignmentReport = () => {
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)

  return <div>Assignment Report</div>
}

export default AssignmentReport
