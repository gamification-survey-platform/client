import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { create as createApi } from './api'

export const createAssignment = createAsyncThunk(
  'course/assignment/create',
  async ({ courseId, assignment }) => {
    const response = await createApi({ courseId, assignment })
    return response.data
  }
)

const initialState = {
  assignment: null,
  status: null
}

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    resetAssignment: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(createAssignment.fulfilled, (state, action) => {
      console.log(state, action)
      return { ...state, assignment: action.meta.payload, status: 'success' }
    })
    builder.addCase(createAssignment.rejected, (state) => ({ assignment: null, status: 'failed' }))
  }
})

export const { resetAssignment } = assignmentSlice.actions

export default assignmentSlice.reducer
