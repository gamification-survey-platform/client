import api from './apiUtils'

const getCourseRewards = async ({ course_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/rewards`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const addCourseReward = async ({ course_id, reward, picture }) => {
  try {
    const formData = new FormData()
    if (reward.type === 'Badge' || reward.type === 'Other') {
      formData.set('picture', picture)
    }
    Object.keys(reward).forEach((k) => k !== 'picture' && formData.set(k, reward[k]))
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.post(`courses/${course_id}/rewards/`, formData, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const editCourseReward = async ({ course_id, reward_pk, reward, picture }) => {
  try {
    const formData = new FormData()
    if (reward.type === 'Badge' || reward.type === 'Other') {
      formData.set('picture', picture)
    }
    Object.keys(reward).forEach((k) => k !== 'picture' && formData.set(k, reward[k]))
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.patch(`courses/${course_id}/rewards/${reward_pk}`, formData, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const deleteCourseReward = async ({ course_id, reward_pk }) => {
  try {
    const res = await api.delete(`courses/${course_id}/rewards/${reward_pk}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { getCourseRewards, addCourseReward, editCourseReward }
