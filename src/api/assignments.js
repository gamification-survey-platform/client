import api from '../api/apiUtils'
import { validateUser, validateAdmin } from '../utils/validators'

const getAssignments = async (coursePk, assignmentId = null) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const url = assignmentId
      ? `courses/${coursePk}/assignments/${assignmentId}`
      : `courses/${coursePk}/assignments`
    const res = await api.get(url)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createAssignment = async ({ coursePk, assignment }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.post(`courses/${coursePk}/assignments/`, { assignment })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editAssignment = async ({ coursePk, assignmentId, assignment }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.put(`courses/${coursePk}/assignments/${assignmentId}`, { assignment })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteAssignment = async ({ coursePk, assignmentId }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.delete(`courses/${coursePk}/assignments/${assignmentId}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getAssignments, createAssignment, editAssignment, deleteAssignment }
