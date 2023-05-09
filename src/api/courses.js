import api from './apiUtils'

const createCourse = async (courseData) => {
  try {
    const res = await api.post(`courses/`, courseData)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editCourse = async ({ course_id, course }) => {
  try {
    const res = await api.put(`courses/${course_id}/`, course)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteCourse = async (course_id) => {
  try {
    const res = await api.delete(`courses/${course_id}`, { params: { course_id } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getUserCourses = async () => {
  try {
    const res = await api.get('courses/')
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourse = async (course_id) => {
  try {
    const res = await api.get(`courses/${course_id}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { createCourse, editCourse, deleteCourse, getCourse, getUserCourses }
