import api from '../api/apiUtils'

const getHistoricalArtifactReviews = async () => {
  try {
    const res = await api.get(`historical_reviews/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getAnswerHistory = async () => {
  try {
    const res = await api.get(`answer_history/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getHistoricalArtifactReviews, getAnswerHistory }
