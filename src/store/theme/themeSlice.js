import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

const initialState = {
  color: null,
  cursor: null,
  multiple_choice: null
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorTheme: (state, action) => {
      const nonemptyPayload = {}
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key].length) nonemptyPayload[key] = action.payload[key]
      })
      const oldColors = state.color ? state.color : {}
      return { ...state, color: { ...oldColors, ...nonemptyPayload } }
    },
    resetColorTheme: (state) => ({ ...state, color: null }),
    setCursor: (state, action) => ({ ...state, cursor: action.payload }),
    resetCursor: (state) => ({ ...state, cursor: null }),
    setMultipleChoice: (state, action) => ({ ...state, multiple_choice: action.payload })
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  }
})

export const { setColorTheme, resetColorTheme, setCursor, resetCursor, setMultipleChoice } =
  themeSlice.actions

export default themeSlice.reducer
