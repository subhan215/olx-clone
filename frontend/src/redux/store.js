import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './slices/userData'
import adsDataReducer from "./slices/adsData"
export const store = configureStore({
  reducer: {
    userData:userDataReducer , 
    adsData: adsDataReducer
  },
})