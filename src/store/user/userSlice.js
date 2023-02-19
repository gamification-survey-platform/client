import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginApi, logout as removeToken, register as registerApi } from '../../api/login'
import { PURGE } from 'redux-persist'

export const register = createAsyncThunk('user/register', async ({ andrewId, password }) => {
  const response = await registerApi({ andrewId, password })
  return response.data
})

export const login = createAsyncThunk('user/login', async ({ andrewId, password }) => {
  const response = await loginApi({ andrewId, password })
  return response.data
})

const initialState = {
  user: null,
  status: null
}

export const STATUS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED'
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => ({
      ...state,
      status: STATUS.REGISTRATION_SUCCESS
    }))
    builder.addCase(register.rejected, (state) => ({
      ...state,
      status: STATUS.REGISTRATION_FAILED
    }))
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
        status: STATUS.LOGIN_SUCCESS
      }
    })
    builder.addCase(login.rejected, (state) => ({ ...state, status: STATUS.LOGIN_FAILED }))
    builder.addCase(PURGE, () => {
      removeToken()
      initialState
    })
  }
})

export const { logout } = userSlice.actions

export default userSlice.reducer
