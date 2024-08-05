import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './slices/userData'
import adsDataReducer from "./slices/adsData"
import locationReducer from './slices/locationData'
import searchReducer from './slices/searchFilter'
import chatReducer from './slices/chatsData'
export const store = configureStore({
  reducer: {
    userData:userDataReducer , 
    adsData: adsDataReducer,
    locationData :locationReducer , 
    searchFilter:  searchReducer,
    chatData: chatReducer
  },
})