import reposReducer from './repos/reducer';
import usersReducer from './users/reducer';
import teamsReducer from './teams/reducer';
import orgDataReducer from './org/reducer';
const {combineReducers} = require('@reduxjs/toolkit');


const reducer = combineReducers({
    repos:reposReducer,
    users:usersReducer,
    teams:teamsReducer,
    org:orgDataReducer,
});

export default reducer;