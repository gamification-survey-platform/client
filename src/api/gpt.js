import api from '../api/apiUtils'

const postGPT = async ({ question_ids, answers, artifact_review_id }) => {
    try {
        const res = await api.post(`gpt-api/`, {
            question_ids: question_ids,
            answers: answers,
            artifact_review_id: artifact_review_id,
        })
        return res
    } catch (error) {
        throw new Error(error)
    }
}
export { postGPT }