import reposReducer from './repos/reducer';
import usersReducer from './users/reducer';
import teamsReducer from './teams/reducer';
import prsReducer from './prs/reducer';
const {combineReducers} = require('@reduxjs/toolkit');


const reducer = combineReducers({
    repos:reposReducer,
    users:usersReducer,
    teams:teamsReducer,
    prs:prsReducer,
});

export default reducer;