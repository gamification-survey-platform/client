import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserCourses } from '../../api/courses'
import { mockCourses } from '../../utils/mockData'

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
      courses: mockCourses,
      status: 'success'
    }))
    builder.addCase(getCourses.rejected, (state) => ({ ...state, status: 'failed' }))
  }
})

export const { resetCourse } = coursesSlice.actions

export default coursesSlice.reducer
