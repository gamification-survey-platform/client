import api from './apiUtils'

const getSurvey = async ({ courseId, assignmentId }) => {
  try {
    const res = await api.get(`/courses/${courseId}/assignments/${assignmentId}/survey`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const createSurvey = async ({ courseId, assignmentId, survey }) => {
  try {
    const res = await api.post(`/courses/${courseId}/assignments/${assignmentId}/survey`, survey)
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

export { getSurvey, createSurvey, saveSurvey, deleteSurvey }
