import { createSlice } from "@reduxjs/toolkit";
const chatDataSlice = createSlice({
    name:'chatData',
    initialState:{
        chats:null,
        messages:[] , 
        selectedChatId: "" , 
        selectedChat: null
    },
    reducers:{
        setChatData:(state,action)=>{
            console.log(action)
            state.chats = action.payload
        },
        setChatMessages: (state, action) => {
            state.messages = action.payload;
          },
        setChatId: (state , action) => {
            state.selectedChatId = action.payload
        } , 
        setChat:(state,action)=>{
            console.log(action)
            state.selectedChat = action.payload
        }
    }
})

export const {setChatData,setChatMessages , setChatId , setChat } = chatDataSlice.actions
export default chatDataSlice.reducer