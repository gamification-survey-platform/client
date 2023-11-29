import api from './apiUtils'
import { writeToS3 } from '../utils/s3helpers'

const getPurchases = async () => {
  try {
    const res = await api.get(`/purchases`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCoursePurchases = async ({ course_id }) => {
  try {
    const res = await api.get(`/courses/${course_id}/purchases`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const patchCoursePurchases = async ({ course_id, purchase }) => {
  try {
    const purchase_id = purchase.pk
    const res = await api.patch(`/courses/${course_id}/purchases/${purchase_id}/`, purchase)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const getCourseRewards = async ({ course_id }) => {
  try {
    const res = await api.get(`courses/${course_id}/rewards`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const purchaseCourseReward = async ({ reward_pk }) => {
  try {
    const res = await api.patch(`rewards/${reward_pk}/`)
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const addCourseReward = async ({ course_id, reward, picture }) => {
  try {
    const formData = new FormData()
    if (reward.type === 'Other') {
      formData.set('picture', picture)
    }
    Object.keys(reward).forEach((k) => k !== 'picture' && formData.set(k, reward[k]))
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.post(`courses/${course_id}/rewards/`, formData, config)
    if (res.data && res.data.upload_url && res.data.upload_url.url && res.data.upload_url.fields) {
      const { url, fields } = res.data.upload_url
      await writeToS3({ url, file: picture, fields, method: 'POST' })
    }
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

const editCourseReward = async ({ course_id, reward_pk, reward, picture }) => {
  try {
    const formData = new FormData();
    Object.keys(reward).forEach((key) => {
      formData.set(key, reward[key]);
    });

    // Only add 'picture' to FormData if a new picture is being uploaded
    if (picture) {
      formData.set('picture', picture);
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    const res = await api.patch(`courses/${course_id}/rewards/${reward_pk}/`, formData, config);
    if (res.data && res.data.upload_url && res.data.delete_url) {
      const { fields, url } = res.data.upload_url;
      await writeToS3({ url: res.data.delete_url, method: 'DELETE' });
      await writeToS3({ url, fields, file: picture, method: 'POST' });
    }
    return res;
  } catch (error) {
    console.error("Error in editCourseReward:", error);
    if (error.response) {
      console.error("Server response:", error.response);
    }
  }
};

const deleteCourseReward = async ({ course_id, reward_pk }) => {
  try {
    const res = await api.delete(`courses/${course_id}/rewards/${reward_pk}`)
    if (res.data && res.data.delete_url) {
      await writeToS3({ url: res.data.delete_url, method: 'DELETE' })
    }
    return res
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export {
  getPurchases,
  getCoursePurchases,
  patchCoursePurchases,
  getCourseRewards,
  addCourseReward,
  editCourseReward,
  deleteCourseReward,
  purchaseCourseReward
}
