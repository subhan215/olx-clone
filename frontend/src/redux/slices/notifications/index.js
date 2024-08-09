import { createSlice } from "@reduxjs/toolkit";
export const notificationsSlice = createSlice({
    initialState: {
      notifications: []
    } , 
    name: 'notifications' , 
    reducers: {
        setNotifications(state , action) {
            console.log(action)
            state.notifications = action.payload.payload
        }
    }
})
export const {setNotifications} = notificationsSlice.actions
export default notificationsSlice.reducer