import api from '../api/apiUtils'
import { validateUser, validateAdmin } from '../utils/validators'

const formatAssignment = (assignment) => {
  assignment.total_score = parseFloat(assignment.total_score)
  assignment.weight = parseFloat(assignment.weight)
  assignment.date_due = new Date(assignment.date_due)
  assignment.date_released = new Date(assignment.date_released)
  return assignment
}

const getAssignments = async (coursePk, assignment_id = null) => {
  try {
    const config = assignment_id ? { params: { assignment_id } } : {}
    const res = await api.get(`courses/${coursePk}/assignments`, config)

    res.data = assignment_id
      ? formatAssignment(res.data)
      : JSON.parse(res.data).map((r) => formatAssignment(r.assignment))
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
    console.log(formattedAssignment)
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

export { getAssignments, createAssignment, editAssignment, deleteAssignment }
