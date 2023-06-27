import { Typography, Row, Button, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import userSelector from '../../store/user/selectors'
import { getCourseRewards } from '../../api/rewards'
import coursesSelector from '../../store/courses/selectors'
import Reward from '../../components/Reward'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

const Store = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const navigate = useNavigate()
  const [courseNames, setCourseNames] = useState([])
  const [rewards, setRewards] = useState([])

  useEffect(() => {
    const fetchRewards = async () => {
      courses.forEach(async (course) => {
        const res = await getCourseRewards({ course_id: course.pk })
        if (res.status === 200) {
          setCourseNames([...courseNames, course.course_name])
          setRewards([...rewards, ...res.data])
        }
      })
    }
    fetchRewards()
  }, [])

  return (
    <div className="m-5">
      <Row justify="space-around">
        <Typography.Title>Welcome to the Gamificaton Store</Typography.Title>
        <LinkContainer to={'/purchases'}>
          <Button type="primary">View My Purchases</Button>
        </LinkContainer>
      </Row>
      {courseNames.map((course_name, i) => {
        const courseRewards = rewards.filter((r) => r.belong_to === course_name)
        const coursePoints = courses.find((course) => course.course_name === course_name).points
        return (
          <div key={i}>
            <Typography.Title level={4}>{course_name}</Typography.Title>
            <Typography.Title level={5}>Purchasing power: {coursePoints}</Typography.Title>
            <Row gutter={16} style={{ margin: '1rem' }}>
              {courseRewards.map((reward, i) => {
                return <Reward key={i} {...reward} rewards={rewards} setRewards={setRewards} />
              })}
            </Row>
            <Divider />
          </div>
        )
      })}
    </div>
  )
}

export default Store
