import {createAction} from '@reduxjs/toolkit';

const loginUserAction = createAction("users/LOGIN_USER");
const logoutUserAction = createAction("users/LOGOUT_USER");

const fetchingUsersAction = createAction("users/FETCHING_USERS");
const addUsersAction = createAction("users/ADD_USERS");
const clearUsersAction = createAction("users/CLEAR_USERS");

const selectUserAction = createAction("users/SELECT_USER");
const updateUserAction = createAction("users/UPDATE_USER");
const clearSelectedUserAction = createAction("users/CLEAR_SELECTED_USER")



const fetchingUsers = (fetching) =>{
    return {
        type:fetchingUsersAction.type,
        payload:{
            fetching
        }
    }
}

const loginUser = (user) => {
    return {
        type:loginUserAction.type,
        payload:{
            current:{
                isLogged:true,
                user
            }
        }
    }
}

const logoutUser = () => {
    return {
        type:logoutUserAction.type,
    }
}

const addUsers = (users) => {
    return {
        type:addUsersAction.type,
        payload:{
            all:users
        }
    }
}

const clearUsers = () => {
    return {
        type:clearUsersAction.type,
    }
}

const selectUser = (user) => {
    return {
        type:selectUserAction.type,
        payload:{
            selected:user
        }
    }
}

const updateUser = (user) => {
    return {
        type:updateUserAction.type,
        payload:{
            user
        }
    }
}

const clearSelectedUser = () => {
    return {
        type:clearSelectedUserAction.type,
    }
}

export {
    loginUserAction,
    logoutUserAction,
    fetchingUsersAction,
    addUsersAction,
    clearUsersAction,
    selectUserAction,
    updateUserAction,
    clearSelectedUserAction,
    loginUser,
    logoutUser,
    fetchingUsers,
    addUsers,
    clearUsers,
    selectUser,
    updateUser,
    clearSelectedUser
}