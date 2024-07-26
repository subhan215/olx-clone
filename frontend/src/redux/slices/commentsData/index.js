import { createSlice } from "@reduxjs/toolkit";


export const commentsDataSlice = createSlice({
    initialState: {
       data: []
    } , 
    name: 'blogData' , 
    reducers: {
        setCommentDataWithRedux(state , action) {
            console.log(action)
            state.data = action.payload.payload
        }
    }
})
export const {setCommentDataWithRedux} = commentsDataSlice.actions
export default commentsDataSlice.reducer