import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

const initialState = []

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (_, action) => action.payload,
    addCourse: (state, action) => [...state, action.payload],
    editCourse: (state, action) => {
      const { pk, course: newCourse } = action.payload
      const newCourses = state.map((course) => (course.pk === pk ? newCourse : course))
      return newCourses
    },
    deleteCourse: (state, action) => state.filter((course) => course.pk !== action.payload)
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  }
})

export const { setCourses, addCourse, editCourse, deleteCourse } = coursesSlice.actions

export default coursesSlice.reducer
