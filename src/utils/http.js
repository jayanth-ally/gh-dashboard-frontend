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

const getUserById = async (range,id) => {
    const res = await axios.post(endpoint.GET_USER_BY_ID,{range,id});
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

const getPrDetailsById = async (ids) => {
    const res = await axios.post(endpoint.GET_PR_DETAILS_BY_ID,{ids});
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
    const res = await axios.post(endpoint.DELETE_TEAM,{team:{_id:team._id}});
    return res;
}

const getTeamsById = async (ids) => {
    const res = await axios.post(endpoint.GET_TEAMS_BY_ID,{ids});
    return res;
}

const getOrgData = async () => {
    const res = await axios.get(endpoint.ORG_DATA);
    return res;
}

const getTeamsData = async () => {
    const res = await axios.get(endpoint.TEAMS_DATA);
    return res;
}

const getTeamData = async (range,id) => {
    const res = await axios.post(endpoint.TEAM_DATA,{range,id});
    return res;
}

const getTeamDataByRange = async (range,id) => {
    const res = await axios.post(endpoint.TEAM_DATA_BY_RANGE,{range,id});
    return res;
}

const getPrsData = async (repo,range) => {
    const res = await axios.post(endpoint.PRS_DATA,{repo,range});
    return res;
}

export {
    getRepos,
    getUsers,
    getUserById,
    getUsersById,
    getPrsByDate,
    getPrsById,
    getPrDetailsById,
    getPrsByNumber,
    getTeams,
    getTeamsById,
    updateTeam,
    deleteTeam,

    getOrgData,
    getTeamsData,
    getTeamData,
    getTeamDataByRange,
    getPrsData,
}