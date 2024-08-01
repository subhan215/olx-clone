import { createSlice } from "@reduxjs/toolkit";
export const searchFilterSlice = createSlice({
    initialState: {
      search: ""
    } , 
    name: 'searchFilter' , 
    reducers: {
        
        setSearchFilterWithRedux(state , action) {
            console.log(action)
            state.search = action.payload.payload
        }
    }
})
export const {setSearchFilterWithRedux} = searchFilterSlice.actions
export default searchFilterSlice.reducer