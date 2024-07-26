import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './slices/userData'
export const store = configureStore({
  reducer: {
    userData:userDataReducer
  },
})