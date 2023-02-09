import axios from 'axios'
import config from '../../utils/constants'

const create = async (course) => {
  try {
    const res = await axios({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      method: 'POST',
      url: `${config.API_URL}/courses/`,
      data: JSON.stringify(course)
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { create }
