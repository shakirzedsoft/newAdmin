import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    villaListdata: [],
    singleViewofVilla: [],
}

const slice = createSlice({
    name: "villa",
    initialState: initialState,
    reducers: {
        villaList(state, action) {
            //villaListdata
            state.villaListdata = action.payload.data;

        },
        singleViewOfVillastate(state, action) {
            //singleViewofVilla
            state.singleViewofVilla = action.payload.data;
        }

    }
})

export default slice.reducer;

export const { villaList,singleViewOfVillastate } = slice.actions;