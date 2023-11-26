import { forwardRef, useEffect, useState, useCallback } from 'react'
import {
  assignArtifactReview,
  unassignArtifactReview,
  getAssignmentArtifactReviews,
  editArtifactReviewStatus
} from '../api/artifactReview'
import { Space, List, Col, Typography, Button, Tag } from 'antd'
import { getMembers } from '../api/members'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import coursesSelector from '../store/courses/selectors'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CloseCircleOutlined } from '@ant-design/icons'
import useMessage from 'antd/es/message/useMessage'
import { RedoOutlined } from '@ant-design/icons';

const Member = forwardRef(({ member, handleCancel }, ref) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'MEMBER',
      item: { andrew_id: member.andrew_id },
      end: (item, monitor) => {
        if (!monitor.didDrop()) handleCancel(item)
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    [member, handleCancel]
  )

  return (
    <List.Item ref={dragRef}>
      <Typography.Text>{member.andrew_id}</Typography.Text>
    </List.Item>
  )
})
Member.displayName = 'Member'

const ArtifactReviewers = ({
  reviewing,
  reviewers,
  handleHover,
  handleDrop,
  removeReviewer,
  setArtifactReviews,
  artifactReviews
}) => {
  const [messageApi, contextHolder] = useMessage()
  const { course_id: courseNumber, assignment_id } = useParams()
  const [, dropRef] = useDrop(
    () => ({
      accept: 'MEMBER',
      hover: (item, monitor) => {
        handleHover(reviewing, item)
      },
      drop: (item) => {
        handleDrop(reviewing, item)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        handlerId: monitor.getHandlerId()
      })
    }),
    [reviewers, handleHover, handleDrop]
  )

  const uniqueReviewers = reviewers.reduce((acc, current) => {
    const x = acc.find(item => item.reviewer === current.reviewer);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const reopenReview = async (e, artifact_review_id) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await editArtifactReviewStatus({
        course_id: courseNumber,
        assignment_id,
        artifact_review_id,
        status: 'REOPEN'
      })
      console.log(res, reviewing)
      if (res.status === 200) {
        const newArtifactReviews = {
          ...artifactReviews,
          [reviewing]: artifactReviews[reviewing].map((r) => {
            if (r.id === artifact_review_id) return { ...r, status: 'REOPEN' }
            return { ...r }
          })
        }
        setArtifactReviews(newArtifactReviews)
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Failed to assign review with error: ${error.message}`
      })
    }
  }

  const reviewStatusLabel = (status) => {
    if (status === 'INCOMPLETE') {
      return <Tag color="red" style={{ marginLeft: 8 }}>Mandatory</Tag>;
    } else {
      return <Tag color="blue" style={{ marginLeft: 8 }}>Optional</Tag>;
    }
  };

  const listStyle = {
    maxHeight: 'none',
    overflow: 'auto',
    padding: '8px',
  };

  const reopenIconStyle = {
    fontSize: '16px',
    color: '#1890ff',
    cursor: 'pointer',
    margin: '4px'
  };

  return (
    <div ref={dropRef} style={listStyle}>
      {contextHolder}
      <List
        header={<Typography.Title level={5}>Reviewee: {reviewing}</Typography.Title>}
        bordered
        dataSource={uniqueReviewers}
        renderItem={(item) => {
          const styles = item.hovering ? { opacity: 0.5 } : {}
          const statusLabel = item.status === 'COMPLETED' ? null : reviewStatusLabel(item.status);
          if (item.status === 'COMPLETED') {
            return (
              <List.Item style={{styles}}>
                <Typography.Text>{item.reviewer}</Typography.Text>
                <RedoOutlined
                  onClick={(e) => reopenReview(e, item.id)}
                  style={reopenIconStyle}
                  title="Reopen Review" 
                />
              </List.Item>
            );
          }
          return (
            <List.Item style={styles}>
              <Typography.Text>{item.reviewer}</Typography.Text>
              <Space style={{ marginLeft: 'auto' }}></Space>
              {statusLabel}
              <CloseCircleOutlined
                role="button"
                onClick={() => removeReviewer(reviewing, item.reviewer)}
                style={{ marginLeft: 'auto' }}
              />
            </List.Item>
          );
        }}
      />
    </div>
  )
}

const StaffArtifactReviewList = () => {
  const [artifactReviews, setArtifactReviews] = useState([])
  const [members, setMembers] = useState([])
  const [messageApi, contextHolder] = useMessage()
  const { course_id: courseNumber, assignment_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => courseNumber === course_number)
  useEffect(() => {
    const fetchCourseMembers = async () => {
      const res = await getMembers({ course_id: course.pk })
      if (res.status === 200)
        setMembers(res.data.filter((member) => !member.is_staff)).map((member) => ({
          ...member,
          hovering: false
        }))
    }
    const fetchArtifactReviews = async () => {
      const res = await getAssignmentArtifactReviews({ course_id: course.pk, assignment_id })
      const allArtifactReviews = {}
      for (const review of res.data) {
        const { reviewing } = review
        if (reviewing in allArtifactReviews) allArtifactReviews[reviewing].push(review)
        else allArtifactReviews[reviewing] = [review]
      }
      setArtifactReviews(allArtifactReviews)
    }
    fetchArtifactReviews()
    fetchCourseMembers()
  }, [])

  const handleCancel = useCallback(() => {
    const originalReviews = {}
    for (const review of Object.keys(artifactReviews)) {
      const oldReviews = artifactReviews[review].filter((review) => !review.hovering)
      originalReviews[review] = oldReviews
    }
    setArtifactReviews(originalReviews)
  }, [artifactReviews, setArtifactReviews])

  const handleHover = useCallback(
    (dropTarget, dragTarget) => {
      const currentReviewers = artifactReviews[dropTarget]
      const hoveringExists = currentReviewers.find(
        ({ reviewer }) => reviewer === dragTarget.andrew_id
      )
      if (hoveringExists || dragTarget.andrew_id === dropTarget) return
      const newReviewers = [...currentReviewers, { reviewer: dragTarget.andrew_id, hovering: true }]
      setArtifactReviews({ ...artifactReviews, [dropTarget]: newReviewers })
    },
    [artifactReviews, setArtifactReviews]
  )

  const handleDrop = useCallback(
    async (dropTarget, dragTarget) => {
      const currentReviewers = artifactReviews[dropTarget]
      const existingReviewers = currentReviewers.slice(0, currentReviewers.length - 1)
      const hoveringExists = existingReviewers.find(
        ({ reviewer }) => reviewer === dragTarget.andrew_id
      )
      if (hoveringExists || dragTarget.andrew_id === dropTarget) return
      try {
        const res = await assignArtifactReview({
          course_id: course.pk,
          assignment_id,
          reviewee: dropTarget,
          reviewer: dragTarget.andrew_id
        })
        if (res.status === 201) {
          const newReviewers = currentReviewers.filter((reviewer) => !reviewer.hovering)
          newReviewers.push(res.data)
          setArtifactReviews({ ...artifactReviews, [dropTarget]: newReviewers })
        }
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: `Failed to assign review with error: ${error.message}`
        })
      }
    },
    [artifactReviews, setArtifactReviews]
  )

  const removeReviewer = async (reviewee, reviewer) => {
    try {
      const currentReviewers = artifactReviews[reviewee]
      const removedReviewer = currentReviewers.find((r) => r.reviewer === reviewer)
      if (removedReviewer) {
        await unassignArtifactReview({
          course_id: course.pk,
          assignment_id,
          artifact_review_id: removedReviewer.id
        })
        const otherReviewers = currentReviewers.filter((r) => r.reviewer !== reviewer)
        setArtifactReviews({ ...artifactReviews, [reviewee]: otherReviewers })
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Failed to unassign review with error: ${error.message}`
      })
    }
  }

  const sortedArtifactReviews = Object.entries(artifactReviews).sort((a, b) => {
    return b[1].length - a[1].length;
  }).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return (
    <DndProvider backend={HTML5Backend}>
      {contextHolder}
      <Col span={24} className="mb-3">
        <Typography.Title level={5}>Drag and Drop Reviewers to Reassign</Typography.Title>
      </Col>
      <Col span={4} style={{ borderRight: 'solid 1px #d9d9d9', paddingRight: '20px', maxHeight: '250vh', overflowY: 'auto' }}>
        <List
          dataSource={members}
          bordered
          header={<Typography.Title level={5}>Reviewers</Typography.Title>}
          renderItem={(item) => <Member member={item} handleCancel={handleCancel} style={{ padding: '4px' }} />}
        />
      </Col>
      <Col span={19} offset={1}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          {/* Map over the sorted entries */}
          {Object.keys(sortedArtifactReviews).map((reviewing, i) => (
            <ArtifactReviewers
              key={i}
              reviewing={reviewing}
              reviewers={sortedArtifactReviews[reviewing]}
              handleHover={handleHover}
              handleDrop={handleDrop}
              removeReviewer={removeReviewer}
              setArtifactReviews={setArtifactReviews}
              artifactReviews={artifactReviews}
            />
          ))}
        </div>
      </Col>
    </DndProvider>
  );
}

export default StaffArtifactReviewList
