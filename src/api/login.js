import api from './apiUtils'

const register = async ({ andrewId, password }) => {
  try {
    const res = await api.post(`register/`, { andrew_id: andrewId, password })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

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

export { register, login, logout, isAuthenticated }
