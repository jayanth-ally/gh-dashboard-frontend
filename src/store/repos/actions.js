import {createAction} from '@reduxjs/toolkit';

const addReposAction = createAction("repos/ADD_REPOS");
const clearReposAction = createAction("repos/CLEAR_REPOS");

const selectRepoAction = createAction("repos/SELECT_REPO");
const clearSelectedRepoAction = createAction("repos/CLEAR_SELECTED_REPO");

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

export {
    addReposAction,
    clearReposAction,
    selectRepoAction,
    clearSelectedRepoAction,
    addRepos,
    clearRepos,
    selectRepo,
    clearSelectedRepo
}