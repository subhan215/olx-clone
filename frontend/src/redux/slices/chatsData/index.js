import { createSlice } from "@reduxjs/toolkit";
const chatDataSlice = createSlice({
    name:'chatData',
    initialState:{
        chats:null,
        messages:[]
    },
    reducers:{
        setChatData:(state,action)=>{
            console.log(action)
            state.chats = action.payload
        },
        setChatMessages: (state, action) => {
            state.messages = action.payload;
          },
    }
})

export const {setChatData,setChatMessages } = chatDataSlice.actions
export default chatDataSlice.reducer