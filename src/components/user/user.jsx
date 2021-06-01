import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker, {DateObject} from "react-multi-date-picker";
import Collapsible from 'react-collapsible';
import HtmlTooltip from '../common/htmlTooltip/index';

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';

import {selectUser, updateUser} from '../../store/users/actions';
import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat, getRangeFromDateObject,getPreviousRange} from '../../utils/time-conversion';
import {defaultArr,multiArr} from '../../config/chat-items';
import CircleIndicator from "../common/circleIndicator";
import { ALL_USERS_ROUTE, HOME_ROUTE } from "../../config/routes";

import {info} from '../../assets/svg/index';

import './user.css';
import DataCircles from "../common/dataCircle/dataCircles";

const User = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.selected || {})
    const allUsers = useSelector(state => state.users.all || []);
    const [users,setUsers] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [values, setValues] = useState([[new DateObject().subtract(6, "days"),new DateObject()]]);
    
    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    useEffect(()=>{
        if(allUsers.length > 0){
            const index = allUsers.findIndex((t) => t.id === props.match.params.id);
            if(index === -1){
                props.history.goBack();
            }else{
                const usr = allUsers[index];
                dispatch(selectUser(usr));
            }
        }else{
            props.history.replace(HOME_ROUTE);
        }
    },[allUsers])

    useEffect(()=>{
        if(!(user.hasOwnProperty('values'))){
            setIsLoading(true);
            const range = getRangeFromDateObject(values[0]);
            http.getUserById(range,[user.id]).then(({data}) => {
                dispatch(updateUser(data.doc));           
                setIsLoading(false);
            },(err)=>{
                setIsLoading(false);
            })
        }
    },[dispatch])

    useEffect(()=>{
        if(user.hasOwnProperty('values')){
            setIsLoading(false);
            let usr = getUserData(user,values[0]);
            setUsers([usr])
        }
    },[user])

    const getUserData = (usr,rng) => {
        let range1 = getRangeFromDateObject(rng);
        let prevRange1 = getPreviousRange(range1);
        const count = usr.count;
        const userResult = usr.values.filter(val => val.range.from === range1.from && val.range.to === range1.to)[0];
        const result = userResult.result;
        const data = userResult.data;
        const prs = userResult.prs;
        const prevData = usr.values.filter(val => val.range.from === prevRange1.from && val.range.to === prevRange1.to)[0].result;
        return {
            id:usr.id,
            login:usr.login,
            avatarUrl:usr.avatarUrl,
            count,
            result,
            data,
            prs,
            prevData
        }
    }

    const getUserDataByIndex = async (userIndex) => {
        let range = getRangeFromDateObject(values[userIndex]);
        let {data} = await http.getUserById(range,[users[userIndex].id]);
        console.log(data.users[0]);
        return data.users[0];
    }

    const onDateChanged = (val,i) => {
        let valArr = values;
        if(val.length === 1){
            const to = new DateObject(val[0]).add(6,"days");
            val.push(to);
        }
        valArr[i] = val;
        setValues([...valArr]);
        setIsLoading(true);
        getUserDataByIndex(i).then(usr => {
            let userArr = users;
            userArr[i] = usr;
            setUsers([...userArr]);
            setIsLoading(false);
        },(err)=>{
            setIsLoading(false);
        })
    }

    const addComparisions = () => {
        setValues([...values,values[0]]);
        setUsers([...users,users[0]]);
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let usersState = users;
        usersState.splice(i,1);
        setUsers([...usersState]);
    }

    const onUserSelected = (e,i) => {
        let id = e.target.value;
        let arr = users;
        let usr = users[0];
        allUsers.map((u)=>{
            if(u.id === id){
                usr = u;
            }
        });
        arr[i]=usr;
        console.log('updated user',arr);
        setUsers([...arr]);
        getUserDataByIndex(i).then(usr => {
            let userArr = users;
            userArr[i] = usr;
            setUsers([...userArr]);
            setIsLoading(false);
        },(err)=>{
            setIsLoading(false);
        })
    }

    const DefaultCharts = () => {
        if(users.length === 1 && users[0].hasOwnProperty('prs')){
            console.log(users[0].prs);
            return <>
            <DataCircles 
                current={users[0].result}
                previous={users[0].prevData}
                tooltipData={{current:'last 7 days',previous:'previous 7 days'}}
            />
            <div className="container">
                <div className="flex-container row">
                    <div className="col-md-12">
                        <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body">
                                <Collapsible trigger={"Pull Requests ("+users[0].prs.length+")"}>
                                    <hr/>
                                    <table className="table pr-table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Title</th>
                                                <th>Status</th>
                                                <th>Time (to close)</th>
                                                <th>Changes</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {users[0].prs.map((pr,i)=>{
                                            return  <tr key={i}>
                                                <td>{pr.number}</td>
                                                <td>
                                                    <div className="pr-title">
                                                        <a href={"https://github.com/"+pr.repo.owner+"/"+pr.repo.name+"/pull/"+pr.number} target="_blank">
                                                        {pr.title}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={"pr-status "+pr.state}>
                                                        {pr.state}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="pr-days">
                                                        {convertTimeToDays(pr.timeTaken) === "0.0 min(s)"?"-":convertTimeToDays(pr.timeTaken)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="pr-changes mr-2">
                                                        <span className="additions">{pr.additions}</span>
                                                        <span className="deletions">{pr.deletions}</span>
                                                    </div>
                                                </td>
                                                <td>{pr.reviewComments}</td>
                                            </tr>
                                        })}
                                        </tbody>
                                    </table>
                                </Collapsible>
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
                            result={users[0].data}
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
        return users.length > 1?(
            <div className="container">
                <div className="flex-container row">
                {multiArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            result={users}
                            range={values}
                            type="users"
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    let count = {
        total:0,
        open:0,
        closed:0,
        merged:0
    };

    if(user.hasOwnProperty('values')){
        count = user.count;
    }



    return isLoading || users.length === 0 ?<Loading/>:(<>
        <div className="breadcrumbs">
            <Link to={HOME_ROUTE}>Home</Link>
            <span>/</span>
            <Link to={ALL_USERS_ROUTE}>Users</Link>
            <span>/</span>
            <span>{user.login}</span>
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <img src={user.avatarUrl} alt="User avatar" style={{width:70,height:70,borderRadius:'50%'}}/>
            <h1 className="h2">{user.login}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={addComparisions}>Compare</button>
                </div>
            </div>
        </div>
        <div className="home-body px-2 py-3 bg-alice-blue">
            <div className="col-md-12">
                        <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="info">
                                <HtmlTooltip
                                    placement="top-end"
                                    title={<p>Count of all PRs till today</p>}
                                    arrow>
                                    <img src={info} alt={"info"}/>
                                </HtmlTooltip>
                            </div>
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
                    <div className="info" style={{position:"absolute",top:"0px",right:"10px"}}>
                        <HtmlTooltip
                            placement="top-end"
                            title={<p>
                                Range of all comparisions are equal. 
                                <br/>User for 1st range cannot be changed.</p>}
                            arrow>
                            <img src={info} alt={"info"}/>
                        </HtmlTooltip>
                    </div>
                </div>
            </div>
            {users[0].prs.length === 0 && <div style={{width:'100%',display:'flex',justifyContent:'center'}}>No PRs found</div>}
            {users[0].prs.length > 0 && <>
                <DefaultCharts />
                <MultipleCharts/>
            </>}
        </div>
    </>);
}

export default User;