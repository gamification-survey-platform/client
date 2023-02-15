import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from '@remix-run/router'
import user from './user/userSlice'
import courses from './courses/coursesSlice'
import sessionStorage from 'redux-persist/lib/storage/session'

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage: sessionStorage
}
const history = createBrowserHistory()

const rootReducer = combineReducers({
  user,
  courses,
  router: connectRouter(history)
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
