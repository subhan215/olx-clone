import { createSlice } from "@reduxjs/toolkit";
export const viewAllSlice = createSlice({
    initialState: {
       data: [] , 
       type: ""
    } , 
    name: 'viewAll' , 
    reducers: {
        setViewAllWithRedux(state , action) {
            console.log(action)
            state.data = action.payload.data
            state.type = action.payload.type
        }
    }
})
export const {setViewAllWithRedux} = viewAllSlice.actions
export default viewAllSlice.reducer