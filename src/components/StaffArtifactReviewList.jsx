import { forwardRef, useEffect, useState, useCallback } from 'react'
import {
  assignArtifactReview,
  unassignArtifactReview,
  getArtifactReviews
} from '../api/artifactReview'
import { Space, List, Col, Typography } from 'antd'
import { getMembers } from '../api/members'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import coursesSelector from '../store/courses/selectors'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CloseCircleOutlined } from '@ant-design/icons'
import useMessage from 'antd/es/message/useMessage'

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

const ArtifactReviewers = ({ reviewing, reviewers, handleHover, handleDrop, removeReviewer }) => {
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
  return (
    <div ref={dropRef}>
      <List
        header={<Typography.Title level={5}>Reviewee: {reviewing}</Typography.Title>}
        bordered
        dataSource={reviewers}
        renderItem={(item) => {
          const styles = item.hovering ? { opacity: 0.5 } : {}
          return (
            <List.Item style={styles}>
              <Typography.Text>{item.reviewer}</Typography.Text>
              <CloseCircleOutlined
                role="button"
                onClick={() => removeReviewer(reviewing, item.reviewer)}
              />
            </List.Item>
          )
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
        setMembers(res.data.membership.map((member) => ({ ...member, hovering: false })))
    }
    const fetchArtifactReviews = async () => {
      const res = await getArtifactReviews({ course_id: course.pk, assignment_id })
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

  return (
    <DndProvider backend={HTML5Backend}>
      {contextHolder}
      <Col span={24} className="mb-3">
        <Typography.Title level={5}>Drag and Drop Reviewers to Reassign</Typography.Title>
      </Col>
      <Col span={4} style={{ borderRight: 'solid 1px #d9d9d9', paddingRight: 40 }}>
        <List
          dataSource={members}
          bordered
          header={<Typography.Title level={5}>Reviewers</Typography.Title>}
          renderItem={(item) => <Member member={item} handleCancel={handleCancel} />}
        />
      </Col>
      <Col span={19} offset={1}>
        <Space direction="horizontal">
          {Object.keys(artifactReviews).map((reviewing, i) => {
            return (
              <ArtifactReviewers
                key={i}
                reviewing={reviewing}
                reviewers={artifactReviews[reviewing]}
                handleHover={handleHover}
                handleDrop={handleDrop}
                removeReviewer={removeReviewer}
              />
            )
          })}
        </Space>
      </Col>
    </DndProvider>
  )
}

export default StaffArtifactReviewList
