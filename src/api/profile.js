import api from './apiUtils'

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
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { editProfile, getProfilePic, updateProfilePic }
