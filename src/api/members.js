import { validateAdmin, validateUser } from '../utils/validators'
import api from './apiUtils'

const addMember = async ({ course_id, memberId, memberRole, teamId = null }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have the appropriate role')
    const res = await api.post(`courses/${course_id}/members/`, {
      andrew_id: memberId,
      membershipRadios: memberRole,
      team_name: teamId || ''
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getMembers = async ({ course_id, andrew_id = null }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    const config = andrew_id ? { params: { andrew_id } } : {}
    const res = await api.get(`courses/${course_id}/members/`, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const remindMember = async ({ course_id, memberId }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have apprioriate role')
    const res = await api.post(`courses/${course_id}/members/`)
    return res.data
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const removeMember = async ({ course_id, andrew_id }) => {
  try {
    if (!validateUser()) throw new Error('User is not authenticated')
    if (!validateAdmin()) throw new Error('User does not have apprioriate role')
    const res = await api.delete(`courses/${course_id}/members/`, {
      params: { andrew_id }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { addMember, getMembers, remindMember, removeMember }
