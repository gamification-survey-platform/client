import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { create as createApi } from './api'

export const createSurvey = createAsyncThunk('course/assignment/survey', async (course) => {
  const response = await createApi(course)
  return response.data
})

const surveySlice = createSlice({
  name: 'survey',
  initialState: {
    survey: null,
    status: null
  },
  reducers: {
    addSection: (state, action) => {
      const oldSections = state.survey ? state.survey.sections : []
      const newSection = {
        ...action.payload,
        questions: []
      }
      return {
        ...state,
        survey: {
          ...state.survey,
          sections: [...oldSections, newSection]
        }
      }
    },
    addQuestion: (state, action) => {
      const { sectionIdx, question } = action.payload
      const sections = [...state.survey.sections]
      sections[sectionIdx].questions.push(question)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createSurvey.pending, (state, action) => ({
      survey: { ...action.meta.arg, sections: [] },
      status: 'pending'
    }))
    builder.addCase(createSurvey.fulfilled, (state) => ({ ...state, status: 'success' }))
    builder.addCase(createSurvey.rejected, () => ({ survey: null, status: 'failed' }))
  }
})

export const { addSection, addQuestion } = surveySlice.actions

export default surveySlice.reducer
