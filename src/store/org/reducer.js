import {createSlice} from '@reduxjs/toolkit';

import {addOrgDataAction,clearOrgDataAction} from './actions';

const initialState = {
    data:{}
}

const orgData = createSlice({
    name:'prs',
    initialState,
    extraReducers:{
        [addOrgDataAction.type]: (org,{payload}) => {
            org.data = payload.data;
            return org;
        },
        [clearOrgDataAction.type]: (org,action) => {
            org.data = {};
            return org;
        }
    }
})

const orgDataReducer = orgData.reducer;
export default orgDataReducer;