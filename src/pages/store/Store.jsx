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
    if (user && user.is_staff) {
      navigate(-1)
    } else {
      fetchRewards()
    }
  }, [])
  return (
    <div className="m-5">
      <Typography.Title>Welcome to the Gamificaton Store</Typography.Title>
      {courseNames.map((course_name, i) => {
        const courseRewards = rewards.filter((r) => r.belong_to === course_name)
        return (
          <div key={i}>
            <Typography.Title level={4}>{course_name}</Typography.Title>
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