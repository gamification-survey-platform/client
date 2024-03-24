import { Typography, Row, Button, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import userSelector from '../../store/user/selectors'
import { getCourseRewards } from '../../api/rewards'
import coursesSelector from '../../store/courses/selectors'
import Reward from '../../components/Reward'
import { LinkContainer } from 'react-router-bootstrap'
import { gamified_mode } from '../../gamified'

const Store = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const navigate = useNavigate()
  const [courseNames, setCourseNames] = useState([])
  const [rewards, setRewards] = useState([])

  useEffect(() => {
    const fetchRewards = async () => {
      const fetchPromises = courses.map(async (course) => {
        const res = await getCourseRewards({ course_id: course.pk })
        if (res.status === 200) {
          return { courseName: course.course_name, rewards: res.data }
        } else {
          return { courseName: course.course_name, rewards: [] }
        }
      })
      Promise.all(fetchPromises).then(results => {
        const newCourseNames = results.map(r => r.courseName)
        const newRewards = results.flatMap(r => r.rewards)
        setCourseNames(newCourseNames)
        setRewards(newRewards)
      })
    }
  
    fetchRewards()
  }, [])

  return (
    <div className="m-5">
      {gamified_mode(user) ? (
        <div>
          <Row justify="space-around">
            <Typography.Title>Welcome to the Gamification Store</Typography.Title>
            <LinkContainer to={'/purchases'}>
              <Button type="primary">View My Purchases</Button>
            </LinkContainer>
          </Row>
          {courseNames.map((course_name, i) => {
            const availableRewards = rewards.filter(
              (r) => r.belong_to === course_name && r.inventory > 0
            )
            const unavailableRewards = rewards.filter(
              (r) => r.belong_to === course_name && r.inventory === 0
            )
            const coursePoints = courses.find((course) => course.course_name === course_name).points
            return (
              <div key={i}>
                <Typography.Title level={4}>{course_name}</Typography.Title>
                <Typography.Title level={5}>Purchasing power: {coursePoints}</Typography.Title>
                <Row gutter={16} style={{ margin: '1rem' }}>
                  {availableRewards.map((reward, i) => {
                    return <Reward key={i} {...reward} rewards={rewards} setRewards={setRewards} />
                  })}
                </Row>
                <Row gutter={16} style={{ margin: '1rem' }}>
                  {unavailableRewards.map((reward, i) => {
                    return <Reward key={i} {...reward} rewards={rewards} setRewards={setRewards} />
                  })}
                </Row>
                <Divider />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default Store
