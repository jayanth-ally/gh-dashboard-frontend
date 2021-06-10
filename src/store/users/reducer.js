import {createSlice} from '@reduxjs/toolkit';

import * as localStorage from '../../utils/localStorage';

import {
    loginUserAction,
    logoutUserAction,
    fetchingUsersAction,
    addUsersAction,
    clearUsersAction,
    selectUserAction,
    updateUserAction,
    clearSelectedUserAction
} from './actions';

const initialState = {
    all:[],
    selected:{},
    current:{
        isLogged:localStorage.isUserLoggedIn(),
        user:localStorage.getUserLogin()
    },
    fetching:false
}

const users = createSlice({
    name:'users',
    initialState,
    extraReducers:{
        [loginUserAction.type]: (users,{payload}) => {
            users.current = payload.current;
            localStorage.setUserLogin(payload.current);
            return users;
        },
        [logoutUserAction.type]: (users,{payload}) => {
            users.current = initialState.current;
            localStorage.logoutUser();
            return users;
        },
        [fetchingUsersAction.type]: (users,{payload}) => {
            users.fetching = payload.fetching;
            return users;
        },
        [addUsersAction.type]: (users,{payload}) => {
            users.all = payload.all;
            users.fetching = false;
            return users;
        },
        [clearUsersAction.type]: (users,{payload}) => {
            users = initialState;
            return users;
        },
        [selectUserAction.type]: (users,{payload}) => {
            users.selected = payload.selected;
            return users;
        },
        [updateUserAction.type]: (users,{payload}) => {
            const userIndex = users.all.findIndex((user) => user.id === payload.user.id);
            const selected = {...users.all[userIndex],...payload.user};
            users.all[userIndex] = selected;
            // users.selected = selected;
            return users;
        },
        [clearSelectedUserAction.type]: (users,{payload}) => {
            users.selected = {};
            return users;
        }
    }
})

const usersReducer = users.reducer;
export default usersReducer;