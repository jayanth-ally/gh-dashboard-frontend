import axios from 'axios';
import * as endpoint from '../config/api-endpoints';

// Only for testing purpose
import {repos} from '../assets/dev-data/sample'; 

const getRepos = async () => {
    // Only for testing purpose
    // if(repos){
    //     return repos;
    // }
    const res = await axios.get(endpoint.GET_ALL_REPOS);
    return res;
}

const getUsers = async () => {
    const res = await axios.get(endpoint.GET_ALL_USERS);
    return res;
}

const getUserById = async (id) => {
    const res = await axios.get(endpoint.GET_USER_BY_ID+'/'+id);
    return res;
}

const getUsersById = async (ids) => {
    const res = await axios.post(endpoint.GET_USERS_BY_ID,{ids});
    return res;
}

const getPrsByDate = async (repo,date=null) => {
    // Only for testing purpose
    // date = {
    //     from:'2021-04-01',
    //     to:'2021-04-15'
    // };
    const res = await axios.post(endpoint.GET_PRS_BY_DATE,{repo,date});
    return res;
}

const getPrsById = async (repo,ids) => {
    const res = await axios.post(endpoint.GET_PRS_BY_ID,{repo,ids});
    return res;
}

const getPrsByNumber = async (repo,numbers) => {
    const res = await axios.post(endpoint.GET_PRS_BY_NUMBER,{repo,numbers});
    return res;
}

const getTeams = async () => {
    const res = await axios.get(endpoint.GET_ALL_TEAMS);
    return res;
}

const updateTeam = async (team) => {
    const res = await axios.post(endpoint.UPDATE_TEAM,{team});
    return res;
}

const deleteTeam = async (team) => {
    const res = await axios.post(endpoint.DELETE_TEAM,{team});
    return res;
}

const getTeamsById = async (ids) => {
    const res = await axios.post(endpoint.GET_TEAMS_BY_ID,{ids});
    return res;
}

export {
    getRepos,
    getUsers,
    getUserById,
    getUsersById,
    getPrsByDate,
    getPrsById,
    getPrsByNumber,
    getTeams,
    getTeamsById,
    updateTeam,
    deleteTeam,
}