import { useEffect, useRef, useState } from 'react'
//import { Container, Button, Form, Col, Alert } from 'react-bootstrap'
import { Form, Col, Alert, Input, Upload, Button, Typography } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createCourse as createCourseApi, editCourse as editCourseApi } from '../../api/courses'
import { addCourse, editCourse } from '../../store/courses/coursesSlice'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { useForm } from 'antd/es/form/Form'

const CourseForm = () => {
  const [message, setMessage] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const navigate = useNavigate()
  const [form] = useForm()
  const params = useParams()
  const editingCourse = courses.find((course) => course.course_number === params.course_id)
  useEffect(() => {
    if (editingCourse && form) {
      form.setFieldsValue({ ...editingCourse })
    }
  }, [editingCourse, form])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    form.validateFields()
    if (form.validateFields()) {
      try {
        const courseData = { ...form.getFieldsValue(), andrew_id: user.andrewId }
        const res = editingCourse
          ? await editCourseApi({ course_id: editingCourse.pk, course: courseData })
          : await createCourseApi(courseData)
        if (res.status === 200) {
          if (editingCourse) {
            dispatch(
              editCourse({ pk: editingCourse.pk, course: { ...editingCourse, ...res.data } })
            )
          } else {
            dispatch(addCourse(res.data))
          }
          navigate(-1)
        }
        setTimeout(() => setMessage(), 2000)
      } catch (e) {
        setMessage({
          type: 'error',
          message: editingCourse ? 'Failed to edit course.' : 'Failed to create course.'
        })

        setTimeout(() => setMessage(), 2000)
      }
    }
  }
  return (
    <div className="m-5 text-center">
      <Typography.Title level={2}>Create Course</Typography.Title>
      <Form form={form}>
        <Form.Item
          label="Course Number"
          name="course_number"
          rules={[{ required: true, message: 'Please input a course number' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Course Name"
          name="course_name"
          rules={[{ required: true, message: 'Please input a course name' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Semester"
          name="semester"
          rules={[{ required: true, message: 'Please input a semester' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Syllabus"
          name="syllabus"
          rules={[{ required: true, message: 'Please input an syllabus' }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item label="Course Image" name="picture" className="text-left">
          <Upload name="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="CATME File" name="catme" className="text-left">
          <Upload name="catme">
            <Button icon={<UploadOutlined />}>Upload JSON</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          {editingCourse ? 'Edit' : 'Create'}
        </Button>
        {message && <Alert className="mt-3" {...message} />}
      </Form>
    </div>
  )
}

export default CourseForm
