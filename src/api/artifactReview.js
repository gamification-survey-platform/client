import api from '../api/apiUtils'

const assignArtifactReview = async ({ course_id, assignment_id, reviewee, reviewer }) => {
  try {
    const res = await api.post(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/`,
      { reviewee, reviewer }
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const unassignArtifactReview = async ({ course_id, assignment_id, artifact_review_id }) => {
  try {
    const res = await api.delete(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/`,
      { data: { artifact_review_id } }
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getAssignmentArtifactReviews = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/assignments/${assignment_id}/artifact_reviews/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getUserArtifactReviews = async (userId) => {
  try {
    const res = await api.get(`artifact_reviews/${userId}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getOptionalReview = async (userId) => {
  try {
    const res = await api.get(`optional_reviews/${userId}`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getArtifactReview = async ({ course_id, assignment_id, review_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/${review_id}`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const saveArtifactReview = async ({ course_id, assignment_id, review_id, review, bonus }) => {
  try {
    const res = await api.patch(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/${review_id}/`,
      {
        artifact_review_detail: review,
        bonus: bonus
      }
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editArtifactReviewStatus = async ({
  course_id,
  assignment_id,
  artifact_review_id,
  status
}) => {
  try {
    const res = await api.patch(
      `courses/${course_id}/assignments/${assignment_id}/artifact_reviews/${artifact_review_id}/status/`,
      {
        status
      }
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getArtifactReviewers = async ({ course_id, assignment_id, artifact_id }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_id}/artifact_reviews`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export {
  getAssignmentArtifactReviews,
  getUserArtifactReviews,
  getArtifactReviewers,
  getArtifactReview,
  saveArtifactReview,
  assignArtifactReview,
  unassignArtifactReview,
  editArtifactReviewStatus,
  getOptionalReview
}
