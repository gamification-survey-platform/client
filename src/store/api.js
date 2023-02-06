import axios from 'axios'
import config from '../utils/constants'

const login = async ({ username, password }) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${config.API_URL}/users/${username}`,
      data: JSON.stringify({ username, password })
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { login }
