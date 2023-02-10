import jwt from 'jsonwebtoken'
import api from '../apiUtils'

const create = async (course) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('User is not authenticated')
  }
  try {
    const decodedToken = jwt.decode(token)
    if (!decodedToken.is_staff) {
      throw new Error('User does not have the required role')
    }
    const res = await api.post(`courses/`, { course })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { create }
