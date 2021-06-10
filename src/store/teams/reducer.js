import {createSlice} from '@reduxjs/toolkit';

import {
    addTeamsAction,
    addTeamAction,
    clearTeamsAction,
    selectTeamAction,
    updateTeamAction,
    deleteTeamAction,
    clearSelectedTeamAction
} from './actions';

const initialState = {
    all:[],
    selected:{}
}

const teams = createSlice({
    name:'teams',
    initialState,
    extraReducers:{
        [addTeamsAction.type]: (teams,{payload}) => {
            teams.all = payload.all;
            return teams;
        },
        [addTeamAction.type]: (teams,{payload}) => {
            teams.all.push(payload.team);
            return teams;
        },
        [clearTeamsAction.type]: (teams,{payload}) => {
            teams = initialState;
            return teams;
        },
        [selectTeamAction.type]: (teams,{payload}) => {
            teams.selected = payload.selected;
            return teams;
        },
        [updateTeamAction.type]: (teams,{payload}) => {
            const teamIndex = teams.all.findIndex((team) => team._id === payload.team._id);
            const selected = {...teams.all[teamIndex],...payload.team};
            teams.all[teamIndex] = selected;
            teams.selected = selected;
            return teams;
        },
        [deleteTeamAction.type]: (teams,{payload}) => {
            teams.all = teams.all.filter((team)=> team._id !== payload.team._id);
            teams.selected = {};
            return teams;
        },
        [clearSelectedTeamAction.type]: (teams,{payload}) => {
            teams.selected = {};
            return teams;
        }
    }
})

const usersReducer = teams.reducer;
export default usersReducer;