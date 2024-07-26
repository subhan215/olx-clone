import { createSlice } from "@reduxjs/toolkit";


export const userDataSlice = createSlice({
    initialState: {
       data: {}
    } , 
    name: 'userData' , 
    reducers: {
        setUserDataWithRedux(state , action) {
            console.log(action)
            state.data = action.payload.payload
        }
    }
})
export const {setUserDataWithRedux} = userDataSlice.actions
export default userDataSlice.reducer