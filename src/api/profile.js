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
    if (res.data && res.data.upload_url && res.data.upload_url.url && res.data.upload_url.fields) {
      const { url, fields } = res.data.upload_url
      const s3Res = await writeToS3({ url, method: 'POST', file, fields })
      return s3Res
    } else {
      return res
    }
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { editProfile, getProfilePic, updateProfilePic }
