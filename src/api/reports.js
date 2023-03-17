import api from '../api/apiUtils'

const getStudentReport = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(`artifacts/${artifact_id}/answers/statistics`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getKeywords = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(`artifacts/${artifact_id}/answers/keywords`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getStudentReport, getKeywords }
