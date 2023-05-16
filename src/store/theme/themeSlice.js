import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => ({ ...state, ...action.payload }),
    resetTheme: () => initialState
  }
})

export const { setTheme, resetTheme } = themeSlice.actions

export default themeSlice.reducer
