import { createSlice } from "@reduxjs/toolkit";
export const individualAdDataSlice = createSlice({
    initialState: {
     data: {

     }
    } , 
    name: 'individualAdData' , 
    reducers: {
        setIndividualAdData(state , action) {
            state.data = action.payload.payload
        }
    }
})
export const {setIndividualAdData} = individualAdDataSlice.actions
export default individualAdDataSlice.reducer