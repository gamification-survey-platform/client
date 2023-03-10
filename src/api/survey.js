import api from './apiUtils'

const getSurvey = async ({ course_id, assignment_id }) => {
  try {
    console.log('get survey', course_id, assignment_id)
    const res = await api.get(`/courses/${course_id}/assignments/${assignment_id}/feedback_surveys`)
    return res
  } catch (error) {
    // Return response to indicate no survey exists
    return error.response
  }
}

const getSurveyDetails = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`/courses/${course_id}/assignments/${assignment_id}/surveys`)
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

const saveSurvey = async ({ course_id, assignment_id, survey: survey }) => {
  try {
    const res = await api.patch(`courses/${course_id}/assignments/${assignment_id}/surveys/`, {
      survey_info: survey
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteSurvey = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.delete(`/courses/${course_id}/assignments/${assignment_id}/surveys/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getSurvey, getSurveyDetails, createSurvey, saveSurvey, deleteSurvey }
