import api from './apiUtils'

const getLevelExp = async (level) => {
  try {
    const res = await api.get(`levels/${level}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { getLevelExp }
