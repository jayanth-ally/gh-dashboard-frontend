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

export {
    getRepos,
    getUsers,
    getUserById,
}