import api from './apiUtils'
import { writeToS3 } from '../utils/s3helpers'

const editProfile = async (data) => {
  try {
    const res = await api.patch(`/profile/`, data)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getProfilePic = async (data) => {
  try {
    const res = await api.get('/profile/picture')
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const updateProfilePic = async (file) => {
  try {
    const formData = new FormData()
    formData.set('image', file)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.patch(`/profile/`, formData, config)
    if (res.data && res.data.upload_url && res.data.delete_url) {
      const { url, fields } = res.data.upload_url
      await writeToS3({ url: res.data.delete_url, method: 'DELETE' })
      await writeToS3({ url, method: 'POST', file, fields })
    }
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { editProfile, getProfilePic, updateProfilePic }
