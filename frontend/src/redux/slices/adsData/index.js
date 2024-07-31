import { createSlice } from "@reduxjs/toolkit";


export const adsDataSlice = createSlice({
    initialState: {
       data: []
    } , 
    name: 'adsData' , 
    reducers: {
        setAdsDataWithRedux(state , action) {
            console.log(action)
            state.data = action.payload.payload
        }
    }
})
export const {setAdsDataWithRedux} = adsDataSlice.actions
export default adsDataSlice.reducer