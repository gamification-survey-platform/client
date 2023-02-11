import axios from 'axios'
import config from '../../utils/constants'

const create = async (survey) => {
  const { course_id, assignment_id, ...surveyData } = survey
  try {
    const res = await axios({
      method: 'POST',
      url: `${config.API_URL}/courses/${course_id}/assignments/${assignment_id}/survey`,
      data: JSON.stringify(surveyData)
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { create }
