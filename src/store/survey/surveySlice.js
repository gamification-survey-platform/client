import { createSlice, current } from '@reduxjs/toolkit'
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
      const sections = [{ ...action.payload, questions: [] }, ...state.sections]
      return { ...state, sections }
    },
    editSection: (state, action) => {
      const { section, sectionIdx } = action.payload
      const sections = state.sections.map((s, i) => (i === sectionIdx ? { ...s, ...section } : s))
      return { ...state, sections }
    },
    deleteSection: (state, action) => {
      const { sectionIdx } = action.payload
      const sections = state.sections.filter((s, i) => i !== sectionIdx)
      return { ...state, sections }
    },
    addQuestion: (state, action) => {
      const { question, sectionIdx } = action.payload
      const sections = state.sections.map((s, i) =>
        i === sectionIdx ? { ...s, questions: [...s.questions, question] } : s
      )
      return { ...state, sections }
    },
    editQuestion: (state, action) => {
      const { question, questionIdx, sectionIdx } = action.payload
      const questions = state.sections
        .find((s, i) => i === sectionIdx)
        .questions.map((q, i) => (i === questionIdx ? { ...q, ...question } : q))
      const sections = state.sections.map((s, i) => (i === sectionIdx ? { ...s, questions } : s))
      return { ...state, sections }
    },
    deleteQuestion: (state, action) => {
      const { sectionIdx, questionIdx } = action.payload
      const section = state.sections.find((s, i) => i === sectionIdx)
      const questions = section.questions.filter((q, i) => i !== questionIdx)
      const sections = state.sections.map((s, i) => (i === sectionIdx ? { ...s, questions } : s))
      return { ...state, sections }
    },
    editAnswer: (state, action) => {
      const {
        sectionIdx,
        questionIdx,
        answer,
        question_type,
        page = undefined,
        idx = undefined,
        number_of_text = undefined
      } = action.payload
      const answerObj = { text: answer, page }
      console.log(state)
      const newState = cloneDeep(state)
      console.log(sectionIdx, questionIdx, answer, question_type)
      const oldAnswer = newState.sections
        .find((s, i) => i === sectionIdx)
        .questions.find((q, i) => i === questionIdx).answer
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
    },
    reorderQuestions: (state, action) => {
      const { sectionIdx, i, j } = action.payload
      const section = { ...state.sections.find((_, i) => i === sectionIdx) }
      const questions = [...section.questions]
      const questionI = questions[i]
      questions[i] = questions[j]
      questions[j] = questionI
      const sections = state.sections.map((oldSection, i) =>
        i === sectionIdx ? { ...section, questions } : { ...oldSection }
      )
      return { ...state, sections }
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
  reorderSections,
  reorderQuestions
} = surveySlice.actions

export default surveySlice.reducer
