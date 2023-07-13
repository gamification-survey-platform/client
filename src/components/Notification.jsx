import { Row } from 'antd'
import { FaHandPointRight } from 'react-icons/fa'
import dayjs from 'dayjs'

const PokeNotification = ({ text, sender_andrew_id, timestamp }) => {
  const formattedTimestamp = dayjs(timestamp).format('h:mm A d/M/YY')
  return (
    <div>
      <Row>{sender_andrew_id} poked you!</Row>
      <Row>
        <FaHandPointRight size={'1.5em'} className="mr-3" style={{ color: 'gold' }} />
        {text}
      </Row>
      <div className="text-right text-secondary">{formattedTimestamp}</div>
    </div>
  )
}

const MessageNotification = ({ text }) => {
  return <div>{text}</div>
}

const Notification = ({ type, ...rest }) => {
  return type === 'POKE' ? <PokeNotification {...rest} /> : <MessageNotification {...rest} />
}

export default Notification
