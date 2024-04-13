import { Row, Col, Typography, Collapse } from 'antd';
import { EditTwoTone, PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import AddQuestionModal from './AddQuestionModal';
import Question from './question/Question';
import AddSectionModal from './AddSectionModal';
import { useDispatch, useSelector } from 'react-redux';
import surveySelector from '../../store/survey/selectors';
import { deleteSection, reorderQuestions } from '../../store/survey/surveySlice';
import { getSentimentEmoji } from './sentiment'; // Make sure to keep this import
import { gamified_mode } from '../../gamified';
import userSelector from '../../store/user/selectors';

const Section = ({ sectionIdx, artifact }) => {
  const user = useSelector(userSelector);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const survey = useSelector(surveySelector);
  const dispatch = useDispatch();

  const section = survey.sections.find((_, i) => i === sectionIdx) || {
    title: '',
    is_required: false,
    questions: []
  };
  const { title, is_required, questions } = section;
  let className = 'text-left mb-3';
  if (is_required) className += ' required-field';

  const handleDeleteSection = () => dispatch(deleteSection({ sectionIdx }));

  const handleReorderQuestions = (dragIndex, hoverIndex) => {
    dispatch(reorderQuestions({ sectionIdx, i: dragIndex, j: hoverIndex }));
  };

  return (
    <>
      <Collapse size="large" className="mb-3" defaultActiveKey={0}>
        <Collapse.Panel header={title} style={{ opacity: 1 }}>
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
                  {title !== 'Artifact' && (
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
                  )}
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
            {questions.map((question, i) => (
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
            {gamified_mode(user) && section.sentiment ? (
              <Row justify="end" className="m-3" align="middle">
                <Typography.Title level={3} className="mr-3">
                  Section mood:
                </Typography.Title>
                <h1 dangerouslySetInnerHTML={{ __html: getSentimentEmoji(section.sentiment) }} />
              </Row>
            ) : null}
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default Section;
