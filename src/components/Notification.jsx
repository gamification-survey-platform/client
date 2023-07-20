import { Row } from 'antd'
import { FaHandPointRight } from 'react-icons/fa'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

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

const FeedbackRequestNotification = ({
  text,
  sender_andrew_id,
  sender,
  timestamp,
  is_read,
  id,
  ...rest
}) => {
  const formattedTimestamp = dayjs(timestamp).format('h:mm A d/M/YY')
  const data = JSON.parse(text, (k, v) => (typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10)))
  const navigate = useNavigate()
  const handleClick = () => {
    const { course_number, assignment_id, artifact_review } = data
    navigate(`/courses/${course_number}/assignments/${assignment_id}/reviews/${artifact_review}`, {
      state: { ...data, sender, id }
    })
  }
  return (
    <div onClick={handleClick}>
      <Row className="font-weight-bold">
        {!is_read ? <UnreadCircle /> : null}
        {sender_andrew_id} requested feedback for one of your artifact reviews.
      </Row>
      <Row>{data.text}</Row>
      <Row>Click here navigate to your review.</Row>
      <div className="text-right text-secondary">{formattedTimestamp}</div>
    </div>
  )
}

const FeedbackResponseNotification = ({
  text,
  sender_andrew_id,
  sender,
  timestamp,
  is_read,
  ...rest
}) => {
  const formattedTimestamp = dayjs(timestamp).format('h:mm A d/M/YY')
  const data = JSON.parse(text, (k, v) => (typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10)))
  const navigate = useNavigate()
  const handleClick = () => {
    const { course_number, assignment_id, artifact } = data
    navigate(
      `/courses/${course_number}/assignments/${assignment_id}/artifacts/${artifact}/reports`,
      {
        state: { ...data, sender }
      }
    )
  }
  return (
    <div onClick={handleClick}>
      <Row className="font-weight-bold">
        {!is_read ? <UnreadCircle /> : null}
        {sender_andrew_id} has provided feedback on your submission.
      </Row>
      <Row>{data.text}</Row>
      <Row>Click here navigate to your report.</Row>
      <div className="text-right text-secondary">{formattedTimestamp}</div>
    </div>
  )
}

const Notification = ({ type, ...rest }) => {
  return (
    <>
      {type === 'POKE' && <PokeNotification {...rest} />}
      {type === 'FEEDBACK_REQUEST' && <FeedbackRequestNotification {...rest} />}
      {type === 'FEEDBACK_RESPONSE' && <FeedbackResponseNotification {...rest} />}
    </>
  )
}

export default Notification
