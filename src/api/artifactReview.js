import api from '../api/apiUtils'

const getArtifactReviews = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/assignments/${assignment_id}/artifact_reviews/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getArtifactReview = async ({ course_id, assignment_id, review_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/${review_id}`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const saveArtifactReview = async ({ course_id, assignment_id, review_id, review }) => {
  try {
    const res = await api.patch(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/${review_id}/`,
      {
        artifact_review_detail: review
      }
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { getArtifactReviews, getArtifactReview, saveArtifactReview }
