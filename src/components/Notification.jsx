import { Row } from 'antd'
import { FaHandPointRight } from 'react-icons/fa'
import dayjs from 'dayjs'

const UnreadCircle = () => (
  <div
    style={{
      height: 15,
      width: 15,
      borderRadius: '50%',
      backgroundColor: '#bae0ff',
      marginRight: 10,
      marginTop: 3
    }}></div>
)

const PokeNotification = ({ text, sender_andrew_id, timestamp, is_read }) => {
  const formattedTimestamp = dayjs(timestamp).format('h:mm A d/M/YY')
  return (
    <div>
      <Row className="font-weight-bold">
        {!is_read ? <UnreadCircle /> : null}
        {sender_andrew_id} poked you:
      </Row>
      <Row>
        <FaHandPointRight size={'1.5em'} className="mr-3" style={{ color: 'gold' }} />
        {text}
      </Row>
      <div className="text-right text-secondary">{formattedTimestamp}</div>
    </div>
  )
}

const MessageNotification = ({ text, sender_andrew_id, timestamp, is_read }) => {
  const formattedTimestamp = dayjs(timestamp).format('h:mm A d/M/YY')
  return (
    <div>
      <Row className="font-weight-bold">
        {!is_read ? <UnreadCircle /> : null}
        {sender_andrew_id} sent you a message:
      </Row>
      <Row>{text}</Row>
      <div className="text-right text-secondary">{formattedTimestamp}</div>
    </div>
  )
}

const Notification = ({ type, ...rest }) => {
  return type === 'POKE' ? <PokeNotification {...rest} /> : <MessageNotification {...rest} />
}

export default Notification
