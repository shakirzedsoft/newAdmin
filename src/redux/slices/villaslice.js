import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    villaListdata : []
}

const slice = createSlice({
    name:"villa",
    initialState:initialState,
    reducers:{
        villaList(state,action){
            //villaListdata
            state.villaListdata = action.payload.data;

        }

    }
})

export default slice.reducer;

export const {villaList} = slice.actions;