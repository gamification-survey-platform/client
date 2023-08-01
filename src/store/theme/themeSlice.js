import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import MC1 from '../../assets/multiple-choice/multiChoice1.png'
import MC2 from '../../assets/multiple-choice/multiChoice2.png'
import MC3 from '../../assets/multiple-choice/multiChoice3.png'
import T1 from '../../assets/multiple-choice/target1.png'
import T2 from '../../assets/multiple-choice/target2.png'
import T3 from '../../assets/multiple-choice/target3.png'
const initialState = {
  color: null,
  cursor: null,
  is_published: false,
  multiple_choice_item: MC1,
  scale_multiple_choice_item: MC2,
  multiple_select_item: MC3,
  multiple_choice_target: T1,
  scale_multiple_choice_target: T2,
  multiple_select_target: T3
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
    setIconTheme: (state, action) => {
      const { field, url } = action.payload
      return { ...state, [field]: url }
    },
    resetIconTheme: (state) => {
      const newIconState = {}
      Object.keys(initialState).forEach((key) => {
        if (key.includes('item') || key.includes('target')) {
          newIconState[key] = initialState[key]
        }
      })
      return { ...state, ...newIconState }
    },
    setTheme: (state, action) => ({ ...state, ...action.payload })
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  }
})

export const {
  setColorTheme,
  resetColorTheme,
  setCursor,
  resetCursor,
  setIconTheme,
  resetIconTheme,
  setTheme
} = themeSlice.actions

export default themeSlice.reducer
