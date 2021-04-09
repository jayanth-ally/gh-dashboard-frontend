import {createSlice} from '@reduxjs/toolkit';

import {addReposAction,clearReposAction,selectRepoAction,clearSelectedRepo, clearSelectedRepoAction} from './actions';

const initialState = {
    all:[],
    selected:{}
}

const repos = createSlice({
    name:'repos',
    initialState,
    extraReducers:{
        [addReposAction.type]: (repos,{payload}) => {
            repos.all = payload.all;
            return repos;
        },
        [clearReposAction.type]: (repos,{payload}) => {
            repos = initialState;
            return repos;
        },
        [selectRepoAction.type]: (repos,{payload}) => {
            repos.selected = payload.selected;
            return repos;
        },
        [clearSelectedRepoAction.type]: (repos,{payload}) => {
            repos.selected = {};
            return repos;
        }
    }
})

const reposReducer = repos.reducer;
export default reposReducer;