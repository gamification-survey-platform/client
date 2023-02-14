import { validateUser } from '../utils/validators'
import api from './apiUtils'

const getUsers = async () => {
  try {
    if (!validateUser) throw new Error('User is not authenticated')
    const res = await api.get('users')
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export { getUsers }
