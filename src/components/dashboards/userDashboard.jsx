import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import UserCards from '../user/userCards';
import Loading from "../loading/loading";

import * as http from '../../utils/http';
import {addUsers,selectUser} from '../../store/users/actions';

const UserDashboard = (props) => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users.all);
    const [search,setSearch] = useState('');
    const [filter,setFilter] = useState('A-Z');
    const [filteredUsers,setFilteredUsers] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        if(users.length === 0){
            setIsLoading(true);
            http.getUsers().then(({data}) => {
                dispatch(addUsers(data.users));           
                setIsLoading(false);
            },(err)=>{
                setIsLoading(false);
            })
        }
    },[dispatch])

    useEffect(()=>{
        setFilteredUsers(users);
    },[users])

    useEffect(()=>{
        
    },[filteredUsers])

    useEffect(()=>{
        let arr = users.filter((u)=> u.login.includes(search));
        if(filter === 'A-Z'){
            arr = arr.sort((a,b)=> (a.login > b.login)?1:(a.login < b.login)?-1:0)
        }
        setFilteredUsers([...arr]);
    },[search])

    const onUserClicked = (id) => {
        const userIndex = users.findIndex((user) => user.id === id);
        dispatch(selectUser(users[userIndex]));
        props.history.push('/user/'+id);
    }

    const onSearchUser = (e) => {
        setSearch(e.target.value);
        const val = e.target.value;
    }

    return isLoading?<Loading/>:(
        <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">User Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <input className="search user-search" type="text" placeholder="Search users" value={search} onChange={onSearchUser} />
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary">Filter</button>
                </div>
            </div>
        </div>
        {users.length > 0 && <div className="users-body py-2 bg-alice-blue">
            <div className="container">
                <div className="total-users">{users.length} Users</div>
                <hr/>
                <div className="all-user-cards">
                    {filteredUsers.map((user,i)=>{
                        return <UserCards 
                            key={i} 
                            size="200px"
                            imgSize="40px"
                            id={user.id}
                            avatar={user.avatarUrl}
                            login={user.login}
                            selectUser={onUserClicked}
                            />
                    })}
                </div>
            </div>
        </div>}
        
        </>
    );
}

export default UserDashboard;