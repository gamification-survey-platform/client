import api from '../api/apiUtils'

const getCourseTrivia = async (course_id) => {
  try {
    const res = await api.get(`courses/${course_id}/trivia`)
    return res.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const markTriviaAsCompleted = async (triviaId, hintsUsed, userAnswer) => {
  try {
    const res = await api.post(`trivia/${triviaId}/complete`, { hintsUsed, answer: userAnswer })
    return res.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Could not mark trivia as completed')
  }
}

export { getCourseTrivia, markTriviaAsCompleted }
