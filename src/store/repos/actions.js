import {createAction} from '@reduxjs/toolkit';

const addReposAction = createAction("repos/ADD_REPOS");
const clearReposAction = createAction("repos/CLEAR_REPOS");

const selectRepoAction = createAction("repos/SELECT_REPO");
const clearSelectedRepoAction = createAction("repos/CLEAR_SELECTED_REPO");

const addPrsAction = createAction("repo/ADD_PRS");
const addPastPrsAction = createAction("repo/ADD_PAST_PRS");
const clearPrsAction = createAction("repo/CLEAR_PRS");

const addRepos = (repos) => {
    return {
        type:addReposAction.type,
        payload:{
            all:repos
        }
    }
}

const clearRepos = () => {
    return {
        type:clearReposAction.type,
    }
}

const selectRepo = (repo) => {
    return {
        type:selectRepoAction.type,
        payload:{
            selected:repo
        }
    }
}

const clearSelectedRepo = () => {
    return {
        type:clearSelectedRepoAction.type,
    }
}

const addPrs = (repo,prs) => {
    return {
        type:addPrsAction.type,
        payload:{
            repo,
            prs
        }
    }
}

const addPastPrs = (repo,prs) => {
    return {
        type:addPastPrsAction.type,
        payload:{
            repo,
            prs
        }
    }
}

const clearPrs = () => {
    return {
        type:clearPrsAction.type,
    }
}


export {
    addReposAction,
    clearReposAction,
    selectRepoAction,
    clearSelectedRepoAction,
    addPrsAction,
    addPastPrsAction,
    clearPrsAction,
    addRepos,
    clearRepos,
    selectRepo,
    clearSelectedRepo,
    addPrs,
    addPastPrs,
    clearPrs,
}