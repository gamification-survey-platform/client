import { Card, Divider, Image } from 'antd'
import config from '../utils/constants'
import Calendar from '../assets/calendar.jpg'
import Computer from '../assets/computer.png'
import TreasureChest from '../assets/treasure_chest.png'

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
    name,
    belong_to,
    description,
    inventory,
    is_active,
    type,
    exp_point,
    icon = null
  } = reward
  console.log(reward)
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
    </Card>
  )
}

export default Reward
