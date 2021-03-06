import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker, {DateObject} from "react-multi-date-picker";
import Collapsible from 'react-collapsible';
import HtmlTooltip from '../common/htmlTooltip/index';

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';
import TeamTimeline from "./timeline";
import TopUsers from './topUsers';

import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat, getNextDate, getRangeFromDateObject,getPreviousRange,getTooltipData,getToday, getDataFromTimePeriod} from '../../utils/time-conversion';
import {defaultArr,multiArr} from '../../config/chat-items';
import CircleIndicator from "../common/circleIndicator";
import { selectTeam } from "../../store/teams/actions";
import { EDIT_TEAM_ROUTE, HOME_ROUTE, TEAMS_ROUTE } from "../../config/routes";
import UserCards from "../user/userCards";
import { selectUser,updateUser } from "../../store/users/actions";

import {info} from '../../assets/svg/index';
import DataCircles from "../common/dataCircle/dataCircles"; 

const Team = (props) => {
    const dispatch = useDispatch();
    const repo = useSelector(state => state.repos.selected || {});
    const allTeams = useSelector(state => state.teams.all || []);
    const selectedTeam = useSelector(state => state.teams.selected || {})
    const userState = useSelector(state => state.users);
    const users = userState.all;
    const fetchingUsers = userState.fetching;
    const [title,setTitle] = useState('');
    const [teams,setTeams] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [values, setValues] = useState([[new DateObject().set('date',getToday()).subtract(6, "days"),new DateObject().set('date',getToday())]]);
    const [selectedTimeline,setSelectedTimeline] = useState([{key:'last',value:{days:7}}])
    const [tooltip,setTooltip] = useState({current:'last 7 days',previous:'Previous 7 days'});
    const [teamUsers,setTeamUsers] = useState([]);

    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    useEffect(()=>{
        if(!fetchingUsers){
            if(selectedTeam.hasOwnProperty('users')){
                setIsLoading(false);
            }
            if(selectedTeam.hasOwnProperty('users') && teamUsers.length === 0 && (selectedTimeline[0].key !== 'custom7' && selectedTimeline[0].key !== 'custom15')){
                let team = selectedTeam;
                let userArr = [];
                let userIds = [];
                team.users.forEach((u)=> {
                    const index = users.findIndex((usr) => usr.id === u.id);
                    if(!users[index].hasOwnProperty('count')){
                        userIds.push(u.id)
                    }else{
                        userArr.push(users[index]);
                    }
                });
    
                http.getUserById(userIds).then(({data})=>{
                    data.users.forEach((usr)=>{
                        userArr.push(usr);
                        dispatch(updateUser(usr));
                    })
                    setTeamUsers([...userArr]);
                })
            }
        }
    },[selectedTeam,fetchingUsers])

    useEffect(()=>{
        if(allTeams.length > 0){
            const index = allTeams.findIndex((t) => t._id === props.match.params.id);
            if(index === -1){
                props.history.goBack();
            }else{
                setIsLoading(true);
                const team = allTeams[index];
                dispatch(selectTeam(team));
                setTitle(team.name);
                getTeam(team,selectedTimeline[0],0,values[0]);
            }
        }
    },[allTeams])

    useEffect(()=>{
        if(selectedTeam.hasOwnProperty('users')){
            if(teamUsers.length < selectedTeam.users.length){
                setIsLoading(true);
            }else{
                setIsLoading(false);
            }
        }
    },[teamUsers])

    const getTeam = (tm,tl,i,rng) => {
        let range1 = getRangeFromDateObject(rng);
        let prevRange1 = getPreviousRange(range1);

        if(tm && tm.hasOwnProperty('data')){
            const d = {
                _id:tm._id,
                name:tm.name,
                count:tm.count,
                users:tm.users,
                range:range1,
                result:tm.result,
                data:tm.data,
                prevData:tm.prevData
            };
            if(teams.length > 0){
                let tms = teams;
                tms[i] = d;
                setTeams([...tms])
            }else{
                setTeams([d]);
            }
            return {};
        }
        const {current:teamResult,previous} = getDataFromTimePeriod(tl,tm.values);
        if(teamResult){
            const result = teamResult.result;
            const data = teamResult.data;
            const d = {
                _id:tm._id,
                name:tm.name,
                count:tm.count,
                users:tm.users,
                range:range1,
                result,
                data,
                prevData:previous.result
            };
            if(teams.length > 0){
                let tms = teams;
                tms[i] = d;
                setTeams([...tms])
            }else{
                setTeams([d]);
            }
        }else{
            console.log('invalid result');
            console.log(range1,prevRange1,tm);
        }
    }

    const getTeamFromApi = (t_id,index,val) =>{
        let from = val[0];
        let to = val[1];
        let range = {
            from: convertDate(dateFormat(from)),
            to: getNextDate(dateFormat(to))
        }
        let tmrng = teams[index];
        let teamRange = range;
        if(tmrng !== undefined){
            teamRange = tmrng.range;
        }
        if(tmrng._id !== t_id || teamRange.from !== convertDate(dateFormat(values[index][0])) || teamRange.to !== getNextDate(dateFormat(values[index][1]))){
            setIsLoading(true);
            http.getTeamDataByRange(range,t_id).then(({data})=>{
                let tms = teams;
                tms[index] = data.team;
                setTeams([...tms])
                setIsLoading(false);
            },err => setIsLoading(false))
        }
    }

    const onTimelineChanged = (val,t_id,index,type,obj) => {
        setTooltip(getTooltipData(type,obj));

        let from = new DateObject({date:new Date(val.range.from)});
        let to = new DateObject({date:new Date(val.range.to)}).subtract(1,'days');

        let tl = selectedTimeline;
        let ranges = values;
        
        if(index === 0 &&  tl[0].key !== type){
            selectedTimeline.forEach((_,i)=>{
                const id = teams[i]._id;
                tl[i] = {key:type,value:obj};
                ranges[i] = [from,to]
                if(type === 'custom7' || type === 'custom15'){
                    getTeamFromApi(id,i,[from,to]);
                }else{
                    const tm1 = allTeams.filter((tm)=>tm._id === id)[0];
                    getTeam(tm1,tl[i],i,[from,to]);
                } 
            })
        }else{
            tl[index] = {key:type,value:obj};
            ranges[index] = [from,to];
            if(type === 'custom7' || type === 'custom15'){
                getTeamFromApi(t_id,index,[from,to]);
            }else{
                const tm1 = allTeams.filter((tm)=>tm._id === t_id)[0];
                getTeam(tm1,tl[index],index,[from,to]);
            } 
        }

        setSelectedTimeline([...tl])
        setValues([...ranges])

        // if(val.range.from !== range.from || val.range.to !== range.to){
        //     setRange({...val.range});
        //     setPrevRange({...val.prevRange});
        // }
    }

    const getTeamDataByIndex = async (teamIndex) => {
        let range = {
            from:convertDate(dateFormat(values[teamIndex][0])),
            to:getNextDate(dateFormat(values[teamIndex][1]))
        }
        let {data} = await http.getTeamData(range,teams[teamIndex]._id);
        return data.team;
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
        getTeamDataByIndex(i).then((team) => {
            let teamArr = teams;
            teamArr[i] = team;
            setTeams([...teamArr]);
            setIsLoading(false);
        },(err)=>{
            setIsLoading(false);
        })
    }

    const addComparisions = () => {
        setValues([...values,values[0]]);
        setTeams([...teams,teams[0]]);
        setSelectedTimeline([...selectedTimeline,selectedTimeline[0]])
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let teamsState = teams;
        teamsState.splice(i,1);
        setTeams([...teamsState]);
        let stl = selectedTimeline;
        stl.splice(i,1);
        setSelectedTimeline([...stl]);
    }

    const onTeamSelected = (id,i,selectedTime) => {
        let team = teams[0];
        allTeams.map((t)=>{
            if(t._id === id){
                team = t;
            }
        });
        if(selectedTime === 'custom7' || selectedTime === 'custom15'){
            getTeamFromApi(id,i,values[i]);
        }else{
            getTeam(team,selectedTimeline[i],i,values[i]);
        }        
    }

    const onEditTeam = () => {
        props.history.push(EDIT_TEAM_ROUTE);
    }

    const DefaultCharts = () => {
        if(teams.length === 1 && selectedTeam.hasOwnProperty('values')){
            let rng = getRangeFromDateObject(values[0]);
            const onUserClicked = (id) => {
                const userIndex = users.findIndex((user) => user.id === id);
                dispatch(selectUser(users[userIndex]));
                props.history.push('/user/'+id);
            }

            return <>
            <DataCircles 
                current={teams[0].result}
                previous={teams[0].prevData}
                tooltipData={{current:'last 7 days',previous:'previous 7 days'}}
            />
            <div className="container">
                <div className="flex-container row">
                    <div className="col-md-12">
                        <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body">
                                <Collapsible trigger="Users">
                                    <hr/>
                                    <div className="all-user-cards bg-alice-blue">
                                        {selectedTeam.users.map((user,i)=>{
                                            return <UserCards 
                                                key={i} 
                                                size="200px"
                                                imgSize="40px"
                                                id={user.id}
                                                avatar={user.avatarUrl}
                                                login={user.login}
                                                selectUser={()=>onUserClicked(user.id)}
                                            />
                                        })}
                                    </div>
                                </Collapsible>
                            </div>
                        </div>
                    </div>
                    {(selectedTimeline[0].key !== 'custom7' && selectedTimeline[0].key !== 'custom15') && <div className="col-md-12">
                        <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                            <div className="card-body">
                                <Collapsible trigger="Users (Top 3)">
                                    <hr/>
                                    <div className="all-user-cards bg-alice-blue">
                                            <TopUsers usersData={teamUsers} tooltipData={tooltip} range={rng} timeline={selectedTimeline[0]}/>
                                    </div>
                                </Collapsible>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            <div className="container">
                <div className="flex-container row">
                    {defaultArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            result={teams[0].data}
                            range={values}
                        />
                    })}
                </div>
            </div>
        </>
        }
        return <></>;
    }

    const MultipleCharts = () => {
        return teams.length > 1?(
            <div className="container">
                <div className="flex-container row">
                {multiArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            result={teams}
                            range={values}
                            type="teams"
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    const count = selectedTeam.count;

    return isLoading?<Loading/>:(<>
        <div className="breadcrumbs">
            <Link to={HOME_ROUTE}>Home</Link>
            <span>/</span>
            <Link to={TEAMS_ROUTE}>Teams</Link>
            <span>/</span>
            <span>{title}</span>
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{title}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={onEditTeam}>Edit</button>
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
                                    title={<p>Count of overall PRs</p>}
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
                        if(i<teams.length){
                            return <div className='timeline-picker' key={i}>
                                    <TeamTimeline onValueChange={onTimelineChanged} selected={selectedTimeline[i]} selectedZero={selectedTimeline[0]} tname={{_id:teams[i]._id,name:teams[i].name}} teams={allTeams} index={i} val={value} removeComparison={removeComparison} onTeamSelected={onTeamSelected}/>
                                </div>
                        }
                    })}
                </div>
            </div>
            <DefaultCharts />
            <MultipleCharts/>
        </div>
    </>);
}

export default Team;