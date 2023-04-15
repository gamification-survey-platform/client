import api from './apiUtils'

const createCourse = async (courseData) => {
  try {
    const res = await api.post(`courses/`, courseData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const editCourse = async ({ course_id, course }) => {
  try {
    const res = await api.put(`courses/${course_id}/`, course, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const deleteCourse = async (course_id) => {
  try {
    const res = await api.delete(`courses/${course_id}`, { params: { course_id } })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getUserCourses = async (andrewId) => {
  try {
    const res = await api.get('courses/', { params: { andrewId } })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getCourse = async (course_id) => {
  try {
    const res = await api.get(`courses/${course_id}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { createCourse, editCourse, deleteCourse, getCourse, getUserCourses }
