import { configureStore } from '@reduxjs/toolkit'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from '@remix-run/router'
import userReducer from './userSlice'

const history = createBrowserHistory()
const store = configureStore({
  reducer: {
    user: userReducer,
    router: connectRouter(history)
  }
})

export default store
