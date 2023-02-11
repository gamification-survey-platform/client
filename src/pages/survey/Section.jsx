import { Container, Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const Section = ({ section }) => {
  const { title, description } = section
  return (
    <div className="border border-light">
      <Row>
        <Col xs="9">
          <h3 className="text-left ml-3" style={{ marginTop: -15, marginBottom: 0 }}>
            {title}
          </h3>
        </Col>
        <Col xs="3">
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              fontSize: '2em',
              color: '#0a58ca',
              margin: 10,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
            onClick={console.log}
          />
          <FontAwesomeIcon
            icon={faPenToSquare}
            style={{
              fontSize: '2em',
              color: '#ffc107',
              margin: 10,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          />
          <FontAwesomeIcon
            icon={faTrash}
            style={{
              fontSize: '2em',
              color: '#dc3545',
              margin: 10,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          />
        </Col>
      </Row>
      <Row>
        <h4 className="text-left ml-3">{description}</h4>
      </Row>
    </div>
  )
}

export default Section
