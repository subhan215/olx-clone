import { createSlice } from "@reduxjs/toolkit";
const chatDataSlice = createSlice({
    name:'chatData',
    initialState:{
        chats:null
    },
    reducers:{
        setChatData:(state,action)=>{
            console.log(action)
            state.chats = action.payload
        }
    }
})

export const {setChatData} = chatDataSlice.actions
export default chatDataSlice.reducer