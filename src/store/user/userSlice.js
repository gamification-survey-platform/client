import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginApi } from '../../api/login'

export const login = createAsyncThunk('user/login', async ({ andrewId, password }) => {
  const response = await loginApi({ andrewId, password })
  return response.data
})

const initialState = {
  user: null,
  status: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => ({ ...state, status: 'pending' }))
    builder.addCase(login.fulfilled, (state, action) => {
      const {
        andrew_id: andrewId,
        first_name: firstName,
        last_name: lastName,
        email,
        is_active: isActive
      } = action.payload
      const dateJoined = new Date(action.payload.date_joined)
      const role = action.payload.is_staff ? 'Admin' : 'User'
      const user = { andrewId, firstName, lastName, email, isActive, dateJoined, role }
      return {
        user,
        status: 'success'
      }
    })
    builder.addCase(login.rejected, (state) => ({ ...state, status: 'failed' }))
  }
})

export default userSlice.reducer
