import api from './apiUtils'

const createCourse = async (courseData) => {
  try {
    let config = {}
    if (courseData.picture) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }
    const res = await api.post(`courses/`, courseData, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editCourse = async ({ course_id, course }) => {
  try {
    let config = {}
    console.log(course)
    if (course.picture) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }
    const res = await api.put(`courses/${course_id}/`, course, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteCourse = async (course_id) => {
  try {
    const res = await api.delete(`courses/${course_id}/`)
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
