import axios from 'axios'

const writeToS3 = async ({ url, fields = null, method = 'POST', file = null }) => {
  const axiosOptions = { method, url }
  if (fields) {
    const formData = new FormData()
    for (const key in fields) {
      formData.append(key, fields[key])
    }
    if (file) formData.append('file', file)
    axiosOptions.data = formData
    axiosOptions.headers = { 'Content-Type': 'multipart/form-data' }
  }
  const res = await axios(axiosOptions)
  return res
}

export { writeToS3 }
