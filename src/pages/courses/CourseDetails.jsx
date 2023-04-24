import { useEffect, useState } from 'react'
import { Typography, Divider, Button, Row } from 'antd'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import { getCourseRewards } from '../../api/rewards'
import Reward from '../../components/Reward'
import RewardsModal from './RewardsModal'
import userSelector from '../../store/user/selectors'

const CourseDetails = () => {
  const { course_id } = useParams()
  const user = useSelector(userSelector)

  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)
  const [rewards, setRewards] = useState([])
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false)

  useEffect(() => {
    const fetchRewards = async () => {
      if (user.is_staff) {
        const res = await getCourseRewards({ course_id: course.pk })
        if (res.status === 200) setRewards(res.data)
      }
    }
    fetchRewards()
  }, [rewardsModalOpen])
  return (
    <div className="m-5 text-center">
      <Typography.Title level={2}>{course.course_name}</Typography.Title>
      <Typography.Title level={3}>{course.course_number}</Typography.Title>
      <Typography.Title level={4}>{course.semester}</Typography.Title>
      <Divider />
      <div className="text-left">
        <Typography.Text className="font-weight-bold">Syllabus:</Typography.Text>
        <br />
        <Typography.Text>{course.syllabus}</Typography.Text>
      </div>
      <Divider />
      {course && user.is_staff ? (
        <div>
          <Typography.Title level={2}>Current Rewards</Typography.Title>
          <Row gutter={16} style={{ margin: '1rem' }}>
            {rewards.map((r, i) => (
              <Reward {...r} key={i} rewards={rewards} setRewards={setRewards} />
            ))}
          </Row>
          <Button type="primary" onClick={() => setRewardsModalOpen(true)}>
            Add Reward
          </Button>
          <RewardsModal
            open={rewardsModalOpen}
            setOpen={setRewardsModalOpen}
            rewards={rewards}
            setRewards={setRewards}
          />
        </div>
      ) : null}
    </div>
  )
}

export default CourseDetails
