import api from './apiUtils'

const addMember = async ({ course_id, memberId, memberRole, teamId = null }) => {
  try {
    const res = await api.post(`courses/${course_id}/members/`, {
      andrew_id: memberId,
      userRole: memberRole,
      team: teamId || ''
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getMembers = async ({ course_id, andrew_id = null }) => {
  try {
    const config = andrew_id ? { params: { andrew_id } } : {}
    const res = await api.get(`courses/${course_id}/members/`, config)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const remindMember = async ({ course_id, memberId }) => {
  try {
    const res = await api.post(`courses/${course_id}/members/`)
    return res.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const removeMember = async ({ course_id, andrew_id }) => {
  try {
    const res = await api.delete(`courses/${course_id}/members/`, {
      params: { andrew_id }
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { addMember, getMembers, remindMember, removeMember }
