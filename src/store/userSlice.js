import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login } from './api'

const loginThunk = createAsyncThunk('user/login', async ({ username, password }) => {
  const response = await login({ username, password })
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    firstName: 'Name',
    lastName: 'Name',
    andrewId: 'AndrewID',
    email: 'andrewID@andrew.cmu.edu',
    role: 'user'
  },
  reducers: {
    setUser: (state) => {},
    editUser: (state, action) => {
      state = { ...action.payload }
    },
    deleteUser: () => {}
  }
})
export const { setUser, editUser, deleteUser } = userSlice.actions
export default userSlice.reducer
