import api from './apiUtils'

const getUsers = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('User is not authenticated')
  }

  try {
    const res = await api.get('users')
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export { getUsers }
