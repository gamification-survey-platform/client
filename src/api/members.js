import { validateAdmin, validateUser } from '../utils/validators'
import api from './apiUtils'

const addMember = async (courseId, memberId, memberRole, teamId = null) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have the appropriate role')
    const res = await api.post(`courses/${courseId}/members/`, {
      andrew_id: memberId,
      membershipRadios: memberRole,
      team_name: teamId || ''
    })
    return res
  } catch (error) {
    throw new Error(error.message)
  }
}

const getMembers = async (course_id, andrew_id = null) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const config = andrew_id ? { params: { andrew_id } } : {}
    const res = await api.get(`courses/${course_id}/members/`, config)
    return res
  } catch (error) {
    throw new Error(error.message)
  }
}

const remindMember = async (courseId, memberId) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have apprioriate role')
    const res = await api.post(`courses/${courseId}/members/`)
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}

const removeMember = async (courseId, andrew_id) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have apprioriate role')
    const res = await api.delete(`courses/${courseId}/members/`, {
      params: { andrew_id }
    })
    return res
  } catch (error) {
    throw new Error(error.message)
  }
}

export { addMember, getMembers, remindMember, removeMember }
