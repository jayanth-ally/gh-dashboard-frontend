// Heroku
const HEROKU_URL = "https://ally-ghdashboard-backend.herokuapp.com/api";
// Localhost
const LOCALHOST_URL = "http://localhost:5000/api";

// Base url
const BASE_URL = LOCALHOST_URL

// API end points
// GET
const TESTING_API = BASE_URL + "/";
const GET_ALL_REPOS = BASE_URL + "/repos";
const GET_ALL_TEAMS = BASE_URL + "/teams";
const GET_ALL_USERS = BASE_URL + "/users";
// append user_id /:id 
const GET_USER_BY_ID = BASE_URL + "/user";

// POST
const LOGIN_USER = BASE_URL + "/login";
const LOGOUT_USER = BASE_URL + "/logout";
// ids:[id]
const GET_USERS_BY_ID = BASE_URL + "/users";
/*   [optional] date?:{
*       from: Date,
*       to?: Date     
*   }
*/
const GET_PRS_BY_DATE = BASE_URL + "/pulls";
// ids:[id]
const GET_PRS_BY_ID = BASE_URL + "/pulls/ids";
// numbers:[number]
const GET_PRS_BY_NUMBER = BASE_URL + "/pulls";
// ids:[id]
const GET_TEAMS_BY_ID = BASE_URL + "/teams"
/*  team:{
*       name: String,
*       users: [ID]     
*   }
*/
const UPDATE_TEAM = BASE_URL + "/team";
const DELETE_TEAM = BASE_URL + "/team/delete";

export {
    TESTING_API,
    GET_ALL_REPOS,
    GET_ALL_USERS,
    GET_USER_BY_ID,
    GET_USERS_BY_ID,
    LOGIN_USER,
    LOGOUT_USER,
    GET_PRS_BY_DATE,
    GET_PRS_BY_ID,
    GET_PRS_BY_NUMBER,
    GET_ALL_TEAMS,
    GET_TEAMS_BY_ID,
    UPDATE_TEAM,
    DELETE_TEAM,
}