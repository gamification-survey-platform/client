import api from '../api/apiUtils'
import { validateUser, validateAdmin } from '../utils/validators'

const getAssignments = async (courseId, assignmentId = null) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const url = assignmentId
      ? `courses/${courseId}/assignments/${assignmentId}`
      : `courses/${courseId}/assignments`
    const res = await api.get(url)
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

const editAssignment = async ({ courseId, assignmentId, assignment }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.put(`courses/${courseId}/assignments/${assignmentId}`, { assignment })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteAssignment = async ({ courseId, assignmentId }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.delete(`courses/${courseId}/assignments/${assignmentId}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getAssignments, createAssignment, editAssignment, deleteAssignment }
