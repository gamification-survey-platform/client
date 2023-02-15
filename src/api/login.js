import api from './apiUtils'
//import { persistor } from '../store/store'

const login = async ({ andrewId, password }) => {
  try {
    const res = await api.post(`login/`, { andrew_id: andrewId, password })
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
