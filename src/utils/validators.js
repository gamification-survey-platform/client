import { decodeToken } from 'react-jwt'

const validateUser = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }
  return true
}

const validateAdmin = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }
  const decodedToken = decodeToken(token)
  if (!decodedToken.is_staff) {
    return false
  }
  return true
}

export { validateAdmin, validateUser }
