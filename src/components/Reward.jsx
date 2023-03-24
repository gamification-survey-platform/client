import { Card, Divider } from 'antd'
import { GiTrophy } from 'react-icons/gi'

const Reward = (reward) => {
  const { title, description, xp_points, icon = null } = reward
  return (
    <Card
      className="m-1 w-25"
      cover={
        <h2 className="m-1">
          <GiTrophy />
        </h2>
      }>
      <Card.Meta title={title} />
      <div className="m-1 text-left">
        <Divider />
        <strong>Description:</strong>
        <p>{description}</p>
        <strong>Cost: {xp_points}</strong>
      </div>
    </Card>
  )
}

export default Reward
