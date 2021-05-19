import {createSlice} from '@reduxjs/toolkit';

import {addReposAction,clearReposAction,selectRepoAction, clearSelectedRepoAction,addPrsAction,clearPrsAction, addPastPrsAction} from './actions';

const initialState = {
    all:[],
    selected:{}
}

const repos = createSlice({
    name:'repos',
    initialState,
    extraReducers:{
        [addReposAction.type]: (repos,{payload}) => {
            payload.all.map((repo)=>{
                repos.all.push({...repo,prs:[],pastPrs:[]});
            })
            return repos;
        },
        [clearReposAction.type]: (repos) => {
            repos = initialState;
            return repos;
        },
        [selectRepoAction.type]: (repos,{payload}) => {
            repos.selected = payload.selected;
            return repos;
        },
        [clearSelectedRepoAction.type]: (repos) => {
            repos.selected = {};
            return repos;
        },
        [addPrsAction.type]: (repos,{payload}) => {
            let index = repos.all.findIndex((repo)=>repo.id === payload.repo.id);
            repos.all[index].prs = payload.prs;
            return repos;
        },
        [addPastPrsAction.type]: (repos,{payload}) => {
            let index = repos.all.findIndex((repo)=>repo.id === payload.repo.id);
            repos.all[index].pastPrs = payload.prs;
            return repos;
        }
    }
})

const reposReducer = repos.reducer;
export default reposReducer;