import api from '../api/apiUtils'
import { validateUser, validateAdmin } from '../utils/validators'

const formatAssignment = (assignment) => {
  assignment.total_score = parseFloat(assignment.total_score)
  assignment.weight = parseFloat(assignment.weight)
  assignment.date_due = new Date(assignment.date_due)
  assignment.date_released = new Date(assignment.date_released)
  return assignment
}

const getAssignment = async (coursePk, assignment_id) => {
  try {
    const res = await api.get(`courses/${coursePk}/assignments`, { params: { assignment_id } })
    const { user_role, assignment } = res.data
    res.data = { user_role, assignment: formatAssignment(assignment) }
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourseAssignments = async (coursePk) => {
  try {
    const res = await api.get(`courses/${coursePk}/assignments`)
    const { user_role, assignments } = res.data
    res.data = assignments.map(({ feedback_survey, ...rest }) => ({
      ...formatAssignment(rest),
      feedback_survey,
      user_role
    }))
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createAssignment = async ({ coursePk, assignment }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const formattedAssignment = formatAssignment(assignment)
    const res = api.post(`courses/${coursePk}/assignments/`, {
      course: coursePk,
      ...formattedAssignment
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editAssignment = async ({ coursePk, assignment, assignment_id }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const formattedAssignment = formatAssignment(assignment)
    const res = await api.put(`courses/${coursePk}/assignments/`, formattedAssignment, {
      params: { assignment_id }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteAssignment = async ({ coursePk, assignment_id }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have required role')
    const res = await api.delete(`courses/${coursePk}/assignments/`, { params: { assignment_id } })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getCourseAssignments, getAssignment, createAssignment, editAssignment, deleteAssignment }
