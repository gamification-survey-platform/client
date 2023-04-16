import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import { cloneDeep } from 'lodash'

const initialState = {
  pk: -1,
  name: '',
  instructions: '',
  other_info: '',
  sections: [],
  instructorView: true
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurvey: (_, action) => action.payload,
    changeView: (state) => ({ ...state, instructorView: !state.instructorView }),
    addSection: (state, action) => {
      const sections = [...state.sections, { ...action.payload, questions: [] }]
      return { ...state, sections }
    },
    editSection: (state, action) => {
      const { section, pk } = action.payload
      const sections = state.sections.map((s) => (s.pk === pk ? { ...s, ...section } : s))
      return { ...state, sections }
    },
    deleteSection: (state, action) => {
      const { pk } = action.payload
      const sections = state.sections.filter((s) => s.pk !== pk)
      return { ...state, sections }
    },
    addQuestion: (state, action) => {
      const { question, sectionPk } = action.payload
      const sections = state.sections.map((s) =>
        s.pk === sectionPk ? { ...s, questions: [...s.questions, question] } : s
      )
      return { ...state, sections }
    },
    editQuestion: (state, action) => {
      const { question, questionPk, sectionPk } = action.payload
      const questions = state.sections
        .find((s) => s.pk === sectionPk)
        .questions.map((q) => (q.pk === questionPk ? { ...q, ...question } : q))
      const sections = state.sections.map((s) => (s.pk === sectionPk ? { ...s, questions } : s))
      return { ...state, sections }
    },
    deleteQuestion: (state, action) => {
      const { sectionPk, questionPk } = action.payload
      const section = state.sections.find((s) => s.pk === sectionPk)
      const questions = section.questions.filter((q) => q.pk !== questionPk)
      const sections = state.sections.map((s) => (s.pk === sectionPk ? { ...s, questions } : s))
      return { ...state, sections }
    },
    editAnswer: (state, action) => {
      const {
        sectionPk,
        questionPk,
        answer,
        question_type,
        page = undefined,
        idx = undefined,
        number_of_text = undefined
      } = action.payload
      const answerObj = { text: answer, page }
      const newState = cloneDeep(state)
      const oldAnswer = newState.sections
        .find((s) => s.pk === sectionPk)
        .questions.find((q) => q.pk === questionPk).answer
      if (question_type === 'MULTIPLETEXT' && idx >= 0 && number_of_text) {
        if (oldAnswer.length) oldAnswer[idx] = answerObj
        else {
          for (let i = 0; i < number_of_text; i++) {
            if (i === idx) oldAnswer.push(answerObj)
            else oldAnswer.push({ page, text: '' })
          }
        }
      } else if (question_type === 'SLIDEREVIEW') {
        let modified = false
        oldAnswer.forEach((a) => {
          if (a.page === page) {
            modified = true
            return answerObj
          }
          return a
        })
        if (!modified) oldAnswer.push(answerObj)
      } else {
        if (oldAnswer.length) oldAnswer[0] = answerObj
        else oldAnswer.push(answerObj)
      }
      return newState
    },
    reorderSections: (state, action) => {
      const { i, j } = action.payload
      const newSections = [...state.sections]
      const sectionI = newSections[i]
      newSections[i] = newSections[j]
      newSections[j] = sectionI
      return { ...state, sections: newSections }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  }
})

export const surveySelector = (state) => state.survey

export const {
  setSurvey,
  addSection,
  editSection,
  deleteSection,
  addQuestion,
  editQuestion,
  deleteQuestion,
  addAnswer,
  editAnswer,
  changeView,
  reorderSections
} = surveySlice.actions

export default surveySlice.reducer
