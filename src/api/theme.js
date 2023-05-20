import api from './apiUtils'

const getTheme = async () => {
  try {
    const res = await api.get(`theme/`)
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

export { getTheme, editTheme }
