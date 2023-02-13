import axios from 'axios'
import config from '../utils/constants'

const api = axios.create({
  baseURL: `${config.API_URL}/`
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
