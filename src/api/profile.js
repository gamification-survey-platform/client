import api from './apiUtils'
import { writeToS3 } from '../utils/s3helpers'

const editProfile = async ({ user_id, data }) => {
  try {
    const res = await api.patch(`/users/${user_id}/`, data)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const updateProfilePic = async ({ user_id, file }) => {
  try {
    const formData = new FormData()
    formData.set('image', file)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.patch(`/users/${user_id}/`, formData, config)
    if (res.data && res.data.upload_url && res.data.delete_url) {
      const { url, fields } = res.data.upload_url
      await writeToS3({ url: res.data.delete_url, method: 'DELETE' })
      await writeToS3({ url, method: 'POST', file, fields })
    }
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { editProfile, updateProfilePic }
