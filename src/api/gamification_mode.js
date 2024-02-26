import api from './apiUtils'

const changeGamificationMode = async (user_id, new_mode) => {
  try {
    const data = { gamification_mode: new_mode }
    const res = await api.patch(`/users/${user_id}/`, data)
    return res
  } catch (error) {
    throw new Error(error.message)
  }
}

export { changeGamificationMode }
