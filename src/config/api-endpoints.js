// Base url
const BASE_URL = "http://localhost:5000/api";

// API end points
// GET
const TESTING_API = BASE_URL + "/";
const GET_ALL_REPOS = BASE_URL + "/repos";
const GET_ALL_USERS = BASE_URL + "/users";
const GET_ALL_PRS = BASE_URL + "/pulls";
// append user_id /:id 
const GET_USER_BY_ID = BASE_URL + "/user";

// POST
const LOGIN_USER = BASE_URL + "/login";
const LOGOUT_USER = BASE_URL + "/logout";

export {
    TESTING_API,
    GET_ALL_REPOS,
    GET_ALL_USERS,
    GET_USER_BY_ID,
    GET_ALL_PRS,
    LOGIN_USER,
    LOGOUT_USER
}