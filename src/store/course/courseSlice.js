import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { create as createApi } from './api'

export const createCourse = createAsyncThunk('course/create', async (course) => {
  const response = await createApi(course)
  return response.data
})

const initialState = {
  status: null
}

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    resetCourse: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(createCourse.pending, () => ({ status: 'pending' }))
    builder.addCase(createCourse.fulfilled, () => ({ status: 'success' }))
    builder.addCase(createCourse.rejected, () => ({ status: 'failed' }))
  }
})

export const { resetCourse } = courseSlice.actions

export default courseSlice.reducer
