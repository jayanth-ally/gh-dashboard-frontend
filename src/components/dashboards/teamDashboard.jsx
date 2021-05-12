import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import ReactECharts from 'echarts-for-react';
import {DateObject} from "react-multi-date-picker"

import Loading from '../loading/loading';

import * as http from '../../utils/http';
import {addUsers} from '../../store/users/actions';
import {addTeams,deleteTeam,selectTeam,updateTeam} from '../../store/teams/actions';

import { 
    CREATE_TEAM_ROUTE,
    EDIT_TEAM_ROUTE
} from '../../config/routes';

import {calculatePrsByDate} from '../../utils/pr-calculations';
import { convertDate, convertTime, dateFormat } from "../../utils/time-conversion";
import * as charts from '../../utils/chart-conversion';

const TeamDashboard = (props) => {
    const dispatch = useDispatch();
    const teams = useSelector(state => state.teams.all);
    const users = useSelector(state => state.users.all);
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
        if(users.length !== 0){
            getAllTeams();
        }
    },[users])

    const refreshPage = () => {
        getAllTeams();
    }

    const getAllTeams = () => {
        setIsLoading(true);
        http.getTeams().then(async ({data}) => {
            let allTeams = [];
            await Promise.all(data.teams.map( async (team) => {
                const _team =  await getAllPrsForTeam(team);
                allTeams = [...allTeams,{..._team}];
            }));
            dispatch(addTeams(allTeams));       
            setIsLoading(false);
        },(err)=>{
            setIsLoading(false);
        })
    }

    const createNewTeam = () => {
        props.history.push(CREATE_TEAM_ROUTE);
    }

    const onEditTeam = (team) => {
        dispatch(selectTeam(team));
        props.history.push(EDIT_TEAM_ROUTE);
    }

    const onDeleteTeam = (team) => {
        dispatch(deleteTeam(team));
        http.deleteTeam(team);
    }

    const getAllPrsForTeam = async (team) => {
        let prs = [];
        let data = [];
        team.users.map((user)=>{
            let i = users.findIndex(u => u.id === user.id);
            users[i].prs.map(pr => {
                let index = data.findIndex(d => d.repo.id === pr.repo.id);
                let lastweek = new DateObject().subtract(6,"days");
                if(pr.updatedAt >= convertDate(dateFormat(lastweek))){
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
            prs = [...prs,...data.prs];
        }));
        console.log(prs);
        return Object.assign({}, team, {prs});
    }

    const goToTeamPage = (team) => {
        dispatch(selectTeam(team));
        props.history.push('/team/'+team._id);
    }

    return isLoading?<Loading/>:(
        <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Teams</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={refreshPage}>Refresh</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={createNewTeam}>Add Team</button>
                </div>
            </div>
        </div>
        <div className="home-body py-5 bg-alice-blue">
            <div className="container">
                <div className="flex-container row">
                    {teams.length === 0 && <div className="empty-dashboard"><span>No Teams Found</span></div>} 
                    {teams.map((team,index)=>{
                        let graph = <></>;
                        if(team.hasOwnProperty('prs')){
                            const resultSet = calculatePrsByDate(team.prs);
                            if(resultSet.count > 0){
                                graph = <ReactECharts option={charts.getStackedLineForNoOfPrs(team.prs)} />;
                            }
                        }
                        return <div key={index} className="col-md-6">
                            <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer" onClick={()=>goToTeamPage(team)}>
                                <div className="team-name">
                                    {team.name}
                                </div>
                                <hr/>
                                <div className="card-body">
                                    {graph}
                                    <div className="action-btns btn-group mr-2">
                                        <button className="btn btn-sm btn-outline-success" onClick={()=>{onEditTeam(team)}}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={()=>{onDeleteTeam(team)}}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </>
    );

}

export default TeamDashboard;