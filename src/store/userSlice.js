import { current, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginApi } from './api'

export const login = createAsyncThunk('user/login', async ({ username, password }) => {
  const response = await loginApi({ username, password })
  return response.data
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: null
  },
  extraReducers: {
    [login.pending]: (state) => {
      return { ...state, status: 'pending' }
    },
    [login.fulfilled]: (state, action) => {
      return { user: action.payload, status: 'success' }
    },
    [login.rejected]: (state) => {
      return { ...state, status: 'failed' }
    }
  }
})

export default userSlice.reducer
