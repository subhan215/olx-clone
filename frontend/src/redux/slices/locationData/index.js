import { createSlice } from "@reduxjs/toolkit";
export const locationDataSlice = createSlice({
    initialState: {
       province:'',
       city:''
    } , 
    name: 'locationData' , 
    reducers: {
        setProvinceWithRedux(state , action) {
            console.log(action)
            state.province = action.payload
        },
        setCityWithRedux(state , action) {
            console.log(action)
            state.city = action.payload
        }
    }
})
export const {setCityWithRedux , setProvinceWithRedux} = locationDataSlice.actions
export default locationDataSlice.reducer