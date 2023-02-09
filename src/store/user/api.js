import axios from 'axios'
import config from '../../utils/constants'

const login = async ({ username, password }) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${config.API_URL}/users/${username}`,
      data: JSON.stringify({ username, password })
    })
    localStorage.setItem('token', res.data.token)

    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}
const logout = () => {
  localStorage.removeItem('token')
}

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

export { login, logout, isAuthenticated }
