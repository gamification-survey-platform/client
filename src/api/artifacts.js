import api from '../api/apiUtils'

const getArtifact = async ({ course_id, assignment_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/assignments/${assignment_id}/artifacts/`, {
      responseType: 'arraybuffer'
    })
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
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
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export { getArtifact, submitArtifact }
