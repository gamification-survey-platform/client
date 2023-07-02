import api from './apiUtils'

const getPlatformLeaderboard = async () => {
  try {
    const res = await api.get('experience/')
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourseLeaderboard = async ({ course_id }) => {
  try {
    const res = await api.get(`experience/${course_id}/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getCourseLeaderboard, getPlatformLeaderboard }
