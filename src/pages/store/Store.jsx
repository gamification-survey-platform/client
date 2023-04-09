import { Typography, Row, Col, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import userSelector from '../../store/user/selectors'
import { getCourseRewards } from '../../api/rewards'
import coursesSelector from '../../store/courses/selectors'
import Reward from '../../components/Reward'

const Store = () => {
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const navigate = useNavigate()
  const [rewards, setRewards] = useState({})

  useEffect(() => {
    const fetchRewards = async () => {
      courses.forEach(async (course) => {
        const res = await getCourseRewards({ course_id: course.pk })
        if (res.status === 200)
          setRewards({
            ...rewards,
            [course.course_name]: res.data
          })
      })
    }
    if (user && user.is_staff) {
      navigate(-1)
    } else {
      fetchRewards()
    }
  }, [])
  return (
    <div className="m-5">
      <Typography.Title>Welcome to the Gamificaton Store</Typography.Title>
      {Object.keys(rewards).map((course_name, i) => {
        const courseRewards = rewards[course_name]
        return (
          <div key={i}>
            <Typography.Title level={4}>{course_name}</Typography.Title>
            <Row gutter={16} style={{ margin: '1rem' }}>
              {courseRewards.map((reward, i) => {
                return <Reward key={i} {...reward} />
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
