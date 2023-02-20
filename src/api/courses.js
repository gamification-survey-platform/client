import { validateAdmin, validateUser } from '../utils/validators'
import api from './apiUtils'

const createCourse = async (courseData) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.post(`courses/`, courseData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editCourse = async ({ courseId, course }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.put(`courses/`, course, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { course_id: courseId }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteCourse = async (courseId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.delete('courses/', { params: { course_id: courseId } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getUserCourses = async (andrewId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const res = await api.get('courses/', { params: { andrewId } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourse = async (courseId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const res = await api.get('courses/', { params: { course_id: courseId } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { createCourse, editCourse, deleteCourse, getCourse, getUserCourses }
