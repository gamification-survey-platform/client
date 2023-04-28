import axios from 'axios'

const uploadToS3 = async (url, file, fields) => {
  const formData = new FormData()
  for (const key in fields) {
    formData.append(key, fields[key])
  }
  formData.append('file', file)
  const res = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res
}

export { uploadToS3 }
