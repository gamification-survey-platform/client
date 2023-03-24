import api from './apiUtils'

const getCourseRewards = async ({ course_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/rewards`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const addCourseReward = async ({ course_id, reward }) => {
  try {
    const res = await api.post(`courses/${course_id}/rewards`, reward)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getCourseRewards, addCourseReward }
