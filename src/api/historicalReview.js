import api from '../api/apiUtils'

const getHistoricalArtifactReviews = async () => {
  try {
    const res = await api.get(`historical_reviews/`)
    console.log(res)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getAnswerHistory = async () => {
  try {
    const res = await api.get(`answer_history/`)
    console.log(res)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getHistoricalArtifactReviews, getAnswerHistory }
