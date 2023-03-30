import { useState } from 'react'
import { Table, Button, Alert, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteCourse as deleteCourseApi } from '../../api/courses'
import { deleteCourse } from '../../store/courses/coursesSlice'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { LinkContainer } from 'react-router-bootstrap'
import { isInstructorOrTA } from '../../utils/roles'

const Courses = () => {
  const navigate = useNavigate()
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [showError, setShowError] = useState(false)
  const dispatch = useDispatch()
  const dataSource = courses.map((c, i) => ({ ...c, key: i }))

  const handleDeleteCourse = async (coursePk) => {
    try {
      const res = await deleteCourseApi(coursePk)
      if (res.status === 200) {
        setShowError(false)
        dispatch(deleteCourse(coursePk))
      }
    } catch (e) {
      setShowError(true)
    }
  }

  const columns = [
    { title: 'Course Name', dataIndex: 'course_name', align: 'center' },
    { title: 'Course Number', dataIndex: 'course_number', key: 'course_number', align: 'center' },
    { title: 'Semester', dataIndex: 'semester', key: 'semester', align: 'center' },
    {
      title: '',
      dataIndex: 'assignments',
      key: 'assignments',
      render: (_, course) => {
        return (
          <LinkContainer
            to={`/courses/${course.course_number}/assignments`}
            style={{ textAlign: 'center' }}>
            <Tag role="button" color="blue">
              Assignments
            </Tag>
          </LinkContainer>
        )
      }
    },
    {
      title: '',
      dataIndex: 'members',
      key: 'members',
      render: (_, course) => {
        return (
          <LinkContainer to={`/courses/${course.course_number}/members`}>
            <Tag role="button" color="purple">
              Members
            </Tag>
          </LinkContainer>
        )
      }
    },
    {
      title: '',
      dataIndex: 'view',
      key: 'view',
      render: (_, course) => {
        return (
          <LinkContainer to={`/courses/${course.course_number}/details`}>
            <Tag role="button" color="cyan">
              View
            </Tag>
          </LinkContainer>
        )
      }
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_, course) => {
        return isInstructorOrTA(course.user_role) ? (
          <LinkContainer to={`/courses/${course.course_number}/edit`}>
            <Tag role="button" color="gold">
              Edit
            </Tag>
          </LinkContainer>
        ) : null
      }
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, course) =>
        user.is_staff ? (
          <Tag role="button" color="red" onClick={() => handleDeleteCourse(course.pk)}>
            Delete
          </Tag>
        ) : null
    }
  ]

  return (
    <div className="m-5">
      <Table className="text-center" columns={columns} dataSource={dataSource} />
      {user && user.is_staff && (
        <Button className="my-5" onClick={() => navigate('/courses/add')}>
          Add Course
        </Button>
      )}
      {showError && <Alert type="error" message="Failed to delete course" showIcon />}
    </div>
  )
}

export default Courses
