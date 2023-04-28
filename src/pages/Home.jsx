import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import DefaultImage from '../assets/default_course.jpg'
import userSelector from '../store/user/selectors'
import { setCourses } from '../store/courses/coursesSlice'
import coursesSelector from '../store/courses/selectors'
import { getUserCourses } from '../api/courses'
import { Space, Row, Col, Card, Image, Button } from 'antd'
import Spinner from '../components/Spinner'

const Home = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [spin, setSpin] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCourses = async () => {
      setSpin(true)
      try {
        const res = await getUserCourses(user.andrew_id)
        if (res.status === 200) dispatch(setCourses(res.data))
      } catch (e) {
        console.error(e.message)
      }
      setSpin(false)
    }
    fetchCourses()
  }, [])
  return spin ? (
    <Spinner show={spin} />
  ) : (
    <Row>
      <Col span={20}>
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
      <Col span={4}>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
        <Row>
          Stuff
        </Row>
      </Col>
    </Row>
  )
}

export default Home
