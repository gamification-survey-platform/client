import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginApi, logout as removeToken } from '../../api/login'
import { PURGE } from 'redux-persist'

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
  reducers: {
    logout: () => initialState
  },
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
      const dateJoined = new Date(action.payload.date_joined).toDateString()
      const role = action.payload.is_staff ? 'admin' : 'user'
      const user = { andrewId, firstName, lastName, email, isActive, dateJoined, role }
      return {
        user,
        status: 'success'
      }
    })
    builder.addCase(login.rejected, (state) => ({ ...state, status: 'failed' }))
    builder.addCase(PURGE, () => {
      removeToken()
      initialState
    })
  }
})

export const { logout } = userSlice.actions

export default userSlice.reducer
