import { useEffect, useState } from 'react'
import { Table, Button, Tag } from 'antd'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getSurvey } from '../../api/survey'
import { deleteAssignment, getCourseAssignments } from '../../api/assignments'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { LinkContainer } from 'react-router-bootstrap'
import Spinner from '../../components/Spinner'

const CourseAssignments = () => {
  const location = useLocation()
  const { course_id } = useParams()
  const [spin, setSpin] = useState(false)
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const selectedCourse = courses.find((course) => course.course_number === course_id)
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])

  const dataSource = assignments.map((assignment, i) => {
    const date_due = new Date(assignment.date_due).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    const date_released = new Date(assignment.date_released).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    return { ...assignment, key: i, date_due, date_released }
  })

  let columns = [
    {
      title: 'Assignment Name',
      dataIndex: 'assignment_name',
      align: 'center',
      key: 'assignment_name'
    },
    {
      title: 'Assignment Type',
      dataIndex: 'assignment_type',
      align: 'center',
      key: 'assignment_type'
    },
    { title: 'Total Score', dataIndex: 'total_score', align: 'center', key: 'total_score' },
    { title: 'Release Date', dataIndex: 'date_released', align: 'center', key: 'date_released' },
    { title: 'Due Date', dataIndex: 'date_due', align: 'center', key: 'date_due' },
    {
      title: '',
      dataIndex: 'view',
      key: 'view',
      render: (_, assignment) => {
        return (
          <LinkContainer to={`${location.pathname}/${assignment.id}/view`}>
            <Tag color="blue" role="button">
              View
            </Tag>
          </LinkContainer>
        )
      }
    }
  ]

  const staffColumns = [
    {
      title: '',
      dataIndex: 'survey',
      key: 'survey',
      render: (_, assignment) => {
        return (
          <Tag color="green" role="button" onClick={(e) => handleSurveyClick(e, assignment)}>
            Survey
          </Tag>
        )
      }
    },
    {
      title: '',
      dataIndex: 'reports',
      key: 'reports',
      render: (_, assignment) => {
        return (
          <Link to={`${location.pathname}/${assignment.id}/reports`}>
            <Tag color="geekblue" role="button">
              Reports
            </Tag>
          </Link>
        )
      }
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_, assignment) => {
        return (
          <Tag color="gold" role="button" onClick={(e) => handleEditAssignment(e, assignment)}>
            Edit
          </Tag>
        )
      }
    },
    {
      title: '',
      dataIndex: 'survey',
      key: 'survey',
      render: (_, assignment) => {
        return (
          <Tag color="volcano" role="button" onClick={(e) => handleDeleteAssignment(e, assignment)}>
            Delete
          </Tag>
        )
      }
    }
  ]

  if (user.is_staff) columns = columns.concat(staffColumns)
  useEffect(() => {
    const fetchAssignments = async () => {
      setSpin(true)
      const res = await getCourseAssignments(selectedCourse.pk)
      if (res.status === 200) {
        setAssignments(res.data)
      }
      setSpin(false)
    }
    fetchAssignments()
  }, [])

  const handleSurveyClick = async (e, assignment) => {
    e.preventDefault()
    try {
      const res = await getSurvey({ course_id: selectedCourse.pk, assignment_id: assignment.id })
      if (res.status === 200)
        navigate(`${location.pathname}/${assignment.id}/survey`, {
          state: { userRole: assignment.user_role }
        })
      else if (res.status === 404)
        navigate(`/courses/${course_id}/assignments/${assignment.id}/survey/add`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddAssignment = (e) => {
    e.preventDefault()
    navigate(`${location.pathname}/add`)
  }

  const handleEditAssignment = (e, assignment) => {
    e.preventDefault()
    navigate(`${location.pathname}/${assignment.id}/edit`, {
      state: assignment
    })
  }

  const handleDeleteAssignment = async (e, assignment) => {
    e.preventDefault()
    const res = await deleteAssignment({
      coursePk: selectedCourse.pk,
      assignment_id: assignment.id
    })
    if (res.status === 204) {
      const newAssignments = assignments.filter(
        (assignmentToRemove) => assignmentToRemove.id !== assignment.id
      )
      setAssignments(newAssignments)
    }
  }

  return spin ? (
    <Spinner show={spin} />
  ) : (
    <div className="m-5">
      <Table columns={columns} dataSource={dataSource} />
      {user && user.is_staff && (
        <Button className="m-3" onClick={handleAddAssignment}>
          Add Assignment
        </Button>
      )}
    </div>
  )
}

export default CourseAssignments
