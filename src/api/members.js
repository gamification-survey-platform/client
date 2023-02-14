import { validateAdmin, validateUser } from '../utils/validators'
import api from './apiUtils'

const addMember = async (courseId, memberId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have the appropriate role')
    const res = await api.post(`courses/${courseId}/members/`, { andrew_id: memberId })
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

const getMembers = async (courseId, memberId = null) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const url = memberId
      ? `courses/${courseId}/members/${memberId}/`
      : `courses/${courseId}/members/`
    const res = await api.get(url)
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

const remindMember = async (courseId, memberId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have apprioriate role')
    const res = await api.post(`courses/${courseId}/members/${memberId}/remind`)
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

const removeMember = async (courseId, memberId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have apprioriate role')
    const res = await api.delete(`courses/${courseId}/members/${memberId}/`)
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export { addMember, getMembers, remindMember, removeMember }
