import { configureStore } from '@reduxjs/toolkit'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from '@remix-run/router'
import userReducer from './user/userSlice'
import courseReducer from './course/courseSlice'
import assignmentReducer from './assignment/assignmentSlice'
import surveyReducer from './survey/surveySlice'

const history = createBrowserHistory()
const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    assignment: assignmentReducer,
    survey: surveyReducer,
    router: connectRouter(history)
  }
})

export default store
