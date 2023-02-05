import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: [logger]
})

export default store
