import { createSlice } from "@reduxjs/toolkit";


export const blogDataSlice = createSlice({
    initialState: {
       data: {}
    } , 
    name: 'blogData' , 
    reducers: {
        setBlogDataWithRedux(state , action) {
            console.log(action)
            state.data = action.payload.payload
        }
    }
})
export const {setBlogDataWithRedux} = blogDataSlice.actions
export default blogDataSlice.reducer