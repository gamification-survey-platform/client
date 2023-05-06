import { createSlice, current } from '@reduxjs/toolkit'
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
    deleteCourse: (state, action) => state.filter((course) => course.pk !== action.payload),
    addCoursePoints: (state, action) => {
      const { course_id, points } = action.payload
      const course = state.find((course) => course.pk === course_id)
      const newCourse = { ...course, points }
      const otherCourses = state.filter((course) => course.pk !== course_id)
      return [...otherCourses, newCourse]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  }
})

export const { setCourses, addCourse, editCourse, deleteCourse, addCoursePoints } =
  coursesSlice.actions

export default coursesSlice.reducer
