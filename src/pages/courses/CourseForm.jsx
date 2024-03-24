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
  Popover,
  Space,
  Image as AntdImage
} from 'antd'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createCourse as createCourseApi, editCourse as editCourseApi } from '../../api/courses'
import { addCourse, editCourse } from '../../store/courses/coursesSlice'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { dataURLtoFile } from '../../utils/imageUtils'
import { useForm } from 'antd/es/form/Form'
import Trivia from './Trivia'
import { QuestionCircleTwoTone } from '@ant-design/icons'

const CourseForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const courses = useSelector(coursesSelector)
  const [messageApi, contextHolder] = message.useMessage()
  const [coursePicture, setCoursePicture] = useState()
  const navigate = useNavigate()
  const [form] = useForm()
  const params = useParams()
  const [enableTrivia, setEnableTrivia] = useState(false)
  const [triviaList, setTriviaList] = useState([{ question: '', answer: '', hints: [''] }])
  const editingCourse = courses.find((course) => course.course_number === params.course_id)
  
  useEffect(() => {
    if (editingCourse && form) {
      const semester = editingCourse.semester.split(' ')[0]
      const semesterYear = editingCourse.semester.split(' ')[1]
      if (editingCourse.trivia && editingCourse.trivia.length) {
        setEnableTrivia(true)
        form.setFieldValue('enableTrivia', true)
        const formattedTriviaList = editingCourse.trivia.map(triviaItem => {
          return {
            question: triviaItem.question,
            answer: triviaItem.answer,
            hints: triviaItem.hints || []
          }
        })
        setTriviaList(formattedTriviaList)
      } else {
        setTriviaList([{ question: '', answer: '', hints: [''] }])
      }
      form.setFieldsValue({ ...editingCourse, semester, semesterYear })
    }
  }, [editingCourse, form])

  const formatCoursePicture = async () => {
    const promise = new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 300
          canvas.height = 300
          ctx.drawImage(img, 0, 0, 300, 300)
          const data = canvas.toDataURL('image/png')
          const file = dataURLtoFile(data, coursePicture.name)
          resolve(file)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(coursePicture)
    })
    return promise
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    form.validateFields()
    if (form.validateFields()) {
      try {
        const fields = form.getFieldValue()
        const courseData = { ...fields, andrew_id: user.andrewId, trivia: triviaList }
        courseData.semester = `${courseData.semester} ${courseData.semesterYear}`
        // if user upload a new picture, set a new picture. Otherwise, use the original picture from editingCourse
        if (coursePicture) {
          console.log('Processing new course picture')
          const formattedPicture = await formatCoursePicture()
          courseData.picture = formattedPicture
        } else if (editingCourse.picture) {
          courseData.picture = editingCourse.picture
        }

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
        <Form.Item
          label="Course Picture"
          name="picture"
          rules={[{ required: true, message: 'Please input a course cover' }]}>
          <Upload
            maxCount={1}
            accept="image/png, image/jpeg"
            beforeUpload={(file) => {
              setCoursePicture(file)
              return false
            }}>
            <Button>
              {editingCourse && editingCourse.picture ? 'Reset' : 'Click to Upload'} course picture
            </Button>
          </Upload>
          {editingCourse && editingCourse.picture ? (
            <AntdImage src={editingCourse.picture} width={50} className="mt-3" />
          ) : null}
        </Form.Item>
        <Form.Item label="Visible" name="visible" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="enableTrivia"
          valuePropName="checked"
          label={
            <div>
              Enable Trivia
              <Popover
                content={() => (
                  <Space style={{ maxWidth: 500 }} direction="vertical">
                    <div>
                      Enabling this feature displays a question (concerning the course, instructor
                      or any other topic of choice) that a person filling in the survey can guess.
                    </div>
                    <div>
                      As the user progresses with filling in the survey, hints will be displayed to
                      facilitate guessing the trivia&apos;s answer.
                    </div>
                  </Space>
                )}>
                {' '}
                <QuestionCircleTwoTone
                  style={{ fontSize: '1.2em', pointerEvents: 'auto', cursor: 'pointer' }}
                />
              </Popover>
            </div>
          }>
          <Checkbox value={enableTrivia} onChange={() => setEnableTrivia(!enableTrivia)} />
        </Form.Item>
        {enableTrivia && (
        <Trivia triviaList={triviaList} setTriviaList={setTriviaList} />)}
        <div className="text-center" style={{ marginTop: '30px' }}>
          <Button type="primary" onClick={handleSubmit}>
            {editingCourse ? 'Edit' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default CourseForm
