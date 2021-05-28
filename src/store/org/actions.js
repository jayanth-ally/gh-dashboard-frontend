import {createAction} from '@reduxjs/toolkit';

const addOrgDataAction = createAction("ord/ADD_ORG_DATA");
const clearOrgDataAction = createAction("org/CLEAR_ORG_DATA");

const addOrgData = (data) => {
    return {
        type:addOrgDataAction.type,
        payload:{
            data
        }
    }
}

const clearOrgData = () => {
    return {
        type:clearOrgDataAction.type,
    }
}


export {
    addOrgDataAction,
    clearOrgDataAction,
    addOrgData,
    clearOrgData,
}