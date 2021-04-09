import reposReducer from './repos/reducer';
import usersReducer from './users/reducer';
const {combineReducers} = require('@reduxjs/toolkit');


const reducer = combineReducers({
    repos:reposReducer,
    users:usersReducer,
});

export default reducer;