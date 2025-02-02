import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './slices/userData'
import adsDataReducer from "./slices/adsData"
import locationReducer from './slices/locationData'
import searchReducer from './slices/searchFilter'
import chatReducer from './slices/chatsData'
import individualAdReducer  from './slices/individualAd'
import notificationsReducer from './slices/notifications'
import transactionReducer from './slices/transactions'
import viewAllReducer from './slices/viewAll'

export const store = configureStore({
  reducer: {
    userData:userDataReducer , 
    adsData: adsDataReducer,
    locationData :locationReducer , 
    searchFilter:  searchReducer,
    chatData: chatReducer,
    searchFilter:  searchReducer , 
    individualAd: individualAdReducer , 
    notifications: notificationsReducer , 
    transactions: transactionReducer , 
    viewAll : viewAllReducer
  },
})