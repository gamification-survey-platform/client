import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import DefaultImage from '../assets/default_course.jpg'
import userSelector from '../store/user/selectors'
import { setCourses } from '../store/courses/coursesSlice'
import coursesSelector from '../store/courses/selectors'
import { getUserCourses } from '../api/courses'
import { getUserArtifactReviews } from '../api/artifactReview'
import { Space, Row, Col, Card, Image, Button, Typography, Tag } from 'antd'
import Spinner from '../components/Spinner'

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
        if (res.status === 200) setArtifactReviews(res.data)
      } catch (e) {
        console.error(e.message)
      }
      setSpin(false)
    }

    loadData()
  }, [])

  const pendingReviews = artifactReviews.filter((r) => r.status === 'INCOMPLETE')
  const lateReviews = artifactReviews.filter((r) => r.status === 'LATE')
  const tagStyles = {
    borderWidth: 'medium',
    fontWeight: 'bold'
  }

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <Row>
      <Col span={18}>
        <Row gutter={10} justify="space-around" style={{ margin: '1rem' }}>
          {courses.map((course, i) => {
            return (
              <Col key={i} span={8} className="mx-3">
                <Card
                  className="text-center"
                  cover={<Image src={DefaultImage} />}
                  style={{ width: 300 }}
                  key={i}>
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
      <Col span={6} className="border-left p-5 my-3">
        <Space direction="vertical" size="middle" className="text-center">
          <Typography.Title level={5}>Pending Surveys</Typography.Title>
          {pendingReviews.map((review) => {
            const { course_id, assignment_id } = review
            console.log(review)
            return (
              <Link
                key={review.id}
                to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                <Tag role="button" color="gold" style={tagStyles}>
                  {review.reviewing}
                </Tag>
              </Link>
            )
          })}
          <Typography.Title level={5}>Late Surveys</Typography.Title>
          {lateReviews.map((review, i) => {
            const { course_id, assignment_id } = review
            return (
              <Link
                key={review.id}
                to={`/courses/${course_id}/assignments/${assignment_id}/reviews/${review.id}`}>
                <Tag role="button" color="volcano" style={tagStyles}>
                  {review.reviewing}
                </Tag>
              </Link>
            )
          })}
        </Space>
      </Col>
    </Row>
  )
}

export default Home
