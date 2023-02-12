import { decodeToken } from 'react-jwt'
import api from '../apiUtils'

const create = async ({ courseId, assignment }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('User is not authenticated')
  }
  try {
    const decodedToken = decodeToken(token)
    if (!decodedToken.is_staff) {
      throw new Error('User does not have the required role')
    }
    const res = await api.post(`courses/${courseId}/assignments/`, { assignment })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { create }
