import { Form, Row, Col } from 'react-bootstrap'

const MultipleChoice = ({ options }) => {
  return (
    <Form.Select>
      {Array.from(options).map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </Form.Select>
  )
}

const MultipleChoiceScale = ({ numberOfOptions }) => {
  let options
  if (numberOfOptions === 3) {
    options = ['Agree', 'Neutral', 'Disagree']
  } else if (numberOfOptions === 5) {
    options = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
  } else {
    options = [
      'Strongly Agree',
      'Agree',
      'Weakly Agree',
      'Neutral',
      'Weekly Disagree',
      'Disagree',
      'Strongly Disagree'
    ]
  }
  return (
    <Form.Select>
      {options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </Form.Select>
  )
}

const FixedText = () => {
  return <Form.Control />
}

const MultiLineText = ({ numberOfLines }) => {
  return (
    <>
      {[...Array(numberOfLines).keys()].map((i) => {
        return <Form.Control key={i} className="mb-3" />
      })}
    </>
  )
}

const TextArea = () => {
  return <Form.Control as="textarea" rows={4} />
}

const Question = ({ question, type, required, ...rest }) => {
  return (
    <Form.Group className="m-5">
      <Row>
        <Col xs="5">
          <Form.Label className={required ? 'required-field' : ''}>{question}</Form.Label>
        </Col>
        <Col xs="5">
          {type === 'mc' && <MultipleChoice {...rest} />}
          {type === 'mcs' && <MultipleChoiceScale {...rest} />}
          {type === 'fixedText' && <FixedText {...rest} />}
          {type === 'multilineText' && <MultiLineText {...rest} />}
          {type === 'textarea' && <TextArea {...rest} />}
        </Col>
      </Row>
    </Form.Group>
  )
}

export default Question
