import axios from 'axios'
import config from '../../utils/constants'

const api = axios.create({
  baseURL: `${config.API_URL}/`
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

const login = async ({ username, password }) => {
  try {
    const res = await api.post(`users/${username}`, { username, password })
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
