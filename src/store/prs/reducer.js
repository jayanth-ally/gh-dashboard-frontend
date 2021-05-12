import {createSlice} from '@reduxjs/toolkit';

import {addPrsAction,clearPrsAction} from './actions';

const initialState = {
    sets:[]
}

const prs = createSlice({
    name:'prs',
    initialState,
    extraReducers:{
        [addPrsAction.type]: (pr,{payload}) => {
            pr.sets = payload.prs;
            return pr;
        },
        [clearPrsAction.type]: (pr,action) => {
            pr.sets = [];
            return pr;
        }
    }
})

const prsReducer = prs.reducer;
export default prsReducer;