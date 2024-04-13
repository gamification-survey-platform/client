import api from '../api/apiUtils'

const formatAssignment = (assignment) => {
  assignment.total_score = parseFloat(assignment.total_score)
  assignment.date_due = new Date(assignment.date_due)
  assignment.date_released = new Date(assignment.date_released)
  return assignment
}

const getAssignment = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/assignments/${assignment_id}`)
    const { user_role, ...rest } = res.data
    res.data = { user_role, assignment: formatAssignment(rest) }
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourseAssignments = async (course_id) => {
  try {
    const res = await api.get(`courses/${course_id}/assignments`)
    res.data
    res.data = res.data.map(({ feedback_survey, user_role, ...rest }) => ({
      ...formatAssignment(rest),
      feedback_survey,
      user_role
    }))
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createAssignment = async ({ course_id, assignment }) => {
  try {
    const formattedAssignment = formatAssignment(assignment)
    const res = api.post(`courses/${course_id}/assignments/`, {
      course: course_id,
      ...formattedAssignment
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editAssignment = async ({ course_id, assignment_id, assignment }) => {
  try {
    const formattedAssignment = formatAssignment(assignment)
    const res = await api.patch(
      `courses/${course_id}/assignments/${assignment_id}/`,
      formattedAssignment
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteAssignment = async ({ coursePk, assignment_id }) => {
  try {
    const res = await api.delete(`courses/${coursePk}/assignments/${assignment_id}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getAssignmentReport = async ({ coursePk, assignment_id }) => {
  try {
    const res = await api.get(
      `courses/${coursePk}/assignments/${assignment_id}/artifact_reviews/ipsatization/`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export {
  getCourseAssignments,
  getAssignment,
  createAssignment,
  editAssignment,
  deleteAssignment,
  getAssignmentReport
}
