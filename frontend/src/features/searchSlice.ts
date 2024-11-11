import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface searchState{
    query:string
}
const initialState:searchState={
    query:''
};

const searchSlice =createSlice({
    name:'search',
    initialState,
    reducers:{
        setSearchQuery:(state,action:PayloadAction<string>)=>{
            state.query=action.payload;
        }
    }
});

export const {setSearchQuery}=searchSlice.actions
export default searchSlice.reducer
