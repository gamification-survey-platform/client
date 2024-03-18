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
import { getTheme } from '../api/theme'
import { setColorTheme, setCursor, setIconTheme, setTheme } from '../store/theme/themeSlice'
import { gamified_mode } from '../gamified'
import TriviaPopup from './TriviaPopup'

const Home = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [artifactReviews, setArtifactReviews] = useState([])
  const [spin, setSpin] = useState(false)
  const dispatch = useDispatch()

  gamified_mode(user)

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
      try {
        const res = await getTheme()
        if (res.status === 200) {
          const { cursor, ...rest } = res.data
          const colors = {}
          const otherFields = {}
          cursor && dispatch(setCursor(cursor))
          Object.keys(rest).forEach((k) => {
            if (k.startsWith('color')) colors[k] = rest[k]
            else if (k.includes('item') || k.includes('target'))
              dispatch(setIconTheme({ field: k, url: rest[k] }))
            else otherFields[k] = rest[k]
          })
          Object.keys(colors).length && dispatch(setColorTheme(colors))
          dispatch(setTheme(otherFields))
        }
      } catch (e) {
        console.error(e.message)
      }
      setSpin(false)
    }

    loadData()
  }, [])

  const imageStyle = { width: '100%', height: '150px', objectFit: 'cover' }
  const cardContentStyle = { height: '200px' }
  return spin ? (
    <Spinner show={spin} />
  ) : (
    <Row>
      <Col span={user.is_staff ? 24 : 17}>
        <Row gutter={10} className="m-3">
          {courses.map((course, i) => {
            return (
              <Col key={i} span={6} className="mx-3 my-3">
                <Card
                  className="text-center w-100"
                  cover={
                    <Image
                      preview={false}
                      src={course.picture ? course.picture : DefaultImage}
                      style={imageStyle}
                    />
                  }
                  key={i}
                  style={{ minWidth: 200, overflow: 'hidden' }}>
                  <div style={cardContentStyle}>
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
                      <Row justify="center">
                        {!user.is_staff && gamified_mode(user) ? (
                          <Button>
                            <TriviaPopup courseId={course.course_number} courses={courses} />
                          </Button>
                        ) : null}
                      </Row>
                    </Space>
                  </div>
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
