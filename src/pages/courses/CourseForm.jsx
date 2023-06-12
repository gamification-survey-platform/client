import { useEffect, useState } from 'react'
import {
  Form,
  Select,
  Row,
  Col,
  Input,
  Button,
  Typography,
  message,
  InputNumber,
  Checkbox,
  Upload,
  Image
} from 'antd'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createCourse as createCourseApi, editCourse as editCourseApi } from '../../api/courses'
import { addCourse, editCourse } from '../../store/courses/coursesSlice'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { useForm } from 'antd/es/form/Form'

const CourseForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [messageApi, contextHolder] = message.useMessage()
  const [coursePicture, setCoursePicture] = useState()
  const navigate = useNavigate()
  const [form] = useForm()
  const params = useParams()
  const editingCourse = courses.find((course) => course.course_number === params.course_id)
  useEffect(() => {
    if (editingCourse && form) {
      const semester = editingCourse.semester.split(' ')[0]
      const semesterYear = editingCourse.semester.split(' ')[1]
      form.setFieldsValue({ ...editingCourse, semester, semesterYear })
    }
  }, [editingCourse, form])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    form.validateFields()
    if (form.validateFields()) {
      try {
        const courseData = { ...form.getFieldsValue(), andrew_id: user.andrewId }
        courseData.semester = `${courseData.semester} ${courseData.semesterYear}`
        courseData.picture = coursePicture
        delete courseData.semesterYear
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
      } catch (e) {
        messageApi.open({
          type: 'error',
          content: editingCourse ? 'Failed to edit course.' : 'Failed to create course.'
        })
      }
    }
  }

  return (
    <div className="m-5">
      {contextHolder}
      <Typography.Title level={2}>{editingCourse ? 'Edit ' : 'Create '} Course</Typography.Title>
      <Form form={form}>
        <Form.Item
          label="Course Number"
          name="course_number"
          rules={[{ required: true, message: 'Please input a course number' }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Course Name"
          name="course_name"
          rules={[{ required: true, message: 'Please input a course name' }]}>
          <Input />
        </Form.Item>
        <Row>
          <Col span={4}>
            <Form.Item
              label="Semester"
              name="semester"
              rules={[{ required: true, message: 'Please input a semester' }]}>
              <Select
                className="text-left"
                options={[
                  { value: 'Fall', label: 'Fall' },
                  { value: 'Spring', label: 'Spring' },
                  { value: 'Summer', label: 'Summer' },
                  { value: 'Winter', label: 'Winter' }
                ]}></Select>
            </Form.Item>
          </Col>
          <Col offset={1} span={5}>
            <Form.Item
              label="Semester Year"
              name="semesterYear"
              rules={[{ required: true, message: 'Please input a semester' }]}>
              <InputNumber min={dayjs().year()} max={dayjs().year() + 2} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Syllabus"
          name="syllabus"
          rules={[{ required: true, message: 'Please input an syllabus' }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item name="picture">
          <Upload
            maxCount={1}
            accept="image/png, image/jpeg"
            beforeUpload={(file) => {
              setCoursePicture(file)
              return false
            }}>
            <Button>
              {editingCourse && editingCourse.picture ? 'Reset' : 'Set'} course picture
            </Button>
          </Upload>
          {editingCourse && editingCourse.picture ? (
            <Image src={editingCourse.picture} width={50} className="mt-3" />
          ) : null}
        </Form.Item>
        <Form.Item label="Visible" name="visible" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <div className="text-center">
          <Button type="primary" onClick={handleSubmit}>
            {editingCourse ? 'Edit' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default CourseForm
