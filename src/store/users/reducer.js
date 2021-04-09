import {createSlice} from '@reduxjs/toolkit';

import {
    loginUserAction,
    logoutUserAction,
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
        isLogged:false,
        user:{}
    }
}

const users = createSlice({
    name:'users',
    initialState,
    extraReducers:{
        [loginUserAction.type]: (users,{payload}) => {
            users.current = payload.current;
            return users;
        },
        [logoutUserAction.type]: (users,{payload}) => {
            users.current = initialState.current;
            return users;
        },
        [addUsersAction.type]: (users,{payload}) => {
            users.all = payload.all;
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
            users.selected = selected;
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