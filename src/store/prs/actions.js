import {createAction} from '@reduxjs/toolkit';

const addPrsAction = createAction("PR/ADD_PRS");
const clearPrsAction = createAction("PR/CLEAR_PRS");

const addPrs = (prs) => {
    return {
        type:addPrsAction.type,
        payload:{
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
    addPrsAction,
    clearPrsAction,
    addPrs,
    clearPrs,
}