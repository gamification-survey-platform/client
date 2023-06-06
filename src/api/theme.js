import api from './apiUtils'

const getTheme = async () => {
  try {
    const res = await api.get(`theme/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createTheme = async (data) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.post(`theme/`, data, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editTheme = async (data) => {
  try {
    const res = await api.patch(`theme/`, data)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getTheme, createTheme, editTheme }
