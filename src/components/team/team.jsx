import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import DatePicker, {DateObject} from "react-multi-date-picker";

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';

import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat} from '../../utils/time-conversion';
import {defaultArr,multiArr} from '../../config/chat-items';
import { calculatePrCycle } from "../../utils/pr-calculations";
import CircleIndicator from "../common/circleIndicator";

const Team = (props) => {
    const dispatch = useDispatch();
    const repo = useSelector(state => state.repos.selected || {});
    const allTeams = useSelector(state => state.teams.all || []);
    const selectedTeam = useSelector(state => state.teams.selected || {})
    const users = useSelector(state => state.users.all);
    const [title,setTitle] = useState('');
    const [teams,setTeams] = useState([]);
    const [prs,setPrs] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [values, setValues] = useState([[new DateObject().subtract(6, "days"),new DateObject()]]);
    
    useEffect(()=>{
        console.log('teams',teams);
    },[teams])

    useEffect(()=>{
        if(allTeams.length > 0){
            const index = allTeams.findIndex((t) => t._id === props.match.params.id);
            if(index === -1){
                props.history.goBack();
            }else{
                const team = allTeams[index];
                console.log(team);
                setTitle(team.name);
                setTeams([{
                    _id:team._id,
                    name:team.name
                }])
                setPrs([team.prs])
            }
        }
    },[allTeams])

    const getAllPrsForTeam = async (teamIndex) => {
        let team = allTeams.filter((t) => t._id === teams[teamIndex]._id)[0];
        let val = values[teamIndex];
        let prArr = [];
        let data = [];
        team.users.map((user)=>{
            let i = users.findIndex(u => u.id === user.id);
            users[i].prs.map(pr => {
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
        });
        
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
        getAllPrsForTeam(i).then(prSet => {
            let prArr = prs;
            prArr[i] = prSet;
            setPrs([...prArr]);
        })
    }

    const addComparisions = () => {
        setValues([...values,values[0]]);
        setTeams([...teams,teams[0]]);
        setPrs([...prs,prs[0]]);
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let teamsState = teams;
        teamsState.splice(i,1);
        setTeams([...teamsState]);
        let prArr = prs;
        prArr.splice(i,1);
        setPrs([...prArr]);
    }

    const onTeamSelected = (e,i) => {
        let id = e.target.value;
        let arr = teams;
        let team = teams[0];
        allTeams.map((t)=>{
            if(t._id === id){
                team = {
                    _id:t._id,
                    name:t.name
                };
            }
        });
        arr[i]=team;
        console.log('updated teams',arr);
        console.log('dates',values)
        setTeams([...arr]);
        getAllPrsForTeam(i).then(prSet => {
            let prArr = prs;
            prArr[i] = prSet;
            setPrs([...prArr]);
        })
    }

    const DefaultCharts = () => {
        if(prs.length === 1 && prs[0].length > 0){
            const arr = selectedTeam;
            const result = calculatePrCycle(prs[0],{
                from:convertDate(dateFormat(values[0][0])),
                to:convertDate(dateFormat(values[0][1]))
            });
            const cycle = convertTimeToDays(result.timeTaken.avg);
            let commits = 0;
            let count = {
                total:0,
                open:0,
                closed:0,
                merged:0
            }
            arr.users.map((u) => {
                const usr = users.filter((usr) => usr.id === u.id)[0];
                commits += usr.commits.total;
                count.total += usr.prs.length;
                count.open += usr.prs.filter((pr)=>pr.state.toUpperCase()==="OPEN").length;
                count.closed += usr.prs.filter((pr)=>pr.state.toUpperCase()==="CLOSED").length;
                count.merged += usr.prs.filter((pr)=>pr.state.toUpperCase()==="MERGED").length;
            })
            
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
        return <></>;
    }

    const MultipleCharts = () => {
        return prs.length > 1?(
            <div className="container">
                <div className="flex-container row">
                {multiArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            prs={prs}
                            teams={teams}
                            range={values}
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    return isLoading?<Loading/>:(<>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{title}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={addComparisions}>Compare</button>
                </div>
            </div>
        </div>
        <div className="home-body px-2 py-3 bg-alice-blue">
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