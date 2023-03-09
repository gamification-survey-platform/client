import { validateAdmin, validateUser } from '../utils/validators'
import api from './apiUtils'

const createCourse = async (courseData) => {
  try {
    const res = await api.post(`courses/`, courseData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editCourse = async ({ course_id, course }) => {
  try {
    const res = await api.put(`courses/`, course, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { course_id }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteCourse = async (course_id) => {
  try {
    const res = await api.delete('courses/', { params: { course_id } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getUserCourses = async (andrewId) => {
  try {
    const res = await api.get('courses/', { params: { andrewId } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourse = async (course_id) => {
  try {
    const res = await api.get('courses/', { params: { course_id } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { createCourse, editCourse, deleteCourse, getCourse, getUserCourses }
