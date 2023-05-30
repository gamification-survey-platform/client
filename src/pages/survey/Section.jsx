import { Row, Col, Typography, Collapse } from 'antd'
import { EditTwoTone, PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useState, useRef, useCallback } from 'react'
import AddQuestionModal from './AddQuestionModal'
import Question from './question/Question'
import AddSectionModal from './AddSectionModal'
import { useDispatch, useSelector } from 'react-redux'
import { surveySelector } from '../../store/survey/surveySlice'
import { deleteSection, reorderQuestions } from '../../store/survey/surveySlice'
import { useDrag, useDrop } from 'react-dnd'
import { getSentimentEmoji } from './sentiment'

const Section = ({ sectionIdx, artifact, handleReorderSections }) => {
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const survey = useSelector(surveySelector)
  const dispatch = useDispatch()

  const section = survey.sections.find((_, i) => sectionIdx === i) || {
    title: '',
    is_required: false,
    questions: []
  }
  const { title, is_required, questions } = section
  let className = 'text-left mb-3'
  if (is_required) className += ' required-field'

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'SECTION',
    item: { index: sectionIdx },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const [, dropRef] = useDrop(() => ({
    accept: 'SECTION',
    hover: (item, monitor) => {
      if (!survey.instructorView) return
      const dragIndex = item.index
      const hoverIndex = sectionIdx
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top
      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

      handleReorderSections(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      handlerId: monitor.getHandlerId()
    })
  }))

  const ref = useRef()
  const dragDropRef = dragRef(dropRef(ref))

  const handleDeleteSection = () => dispatch(deleteSection({ sectionIdx }))

  const handleReorderQuestions = useCallback(
    (dragIndex, hoverIndex) => {
      dispatch(reorderQuestions({ sectionIdx, i: dragIndex, j: hoverIndex }))
    },
    [survey.sections]
  )

  return (
    <>
      <Collapse size="large" className="mb-3">
        <Collapse.Panel header={title} ref={dragDropRef} style={{ opacity: isDragging ? 0.2 : 1 }}>
          <div className="border border-light mb-3">
            <Row>
              <Col span={18}>
                <Typography.Title className={className} style={{ marginTop: -15 }} level={3}>
                  {title}
                </Typography.Title>
              </Col>
              {survey.instructorView && (
                <Col span={6}>
                  <PlusCircleTwoTone
                    twoToneColor="#0a58ca"
                    style={{
                      fontSize: '2em',
                      margin: 10,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                    onClick={() => setQuestionModalOpen(true)}
                  />
                  <EditTwoTone
                    twoToneColor="#ffd43b"
                    style={{
                      fontSize: '2em',
                      margin: 10,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSectionModalOpen(true)}
                  />
                  <DeleteTwoTone
                    twoToneColor="#dc3545"
                    style={{
                      fontSize: '2em',
                      margin: 10,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                    onClick={handleDeleteSection}
                  />
                  <AddQuestionModal
                    sectionIdx={sectionIdx}
                    open={questionModalOpen}
                    setOpen={setQuestionModalOpen}
                  />
                  <AddSectionModal
                    open={sectionModalOpen}
                    setOpen={setSectionModalOpen}
                    sectionIdx={sectionIdx}
                  />
                </Col>
              )}
            </Row>
            {questions &&
              questions.map((question, i) => (
                <Question
                  key={i}
                  {...question}
                  sectionIdx={sectionIdx}
                  artifact={artifact}
                  index={i}
                  questionIdx={i}
                  handleReorderQuestions={handleReorderQuestions}
                />
              ))}
            {section.sentiment ? (
              <Row justify="end" className="m-3" align="middle">
                <Typography.Title level={3} className="mr-3">
                  Section mood:
                </Typography.Title>
                <h1
                  dangerouslySetInnerHTML={{ __html: `${getSentimentEmoji(section.sentiment)}` }}
                />
              </Row>
            ) : null}
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  )
}

export default Section
