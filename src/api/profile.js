import api from './apiUtils'

const editProfile = async (data) => {
  try {
    const res = await api.patch(`/profile/`, data)
    return res
  } catch (error) {
    return error.response
  }
}

export { editProfile }
