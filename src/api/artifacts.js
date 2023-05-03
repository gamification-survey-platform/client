import api from '../api/apiUtils'
import { writeToS3 } from '../utils/s3helpers'

const getUserArtifact = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/assignments/${assignment_id}/artifacts/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const getArtifact = async ({ course_id, assignment_id, artifact_pk }) => {
  try {
    const res = await api.get(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/${artifact_pk}`
    )
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const submitArtifact = async ({ course_id, assignment_id, submission }) => {
  try {
    const formData = new FormData()
    formData.append('artifact', submission)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.post(
      `courses/${course_id}/assignments/${assignment_id}/artifacts/`,
      formData,
      config
    )
    if (res.data && res.data.upload_url && res.data.upload_url.url && res.data.upload_url.fields) {
      const { url, fields } = res.data.upload_url
      const s3Res = await writeToS3({ url, fields, method: 'POST', file: submission })
      return s3Res
    } else {
      return res
    }
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

const submitArtifactExp = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.patch('/exp/', {
      operation: 'assignment',
      method: 'POST',
      api: `courses/${course_id}/assignments/${assignment_id}/artifacts/`
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}

export { getUserArtifact, getArtifact, submitArtifact, submitArtifactExp }
