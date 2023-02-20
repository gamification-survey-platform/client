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
    addCourse: (state, action) => ({ ...state, courses: [...state.courses, action.payload] }),
    editCourse: (state, action) => {
      console.log(action.payload)
      const { pk, course: newCourse } = action.payload
      const newCourses = state.courses.map((course) => (course.pk === pk ? newCourse : course))
      return {
        ...state,
        courses: newCourses
      }
    },
    deleteCourse: (state, action) => {
      const coursePk = action.payload
      const newCourses = state.courses.filter((course) => course.pk !== coursePk)
      return {
        ...state,
        courses: newCourses
      }
    }
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

export const { addCourse, editCourse, deleteCourse } = coursesSlice.actions

export default coursesSlice.reducer
