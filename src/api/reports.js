import api from '../api/apiUtils'

const getInstructorIpsatization = async ({
  course_id,
  assignment_id,
  ipsatization_MIN,
  ipsatization_MAX
}) => {
  try {
    const params =
      ipsatization_MIN && ipsatization_MAX ? { ipsatization_MIN, ipsatization_MAX } : {}
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/ipsatization/`,
      { params }
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getStudentStatistics = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_id}/statistics`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getKeywords = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_id}/keywords`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getArtifactAnswers = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_id}/answers`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getArtifactAnswers, getStudentStatistics, getKeywords, getInstructorIpsatization }
