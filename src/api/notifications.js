import api from '../api/apiUtils'

const sendNotification = async ({ type, receiver, text = '' }) => {
  try {
    const data = { type, receiver, text }
    const res = await api.post('notifications/', data)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getNotifications = async () => {
  try {
    const res = await api.get('notifications/')
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { sendNotification, getNotifications }
