import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import TagsInput from '../common/tagsInput';
import Loading from '../loading/loading';

import * as http from '../../utils/http';
import {addTeam,updateTeam,clearSelectedTeam} from '../../store/teams/actions';

import {TEAM_ROUTE} from '../../config/routes';

import './team.css';

const EditTeam = (props) => {
    const dispatch = useDispatch();
    const team = useSelector(state => state.teams.selected);
    const users = useSelector(state => state.users.all);
    const [searchedUser,setSearchedUser] = useState('');
    const [userFocus,setUserFocus] = useState(false);
    const [details,setDetails] = useState({name:"",users:[]});
    const [filteredUsers,setFilteredUsers] = useState([]);
    const [isNew,setIsNew] = useState(true);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        if(props.history.location.pathname === '/teams/edit'){
            setIsNew(false);
            setDetails(team);
        }else{
            dispatch(clearSelectedTeam());
        }
    },[])

    const onSaveTeam = () => {
        setIsLoading(true);
        let teamDetails = {
            name:details.name,
            users:details.users
        }
        if(!isNew){
            teamDetails = {...teamDetails,_id:details._id}
        }
        http.updateTeam(teamDetails).then(({data})=>{
            if(isNew){
                dispatch(addTeam(data.team));
            }else{
                dispatch(updateTeam(data.team));
            }
            props.history.replace(TEAM_ROUTE);
            setIsLoading(false);
        },(err)=>{
            setIsLoading(false);
        })
    }

    const onNameChanged = (event) => {
        let name = event.target.value;
        setDetails({...details,name})
    }

    const onInputChanged = (e) => {
        setSearchedUser(e.target.value);
        let name = e.target.value.toLowerCase();
        if(name.trim() !==''){
            let filtered = users.filter((user)=>user.login.toLowerCase().includes(name));
            let filteredArr = [];
            filtered.map((user)=>{
                let index = details.users.findIndex((u)=>u.id === user.id);
                if(index === -1){
                    filteredArr.push({id:user.id,login:user.login,avatarUrl:user.avatarUrl});
                }
            })
            setFilteredUsers([...filteredArr]);
        }else{
            setFilteredUsers([]);
        }
    }
    const onUserClicked = (user) => {
        let index = details.users.findIndex((u)=>u.id === user.id);
        if(index === -1){
            setSearchedUser('');
            setFilteredUsers([]);
            setUserFocus(true);
            setDetails({...details,users:[...details.users,user]});
        }
    }

    const onRemoveUser = (user) => {
        let users = details.users.filter((u)=>u.id !== user.id);
        setDetails({...details,users:[...users]});
    }

    const removeUserFocus = () => {
        setUserFocus(false);
    }
    return isLoading?<Loading/>:(
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{isNew?"Create Team":team.name}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onSaveTeam}>Save Team</button>
                </div>
            </div>
        </div>
        <div className="team-body py-5 bg-alice-blue">
            <div className="container">
                <div className="flex-container row">
                   <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white team-fields-card">
                        <div className="teamname" onClick={removeUserFocus}>
                            <label><b>Team Name</b></label>
                            <input type="text" name="name" id="name" className="input input-md" placeholder="Enter team name" value={details.name} onChange={onNameChanged}/>
                        </div>
                        <br/>
                        <div className="team-users">
                                <label><b>Users</b></label>
                            <div className="team-users-head">
                                <TagsInput 
                                    onInput={onInputChanged} 
                                    tags={details.users} 
                                    removeTags={onRemoveUser} 
                                    value={searchedUser}
                                    focus={userFocus}
                                    />
                            </div>
                            <div className="user-dropdown">
                                <ul>
                                    {filteredUsers.map((user,index)=>{
                                        if(index < 7){
                                            return <li key={index} onClick={()=>onUserClicked(user)}>
                                                {user.login}
                                            </li>
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    </>);
}

export default EditTeam;