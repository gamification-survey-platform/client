import api from '../api/apiUtils'

const getStudentReport = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_id}/statistics`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getKeywords = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_id}/keywords`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { getStudentReport, getKeywords }
