import { configureStore } from '@reduxjs/toolkit'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from '@remix-run/router'
import userReducer from './user/userSlice'
import courseReducer from './course/courseSlice'

const history = createBrowserHistory()
const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    router: connectRouter(history)
  }
})

export default store
