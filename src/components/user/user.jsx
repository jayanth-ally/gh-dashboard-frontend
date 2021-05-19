import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker, {DateObject} from "react-multi-date-picker";
import Collapsible from 'react-collapsible';

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';

import {selectUser, updateUser} from '../../store/users/actions';
import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat} from '../../utils/time-conversion';
import {defaultArr,multiArr} from '../../config/chat-items';
import { calculateMetrics, calculatePrCycle, calculatePrTimeTaken } from "../../utils/pr-calculations";
import CircleIndicator from "../common/circleIndicator";
import { ALL_USERS_ROUTE, HOME_ROUTE } from "../../config/routes";

import './user.css';

const User = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.selected || {})
    const allUsers = useSelector(state => state.users.all || []);
    const [users,setUsers] = useState([]);
    const [prs,setPrs] = useState([]);
    const [prTable,setPrTable] = useState([]);
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
        }
    },[allUsers])

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
                console.log(prSet)
            })
        }
    },[users])

    useEffect(()=>{
        let ids = "[";
        if(prs.length > 0){
            prs[0].map((pr,i) => {
                if(i !== prs[0].length-1){
                    ids += "\""+pr.id+"\",";
                }else{
                    ids += "\""+pr.id+"\"";
                }
            })
            ids += "]"
            http.getPrDetailsById(ids).then(({data})=>{
                setPrTable([...data.prs]);
            })
        }
    },[prs])

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
            // const result = calculatePrCycle(prs[0],{
            //     from:convertDate(dateFormat(values[0][0])),
            //     to:convertDate(dateFormat(values[0][1]))
            // });

            const count = {
                total:user.prs.length,
                open:user.prs.filter((u)=>u.state.toUpperCase()==="OPEN").length,
                closed:user.prs.filter((u)=>u.state.toUpperCase()==="CLOSED").length,
                merged:user.prs.filter((u)=>u.state.toUpperCase()==="MERGED").length
            }

            let from = convertDate(dateFormat(values[0][0]));
            let to = convertDate(dateFormat(values[0][1]));
            let result = calculatePrCycle(prs[0],{
                from,
                to,
                prCycle:true,
            });
            let prForCycle = user.prs.filter((p)=> p.timeTaken > 14400);
            let [totalTimeTaken,avgTimeTaken,maxTimeTaken] = calculatePrTimeTaken(prForCycle);
            let data = {
                commits:0,
                reverts:0,
                resolved:0,
                reviews:0,
                avgCycle:convertTimeToDays(avgTimeTaken),
                cycle:convertTimeToDays(result.timeTaken.avg),
                reviewed:0,
            }
            const cycle = data.cycle;
            data.arr = prs[0];
            result = calculateMetrics(data.arr);
            data.commits = result.commits.total;
            data.reviews = result.reviews.total;
            data.reverts = result.commits.reverts;
            data.resolved = result.count.closed+result.count.merged;
            data.arr.map((d)=>{
                if(d.reviewThreads.length > 0 || d.reviews > 0){
                    data.reviewed ++;
                }
            })

            return <>
            <div className="container">
                <div className="flex-container row">
                    <div className="col-md-12">
                        <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body">
                                <Collapsible trigger={"Pull Requests ("+prs[0].length+")"}>
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

                                        {prTable.map((pr,i)=>{
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
                                <div className={data.avgCycle < cycle?"row pr-cycle red":"row pr-cycle green"}>
                                    <div className="pr-cycle-circle">
                                        <span className="old-data">
                                            {data.avgCycle}
                                        </span>
                                        <span className="new-data">
                                            {cycle}
                                        </span>
                                    </div>
                                    <div className="pr-cycle-title">
                                        PR Cycle
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body" style={{padding:'35px'}}>
                                <div className="row pr-cycle">
                                    <div className="pr-cycle-circle">
                                        {data.resolved}
                                    </div>
                                    <div className="pr-cycle-title">
                                        Resolved
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

    return isLoading || prs.length === 0?<Loading/>:(<>
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
            {prs[0].length === 0 && <div style={{width:'100%',display:'flex',justifyContent:'center'}}>No PRs found</div>}
            {prs[0].length > 0 && <>
                <DefaultCharts />
                <MultipleCharts/>
            </>}
        </div>
    </>);
}

export default User;