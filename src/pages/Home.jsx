import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import DefaultImage from '../assets/default_course.jpg'
import userSelector from '../store/user/selectors'
import { setCourses } from '../store/courses/coursesSlice'
import coursesSelector from '../store/courses/selectors'
import { getUserCourses } from '../api/courses'
import { getUserArtifactReviews } from '../api/artifactReview'
import { Space, Row, Col, Card, Image, Button } from 'antd'
import Spinner from '../components/Spinner'
import StudentReviewsList from '../components/StudentReviewsList'

const Home = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [artifactReviews, setArtifactReviews] = useState([])
  const [spin, setSpin] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadData = async () => {
      setSpin(true)
      try {
        const res = await getUserCourses(user.andrew_id)
        if (res.status === 200) dispatch(setCourses(res.data))
      } catch (e) {
        console.error(e.message)
      }
      try {
        const res = await getUserArtifactReviews(user.andrew_id)
        if (res.status === 200) {
          setArtifactReviews(res.data)
        }
      } catch (e) {
        console.error(e.message)
      }
      setSpin(false)
    }

    loadData()
  }, [])

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <Row>
      <Col span={user.is_staff ? 24 : 17}>
        <Row gutter={10} className="m-3" justify="space-between">
          {courses.map((course, i) => {
            return (
              <Col key={i} span={6} className="mx-3 my-3">
                <Card className="text-center w-100" cover={<Image src={DefaultImage} />} key={i}>
                  <Space direction="vertical" size="middle" align="center">
                    <Row justify="center" className="text-center">
                      <p>{course.course_name}</p>
                    </Row>
                    <Row justify="center">
                      <Link to={`/courses/${course.course_number}/details`}>
                        <Button type="primary">Course Details</Button>
                      </Link>
                    </Row>
                    <Row justify="center">
                      <Link to={`/courses/${course.course_number}/assignments`}>
                        <Button>Assignments</Button>
                      </Link>
                    </Row>
                  </Space>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Col>
      {user.is_staff ? null : (
        <StudentReviewsList artifactReviews={artifactReviews} showCompleted={false} />
      )}
    </Row>
  )
}

export default Home
