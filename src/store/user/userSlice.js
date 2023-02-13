import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginApi } from '../../api/login'
import { mockUser } from '../../utils/mockData'

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
    builder.addCase(login.fulfilled, (state, action) => ({
      user: mockUser,
      status: 'success'
    }))
    builder.addCase(login.rejected, (state) => ({ ...state, status: 'failed' }))
  }
})

export default userSlice.reducer
