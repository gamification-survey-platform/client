import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import { getUserCourses } from '../../api/courses'

export const getCourses = createAsyncThunk('courses/get', async (andrewId) => {
  const response = await getUserCourses(andrewId)
  return response.data
})

const initialState = {
  courses: [],
  status: null
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    resetCourse: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(getCourses.fulfilled, (state, action) => ({
      courses: action.payload,
      status: 'success'
    }))
    builder.addCase(getCourses.rejected, (state) => ({ ...state, status: 'failed' }))
    builder.addCase(PURGE, () => initialState)
  }
})

export const { resetCourse } = coursesSlice.actions

export default coursesSlice.reducer
