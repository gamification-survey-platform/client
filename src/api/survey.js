import api from './apiUtils'

const getSurvey = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`assignments/${assignment_id}/surveys`)
    console.log(res.data)
    return res
  } catch (error) {
    // Return response to indicate no survey exists
    return error.response
  }
}

const getSurveyById = async (survey_id) => {
  try {
    console.log(survey_id)
    const res = await api.get(`surveys/${survey_id}`)
    return res
  } catch (error) {
    // Return response to indicate no survey exists
    return error.response
  }
}

const getSurveyDetails = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`assignments/${assignment_id}/surveys`)
    return res
  } catch (error) {
    // Return response to indicate no survey exists
    return error.response
  }
}

const getAllSurveyByUserId = async (user_id) => {
  try {
    const res = await api.get(`user/${user_id}/surveys/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createSurvey = async ({ assignment_id, survey }) => {
  try {
    const res = await api.post(`assignments/${assignment_id}/surveys/`, survey)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const saveSurvey = async ({ course_id, assignment_id, survey: survey }) => {
  try {
    const res = await api.patch(`assignments/${assignment_id}/surveys/`, {
      survey_info: survey
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editSurveyTemplate = async ({ feedback_survey_id, survey }) => {
  try {
    const res = await api.patch(`surveys/${feedback_survey_id}`, survey)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const deleteSurveyTemplate = async ({ feedback_survey_id }) => {
  try {
    const res = await api.delete(`surveys/${feedback_survey_id}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export {
  getSurvey,
  getSurveyDetails,
  getAllSurveyByUserId,
  getSurveyById,
  createSurvey,
  saveSurvey,
  editSurveyTemplate,
  deleteSurveyTemplate
}
