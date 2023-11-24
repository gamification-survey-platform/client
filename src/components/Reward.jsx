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
  const imageStyle = { width: '100%', height: '200px', objectFit: 'cover' };
  if (type === 'Other' && picture) {
    return <Image preview={false} src={`${picture}`} style={imageStyle} />
  } else if (type === 'Late Submission') {
    return <Image preview={false} src={Calendar} style={imageStyle} />
  } else if (type === 'Bonus') {
    return <Image preview={false} src={TreasureChest} style={imageStyle} />
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
  const isUserInstructor = course?.is_staff;
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
    <Card
      className="m-1 w-25"
      style={{ color: inventory === 0 ? 'grey' : 'black', width: '250px', margin: '5px' }}
      cover={<Cover type={type} picture={picture} />}>
      <Card.Meta title={name} style={{ color: inventory === 0 ? 'grey!important' : 'black' }} />
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
      {isUserInstructor ? (
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
  );
};

export default Reward;