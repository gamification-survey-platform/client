import { Card, Divider, Image, Button, Row } from 'antd'
import { useState } from 'react'
import config from '../utils/constants'
import Calendar from '../assets/calendar.jpg'
import Computer from '../assets/computer.png'
import TreasureChest from '../assets/treasure_chest.png'
import { useDispatch, useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import RewardsModal from '../pages/courses/RewardsModal'
import { deleteCourseReward, purchaseCourseReward } from '../api/rewards'
import coursesSelector from '../store/courses/selectors'
import { addCoursePoints } from '../store/courses/coursesSlice'

const Cover = ({ type, picture }) => {
  if (type === 'Other' && picture) {
    return <Image preview={false} src={`${picture}`} className="p-5" />
  } else if (type === 'Late Submission') {
    return <Image preview={false} src={Calendar} className="p-5" />
  } else if (type === 'Bonus') {
    return <Image preview={false} src={TreasureChest} className="p-5" />
  }
  return null
}

const Reward = ({ rewards, setRewards, ...reward }) => {
  const {
    pk,
    name,
    belong_to,
    description,
    inventory,
    is_active,
    type,
    points,
    picture = null
  } = reward
  const dispatch = useDispatch()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_name }) => course_name === belong_to)
  const { points: userPoints } = course
  const [open, setOpen] = useState(false)
  const deleteReward = async () => {
    try {
      const res = await deleteCourseReward({
        course_id: course.pk,
        reward_pk: pk
      })
      if (res.status === 200) {
        const newRewards = rewards.filter((r) => r.pk !== pk)
        setRewards(newRewards)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const purchaseReward = async () => {
    try {
      const res = await purchaseCourseReward({
        reward_pk: pk
      })
      if (res.status === 200) {
        // Update rewards and user exp points if purchase successful
        const newRewards = rewards.filter((r) => r.pk !== pk)
        const newInventory = inventory === 'Unlimited' ? 'Unlimited' : inventory - 1
        setRewards([...newRewards, { ...reward, inventory: newInventory }])
        dispatch(addCoursePoints({ course_id: course.pk, points: userPoints - points }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card className="m-1 w-25" cover={<Cover type={type} picture={picture} />}>
      <Card.Meta title={name} />
      <div className="m-1 text-left">
        <Divider />
        <strong>For course</strong>
        <p>{belong_to}</p>
        <strong>Description:</strong>
        <p>{description}</p>
        <strong>Cost: {points}</strong>
        <Divider />
        <strong className="text-success">{inventory} remaining</strong>
      </div>
      {course.user_role === 'Instructor' ? (
        <div className="text-center">
          <Divider />
          <Row justify="center">
            <Button type="primary" onClick={() => setOpen(true)} className="m-1">
              Edit
            </Button>
            <Button danger onClick={deleteReward} className="m-1">
              Delete
            </Button>
          </Row>
          <RewardsModal
            open={open}
            setOpen={setOpen}
            editingReward={reward}
            rewards={rewards}
            setRewards={setRewards}
          />
        </div>
      ) : (
        <div className="text-center">
          <Divider />
          <Row justify="center">
            <Button
              type="primary"
              onClick={purchaseReward}
              disabled={userPoints < points || !is_active || inventory === 0}
              className="m-1">
              Purchase
            </Button>
          </Row>
        </div>
      )}
    </Card>
  )
}

export default Reward
