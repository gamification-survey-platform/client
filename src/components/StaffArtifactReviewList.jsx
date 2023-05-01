import { useEffect, useState } from 'react'
import { getArtifactReviews, getUserArtifactReviews } from '../api/artifactReview'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import coursesSelector from '../store/courses/selectors'

const StaffArtifactReviewList = () => {
  const [artifactReviews, setArtifactReviews] = useState([])
  const { course_id: courseNumber, assignment_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => courseNumber === course_number)
  useEffect(() => {
    const fetchArtifactReviews = async () => {
      const res = await getArtifactReviews({ course_id: course.pk, assignment_id })
      console.log(res.data)
    }
    fetchArtifactReviews()
  }, [])

  return <div>Staff Artifact Review List</div>
}

export default StaffArtifactReviewList
