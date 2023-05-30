import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import { cloneDeep } from 'lodash'
import Sentiment from 'sentiment'

const analyzeAnswer = ({ type, answer }) => {
  if (type === 'SCALEMULTIPLECHOICE') {
    if (answer.text.includes('disagree')) return -1
    else if (answer.text.includes('agree')) return 1
    else return 0
  } else if (type === 'FIXEDTEXT' || type === 'TEXTAREA') {
    const sentiment = new Sentiment()
    const { score } = sentiment.analyze(answer.text)
    if (score < 0) return -1
    return 1
  }
  return 0
}

const initialState = {
  pk: -1,
  name: '',
  instructions: '',
  other_info: '',
  sections: [],
  instructorView: true,
  progress: { startPct: 0, endPct: 0 },
  sentiment: undefined
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurvey: (state, action) => ({ ...state, ...action.payload }),
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
      const newState = cloneDeep(state)
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
      } else if (question_type === 'MULTIPLESELECT') {
        // Overwrite entire answer
        const newAnswer = []
        for (let i = 0; i < answer.length; i++) {
          const answerObj = { text: answer[i], page }
          newAnswer.push(answerObj)
        }
        newState.sections
          .find((s, i) => i === sectionIdx)
          .questions.find((q, i) => i === questionIdx).answer = newAnswer
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
      const numberOfQuestions = newState.sections.reduce(
        (prev, section) => prev + section.questions.length,
        0
      )
      const filledFields = newState.sections.reduce((prev, section) => {
        const questionsAnswered = section.questions.reduce((prev, question) => {
          if (question.answer.length) {
            return prev + 1
          } else return prev
        }, 0)
        return prev + questionsAnswered
      }, 0)
      const newProgress = {
        startPct: newState.progress.endPct,
        endPct: filledFields / numberOfQuestions
      }
      newState.progress = newProgress
      let surveySentiment = 0
      newState.sections.forEach((section) => {
        let aggregate = 0
        let count = 0
        section.questions.forEach((question) => {
          if (question.answer.length) {
            aggregate += analyzeAnswer({ type: question.question_type, answer: question.answer[0] })
            count += 1
          }
        })
        if (count > 0) {
          section.sentiment = aggregate / count
          surveySentiment += section.sentiment
        }
      })
      newState.sentiment = newState.sections.length
        ? surveySentiment / newState.sections.length
        : undefined
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
    },
    setProgress: (state, action) => ({ ...state, progress: action.payload })
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
  reorderQuestions,
  setProgress
} = surveySlice.actions

export default surveySlice.reducer
