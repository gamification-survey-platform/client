import { createSlice } from '@reduxjs/toolkit'
import { login as loginApi, logout as removeToken, register as registerApi } from '../../api/login'
import { PURGE } from 'redux-persist'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState,
    setUser: (state, action) => ({ ...state, ...action.payload })
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      removeToken()
      initialState
    })
  }
})

export const { logout, setUser } = userSlice.actions

export default userSlice.reducer
