import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import Loading from "../loading/loading";

import * as http from '../../utils/http';
import { msToDHM } from "../../utils/time-conversion";
import {updateUser} from '../../store/users/actions';

const User = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.selected);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        if(!(user.hasOwnProperty('prs'))){
            setIsLoading(true);
            http.getUserById(user.id).then(({data}) => {
                dispatch(updateUser(data.user));           
                setIsLoading(false);
            },(err)=>{
                setIsLoading(false);
            })
        }
    },[dispatch])

    useEffect(()=>{
        if(user.hasOwnProperty('prs')){
            
        }
    },[user])

    const convertTime = (seconds) => {
        const [days,hours,minutes,milliseconds] = msToDHM(seconds*1000);
        return days+" days, "+hours+" hours and "+minutes+" minutes";
    }

    return isLoading?<Loading/>:(
        <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <img src={user.avatarUrl} alt="User avatar" style={{width:70,height:70,borderRadius:'50%'}}/>
            <h1 className="h2">{user.login}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary">Compare</button>
                    <button className="btn btn-sm btn-outline-secondary">Filter</button>
                </div>
            </div>
        </div>
        <div className="user-body">
            <div className="row time-taken">
                <div className="avg-time-taken">
                    <span>Avg time taken for closing PR</span>
                    <div className="time">{convertTime(user.avgTimeTaken)}</div>
                </div>
                <div className="max-time-taken">
                    <span>Max time taken for closing PR</span>
                    <div className="time">{convertTime(user.maxTimeTaken)}</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default User;