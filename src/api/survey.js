import api from './apiUtils'

const getSurvey = async ({ courseId, assignmentId }) => {
  try {
    const res = await api.get(`/courses/${courseId}/assignments/${assignmentId}/feedback_surveys`)
    return res
  } catch (error) {
    // Return response to indicate no survey exists
    return error.response
  }
}

const getSurveyDetails = async ({ courseId, assignmentId }) => {
  try {
    const res = await api.get(`/courses/${courseId}/assignments/${assignmentId}/surveys`)
    return res
  } catch (error) {
    // Return response to indicate no survey exists
    return error.response
  }
}

const createSurvey = async ({ course_id, assignment_id, survey }) => {
  try {
    const res = await api.post(
      `/courses/${course_id}/assignments/${assignment_id}/feedback_surveys/`,
      survey
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const saveSurvey = async ({ courseId, assignmentId, survey }) => {
  try {
    const res = await api.put(`courses/${courseId}/assignments/${assignmentId}/survey`, survey)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteSurvey = async ({ courseId, assignmentId }) => {
  try {
    const res = await api.delete(`/courses/${courseId}/assignments/${assignmentId}/survey`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getSurvey, getSurveyDetails, createSurvey, saveSurvey, deleteSurvey }
