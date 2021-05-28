import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker, {DateObject} from "react-multi-date-picker";
import Collapsible from 'react-collapsible';
import HtmlTooltip from '../common/htmlTooltip/index';

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';

import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat, getNextDate, getRangeFromDateObject} from '../../utils/time-conversion';
import {defaultArr,multiArr} from '../../config/chat-items';
import { calculatePrCycle, calculatePrTimeTaken, comparePrCycle, getPrCount } from "../../utils/pr-calculations";
import CircleIndicator from "../common/circleIndicator";
import { selectTeam } from "../../store/teams/actions";
import { EDIT_TEAM_ROUTE, HOME_ROUTE, TEAMS_ROUTE } from "../../config/routes";
import UserCards from "../user/userCards";
import { selectUser } from "../../store/users/actions";
import { MIN_PR_CYCLE_TIME } from "../../config/constants";

import {info} from '../../assets/svg/index';
import DataCircles from "../common/dataCircle/dataCircles";

const Team = (props) => {
    const dispatch = useDispatch();
    const repo = useSelector(state => state.repos.selected || {});
    const allTeams = useSelector(state => state.teams.all || []);
    const selectedTeam = useSelector(state => state.teams.selected || {})
    const users = useSelector(state => state.users.all);
    const [title,setTitle] = useState('');
    const [teams,setTeams] = useState([]);
    const [prs,setPrs] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [values, setValues] = useState([[new DateObject().subtract(6, "days"),new DateObject()]]);

    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    useEffect(()=>{
        if(selectedTeam.hasOwnProperty('data')){
            setIsLoading(false);
        }
    },[selectedTeam])

    useEffect(()=>{
        console.log(getRangeFromDateObject(values[0]));
    },[values])

    useEffect(()=>{
        if(allTeams.length > 0){
            const index = allTeams.findIndex((t) => t._id === props.match.params.id);
            if(index === -1){
                props.history.goBack();
            }else{
                const team = allTeams[index];
                dispatch(selectTeam(team));
                setTitle(team.name);
                setTeams([team])
                let prArr = [];
                team.users.map((user)=>{
                    let i = users.findIndex((u)=> u.id === user.id);
                    let usr = users[i];
                    prArr = [...prArr,...usr.prs];
                })
                setPrs(prArr);
            }
        }
    },[allTeams])

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
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let teamsState = teams;
        teamsState.splice(i,1);
        setTeams([...teamsState]);
    }

    const onTeamSelected = (e,i) => {
        let id = e.target.value;
        let arr = teams;
        let team = teams[0];
        allTeams.map((t)=>{
            if(t._id === id){
                team = t;
            }
        });
        arr[i]=team;
        setTeams([...arr]);
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

    const onEditTeam = () => {
        props.history.push(EDIT_TEAM_ROUTE);
    }

    const DefaultCharts = () => {
        if(teams.length === 1 && selectedTeam.hasOwnProperty('result')){
            const onUserClicked = (id) => {
                const userIndex = users.findIndex((user) => user.id === id);
                dispatch(selectUser(users[userIndex]));
                props.history.push('/user/'+id);
            }

            return <>
            <DataCircles 
                current={teams[0].data.result}
                previous={teams[0].prevData.result}
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
                </div>
            </div>
            <div className="container">
                <div className="flex-container row">
                    {defaultArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            result={teams[0].result}
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

    const count = {
        total:prs.length,
        open:getPrCount(prs,'OPEN'),
        closed:getPrCount(prs,'CLOSED'),
        merged:getPrCount(prs,'MERGED'),
    };

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
                        return <div className="multi-date-picker" key={i}>
                                <DatePicker value={value} onChange={(val)=>onDateChanged(val,i)} type="button" range showOtherDays hideOnScroll>
                                    {i > 0 && <select value={teams[i]._id} onChange={(e)=>onTeamSelected(e,i)}>
                                            {allTeams.map((team)=>{
                                                return <option key={team._id} value={team._id}>{team.name}</option>
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

export default Team;