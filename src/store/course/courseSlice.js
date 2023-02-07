import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { create as createApi } from './api'

export const createCourse = createAsyncThunk('course/create', async (course) => {
  const response = await createApi(course)
  return response.data
})

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    status: null
  },
  extraReducers: (builder) => {
    builder.addCase(createCourse.pending, () => ({ status: 'pending' }))
    builder.addCase(createCourse.fulfilled, () => ({ status: 'success' }))
    builder.addCase(createCourse.rejected, () => ({ status: 'failed' }))
  }
})

export default courseSlice.reducer
