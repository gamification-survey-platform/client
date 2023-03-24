import { useEffect, useState } from 'react'
import { Typography, Divider, Button } from 'antd'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import { isInstructorOrTA } from '../../utils/roles'
import { getCourseRewards } from '../../api/rewards'
import Reward from '../../components/Reward'
import RewardsModal from './RewardsModal'

const CourseDetails = () => {
  const { course_id } = useParams()

  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)
  const [rewards, setRewards] = useState([])
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false)

  useEffect(() => {
    const fetchRewards = async () => {
      if (isInstructorOrTA(course.user_role)) {
        const res = await getCourseRewards({ course_id })
        console.log('here')
        if (res.status === 200) setRewards(res)
      }
    }
    fetchRewards()
    setRewards([
      {
        title: 'Extra Day for Assignment 1',
        description: 'You get one more day for assignment 1',
        xp_points: 10
      }
    ])
  }, [])
  console.log(rewards)
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
      {course && isInstructorOrTA(course.user_role) ? (
        <div>
          <Typography.Title level={2}>Current Rewards</Typography.Title>
          <>
            {rewards.map((r, i) => (
              <Reward {...r} key={i} />
            ))}
          </>
          <Button type="primary" onClick={() => setRewardsModalOpen(true)}>
            Add Reward
          </Button>
          <RewardsModal
            open={rewardsModalOpen}
            setOpen={setRewardsModalOpen}
            course_id={course_id}
            setRewards={setRewards}
          />
        </div>
      ) : null}
    </div>
  )
}

export default CourseDetails
