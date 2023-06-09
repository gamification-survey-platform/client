import api from './apiUtils'
import { writeToS3 } from '../utils/s3helpers'

const getTheme = async () => {
  try {
    const res = await api.get(`themes/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getPublishedThemes = async () => {
  try {
    const res = await api.get(`published_themes/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editThemeIcon = async (data) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.patch(`themes/`, data, config)
    if (res.data.delete_url) {
      await writeToS3({ url: res.data.delete_url, method: 'DELETE' })
    }
    if (res.data.upload_url && res.data.upload_url.url && res.data.upload_url.fields) {
      const icon = Object.values(data)[0]
      const { url, fields } = res.data.upload_url
      await writeToS3({ url, fields, method: 'POST', file: icon })
    }
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editTheme = async (data) => {
  try {
    const res = await api.patch(`themes/`, data)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getTheme, getPublishedThemes, editTheme, editThemeIcon }
