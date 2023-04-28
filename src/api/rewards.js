import api from './apiUtils'
import { uploadToS3 } from '../utils/s3helpers'

const getCourseRewards = async ({ course_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/rewards`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const purchaseCourseReward = async ({ reward_pk }) => {
  try {
    const res = await api.patch(`rewards/${reward_pk}/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const addCourseReward = async ({ course_id, reward, picture }) => {
  try {
    const formData = new FormData()
    if (reward.type === 'Other') {
      formData.set('picture', picture)
    }
    Object.keys(reward).forEach((k) => k !== 'picture' && formData.set(k, reward[k]))
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.post(`courses/${course_id}/rewards/`, formData, config)
    if (res.data && res.data.upload_url && res.data.upload_url.url && res.data.upload_url.fields) {
      const { url, fields } = res.data.upload_url
      await uploadToS3(url, picture, fields)
    }
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const editCourseReward = async ({ course_id, reward_pk, reward, picture }) => {
  try {
    const formData = new FormData()
    if (reward.type === 'Other') {
      formData.set('picture', picture)
    }
    console.log(formData, picture)
    Object.keys(reward).forEach((k) => k !== 'picture' && formData.set(k, reward[k]))
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.patch(`courses/${course_id}/rewards/${reward_pk}/`, formData, config)
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

export {
  getCourseRewards,
  addCourseReward,
  editCourseReward,
  deleteCourseReward,
  purchaseCourseReward
}
