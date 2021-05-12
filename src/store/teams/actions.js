import {createAction} from '@reduxjs/toolkit';

const addTeamsAction = createAction("users/ADD_TEAMS");
const addTeamAction = createAction("users/ADD_TEAM");
const clearTeamsAction = createAction("users/CLEAR_TEAMS");

const selectTeamAction = createAction("users/SELECT_TEAM");
const updateTeamAction = createAction("users/UPDATE_TEAM");
const deleteTeamAction = createAction("users/DELETE_TEAM");
const clearSelectedTeamAction = createAction("users/CLEAR_SELECTED_TEAM")

const addTeams = (teams) => {
    return {
        type:addTeamsAction.type,
        payload:{
            all:teams
        }
    }
}

const addTeam = (team) => {
    return {
        type:addTeamAction.type,
        payload:{
            team
        }
    }
}

const clearTeams = () => {
    return {
        type:clearTeamsAction.type,
    }
}

const selectTeam = (team) => {
    return {
        type:selectTeamAction.type,
        payload:{
            selected:team
        }
    }
}

const updateTeam = (team) => {
    return {
        type:updateTeamAction.type,
        payload:{
            team
        }
    }
}

const deleteTeam = (team) => {
    console.log('deleting...',team)
    return {
        type:deleteTeamAction.type,
        payload:{
            team
        }
    }
}

const clearSelectedTeam = () => {
    return {
        type:clearSelectedTeamAction.type,
    }
}

export {
    addTeamsAction,
    addTeamAction,
    clearTeamsAction,
    selectTeamAction,
    updateTeamAction,
    deleteTeamAction,
    clearSelectedTeamAction,
    addTeams,
    addTeam,
    clearTeams,
    selectTeam,
    updateTeam,
    deleteTeam,
    clearSelectedTeam
}