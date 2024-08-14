import { createSlice } from "@reduxjs/toolkit";
export const transactionSlice = createSlice({
    initialState: {
       data: []
    } , 
    name: 'transactions' , 
    reducers: {
        setTransactionsWithRedux(state , action) {
            console.log(action)
            state.data = action.payload
        }
    }
})
export const {setTransactionsWithRedux} = transactionSlice.actions
export default transactionSlice.reducer