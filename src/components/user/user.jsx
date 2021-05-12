import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import DatePicker, {DateObject} from "react-multi-date-picker";

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';

import {updateUser} from '../../store/users/actions';
import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat} from '../../utils/time-conversion';
import {defaultArr,multiArr} from '../../config/chat-items';
import { calculatePrCycle } from "../../utils/pr-calculations";
import CircleIndicator from "../common/circleIndicator";

const User = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.selected || {})
    const allUsers = useSelector(state => state.users.all || []);
    const [users,setUsers] = useState([]);
    const [prs,setPrs] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [values, setValues] = useState([[new DateObject().subtract(6, "days"),new DateObject()]]);
    
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
        if(user.hasOwnProperty('id')){
            setUsers([{
                id:user.id,
                name:user.login
            }])
        }
    },[user])

    useEffect(()=>{
        if(users.length > 0 && prs.length === 0){
            getAllPrsForUser(0).then(prSet => {
                setPrs([prSet]);
            })
        }
    },[users])

    const getAllPrsForUser = async (userIndex) => {
        let usr = allUsers.filter((u) => u.id === users[userIndex].id)[0];
        let val = values[userIndex];
        let prArr = [];
        let data = [];
        usr.prs.map(pr => {
            let index = data.findIndex(d => d.repo.id === pr.repo.id);
            let from = new DateObject(val[0]);
            let to = new DateObject(val[1]).add(1,"days");

            if(pr.updatedAt >= convertDate(dateFormat(from)) && pr.updatedAt <= convertDate(dateFormat(to))){
                if(index === -1){
                    data.push({repo:pr.repo,ids:[pr.id]});
                }else{
                    data[index].ids.push(pr.id);
                }
            }
        })
        
        await Promise.all(data.map(async (d) => {
            const {data} = await http.getPrsById(d.repo,d.ids);
            prArr = [...prArr,...data.prs];
        }));
        return prArr;
    }

    const onDateChanged = (val,i) => {
        let valArr = values;
        if(val.length === 1){
            const to = new DateObject(val[0]).add(6,"days");
            val.push(to);
        }
        valArr[i] = val;
        setValues([...valArr]);
        getAllPrsForUser(i).then(prSet => {
            let prArr = prs;
            prArr[i] = prSet;
            setPrs([...prArr]);
        })
    }

    const addComparisions = () => {
        setValues([...values,values[0]]);
        setUsers([...users,users[0]]);
        setPrs([...prs,prs[0]]);
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let usersState = users;
        usersState.splice(i,1);
        setUsers([...usersState]);
        let prArr = prs;
        prArr.splice(i,1);
        setPrs([...prArr]);
    }

    const onUserSelected = (e,i) => {
        let id = e.target.value;
        let arr = users;
        let usr = users[0];
        allUsers.map((u)=>{
            if(u.id === id){
                usr = {
                    id:u.id,
                    name:u.login
                };
            }
        });
        arr[i]=usr;
        console.log('updated user',arr);
        setUsers([...arr]);
        getAllPrsForUser(i).then(prSet => {
            let prArr = prs;
            prArr[i] = prSet;
            setPrs([...prArr]);
        })
    }

    const DefaultCharts = () => {
        if(prs.length === 1 && prs[0].length > 0){
            const result = calculatePrCycle(prs[0],{
                from:convertDate(dateFormat(values[0][0])),
                to:convertDate(dateFormat(values[0][1]))
            });
            const cycle = convertTimeToDays(result.timeTaken.avg);
            const commits = user.commits.total;

            const count = {
                total:user.prs.length,
                open:user.prs.filter((u)=>u.state.toUpperCase()==="OPEN").length,
                closed:user.prs.filter((u)=>u.state.toUpperCase()==="CLOSED").length,
                merged:user.prs.filter((u)=>u.state.toUpperCase()==="MERGED").length
            }
            return <>
            <div className="container">
                <div className="flex-container row">
                    <div className="col-md-6">
                        <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body" style={{padding:'35px'}}>
                                <div className="row">
                                    <CircleIndicator
                                        text="PR"
                                        background="grey"
                                        size="100px"
                                        end={count.total}
                                    />
                                    <CircleIndicator
                                        text="open"
                                        background="#13ce95"
                                        size="100px"
                                        end={count.open}
                                    />               
                                    <CircleIndicator
                                        text="closed"
                                        background="#EF7070"
                                        size="100px"
                                        end={count.closed}
                                    />
                                    <CircleIndicator
                                        text="merged"
                                        background="#6f42c1"
                                        size="100px"
                                        end={count.merged}
                                    />                               
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body" style={{padding:'35px'}}>
                                <div className="row">
                                    <div className="pr-cycle-circle">
                                        {cycle}
                                    </div>
                                    <div className="pr-cycle">
                                        PR Cycle
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body" style={{padding:'35px'}}>
                                <div className="row">
                                    <div className="pr-cycle-circle">
                                        {commits}
                                    </div>
                                    <div className="pr-cycle">
                                        Commits
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="flex-container row">
                    {defaultArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            prs={prs[0]}
                            range={values}
                        />
                    })}
                </div>
            </div>
        </>
        }
        return <></>
    }

    const MultipleCharts = () => {
        return prs.length > 1?(
            <div className="container">
                <div className="flex-container row">
                {multiArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            prs={prs}
                            teams={users}
                            range={values}
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    return isLoading?<Loading/>:(<>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <img src={user.avatarUrl} alt="User avatar" style={{width:70,height:70,borderRadius:'50%'}}/>
            <h1 className="h2">{user.login}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={addComparisions}>Compare</button>
                    <button className="btn btn-sm btn-outline-secondary">Filter</button>
                </div>
            </div>
        </div>
        <div className="home-body px-2 py-3 bg-alice-blue">
            <div className="container">
                <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white flex-container row" style={{padding:'15px',justifyContent:'space-evenly'}}>
                    {values.map((value,i)=>{
                        return <div className="multi-date-picker" key={i}>
                                <DatePicker value={value} onChange={(val)=>onDateChanged(val,i)} type="button" range showOtherDays hideOnScroll>
                                    {i > 0 && <select value={users[i].id} onChange={(e)=>onUserSelected(e,i)}>
                                            {allUsers.map((usr)=>{
                                                return <option key={usr.id} value={usr.id}>{usr.login}</option>
                                            })}
                                        </select>}
                                    {i > 0 && <button className="btn btn-sm btn-outline-danger" onClick={()=>removeComparison(i)}>Delete</button>}
                                </DatePicker>
                        </div>
                    })}
                </div>
            </div>
            <DefaultCharts />
            <MultipleCharts/>
        </div>
    </>);
}

export default User;