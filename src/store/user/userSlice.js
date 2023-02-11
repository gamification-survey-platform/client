import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { setCookie } from '../../utils/cookie'
import { login as loginApi } from './api'

export const login = createAsyncThunk('user/login', async ({ andrewId, password }) => {
  const response = await loginApi({ andrewId, password })
  return response.data
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: null
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => ({ ...state, status: 'pending' }))
    builder.addCase(login.fulfilled, (state, action) => {
      const { token } = action.payload
      setCookie('gamification-cookie', token)
      return {
        user: action.payload,
        status: 'success'
      }
    })
    builder.addCase(login.rejected, (state) => ({ ...state, status: 'failed' }))
  }
})

export default userSlice.reducer
