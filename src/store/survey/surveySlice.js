import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { get as getApi, save as saveApi } from './api'

export const getSurvey = createAsyncThunk(
  'course/assignment/survey/get',
  async ({ courseId, assignmentId }) => {
    const response = await getApi({ courseId, assignmentId })
    return response.data
  }
)

export const saveSurvey = createAsyncThunk('course/assignment/survey/save', async (survey) => {
  const response = await saveApi(survey)
  return response.data
})

const initialState = {
  survey: null,
  status: null
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    resetSurvey: () => initialState,
    createSurvey: (state, action) => {
      return {
        ...state,
        survey: { ...action.payload, sections: [] }
      }
    },
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
    builder.addCase(getSurvey.fulfilled, (state, action) => ({
      ...action.payload,
      status: 'success'
    }))
    builder.addCase(saveSurvey.fulfilled, (state) => ({ ...state, status: 'success' }))
    builder.addCase(saveSurvey.rejected, () => ({ survey: null, status: 'failed' }))
  }
})

export const { resetSurvey, createSurvey, addSection, addQuestion } = surveySlice.actions

export default surveySlice.reducer
