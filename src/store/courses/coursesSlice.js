import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

const initialState = []

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (_, action) => action.payload,
    addCourse: (state, action) => [...state.courses, action.payload],
    editCourse: (state, action) => {
      const { pk, course: newCourse } = action.payload
      const newCourses = state.map((course) => (course.pk === pk ? newCourse : course))
      return newCourses
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
    builder.addCase(PURGE, () => initialState)
  }
})

export const { setCourses, addCourse, editCourse, deleteCourse } = coursesSlice.actions

export default coursesSlice.reducer
