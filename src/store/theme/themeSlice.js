import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import Dog from '../../assets/multiple-choice/nature/dog.jpeg'
import Cat from '../../assets/multiple-choice/nature/cat.jpeg'
import Bird from '../../assets/multiple-choice/nature/bird.jpeg'
import Bone from '../../assets/multiple-choice/nature/bone.jpeg'
import Bowl from '../../assets/multiple-choice/nature/bowl.png'
import Nest from '../../assets/multiple-choice/nature/nest.jpeg'

const initialState = {
  color: null,
  cursor: null,
  multiple_choice_item: Dog,
  scale_multiple_choice_item: Cat,
  multiple_select_item: Bird,
  multiple_choice_target: Bone,
  scale_multiple_choice_target: Bowl,
  multiple_select_target: Nest
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
    }
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
  resetIconTheme
} = themeSlice.actions

export default themeSlice.reducer
