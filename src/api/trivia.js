import api from '../api/apiUtils'


const submitTriviaAnswer = async ({ course_id, answer }) => {
    try {
      const res = await api.post(
        `courses/${course_id}/trivia`,
        {
          answer
        }
      )
      return res
    } catch (error) {
      throw new Error(error.response.data.message)
    }
  }

export { submitTriviaAnswer }