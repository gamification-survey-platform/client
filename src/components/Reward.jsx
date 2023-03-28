import { Card, Divider, Image, Button, Row } from 'antd'
import { useState } from 'react'
import config from '../utils/constants'
import Calendar from '../assets/calendar.jpg'
import Computer from '../assets/computer.png'
import TreasureChest from '../assets/treasure_chest.png'
import { useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import RewardsModal from '../pages/courses/RewardsModal'

const Cover = ({ type, icon }) => {
  if ((type === 'Badge' || type === 'Other') && icon) {
    return <Image preview={false} src={`${config.FILE_URL}${icon}`} />
  } else if (type === 'Late Submission') {
    return <Image preview={false} src={Calendar} />
  } else if (type === 'Bonus') {
    return <Image preview={false} src={TreasureChest} />
  } else if (type === 'Theme') {
    return <Image preview={false} src={Computer} />
  }
  return null
}

const Reward = (reward) => {
  const {
    pk,
    name,
    belong_to,
    description,
    inventory,
    is_active,
    type,
    exp_point,
    icon = null
  } = reward

  const user = useSelector(userSelector)
  const [open, setOpen] = useState(false)

  const deleteReward = async () => {
    try {
      await deleteReward({ reward_pk: pk })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card className="m-1 w-25" cover={<Cover type={type} icon={icon} />}>
      <Card.Meta title={name} />
      <div className="m-1 text-left">
        <Divider />
        <strong>For course</strong>
        <p>{belong_to}</p>
        <strong>Description:</strong>
        <p>{description}</p>
        <strong>Cost: {exp_point}</strong>
        <Divider />
        <strong className="text-success">{inventory} remaining</strong>
      </div>
      {user.is_staff ? (
        <div className="text-center">
          <Divider />
          <Row justify="center">
            <Button type="primary" onClick={() => setOpen(true)} className="m-1">
              Edit
            </Button>
            <Button danger onClick={() => setOpen(true)} className="m-1">
              Delete
            </Button>
          </Row>
          <RewardsModal open={open} setOpen={setOpen} editingReward={reward} />
        </div>
      ) : null}
    </Card>
  )
}

export default Reward
