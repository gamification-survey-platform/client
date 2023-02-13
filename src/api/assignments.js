import api from '../api/apiUtils'
import { validateUser, validateAdmin } from '../utils/validators'

const getAssignments = async (courseId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const res = await api.get(`courses/${courseId}/assignments`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createAssignment = async ({ courseId, assignment }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.post(`courses/${courseId}/assignments`, { assignment })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getAssignments, createAssignment }
