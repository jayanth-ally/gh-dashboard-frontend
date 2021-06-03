import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactECharts from 'echarts-for-react';
import {DateObject} from "react-multi-date-picker"

import Loading from '../loading/loading';

import * as http from '../../utils/http';
import {addUsers} from '../../store/users/actions';
import {addTeams,deleteTeam,selectTeam,updateTeam} from '../../store/teams/actions';
import {getPrCount} from '../../utils/pr-calculations';

import {edit,editGreen,deleteIcon,deleteRed} from '../../assets/svg/index';

import { 
    CREATE_TEAM_ROUTE,
    EDIT_TEAM_ROUTE,
    HOME_ROUTE
} from '../../config/routes';

import {calculatePrsByDate} from '../../utils/pr-calculations';
import { convertDate, convertTime, dateFormat } from "../../utils/time-conversion";
import * as charts from '../../utils/chart-conversion';

const TeamDashboard = (props) => {
    const dispatch = useDispatch();
    const teams = useSelector(state => state.teams.all);
    const users = useSelector(state => state.users.all);
    const [isLoading,setIsLoading] = useState(true);
    const [showMenu,setShowMenu] = useState([]);
    let range = {
        from:convertDate(dateFormat(new DateObject().subtract(6,'days'))),
        to:convertDate(dateFormat(new DateObject().add(1,'days')))
    };

    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    useEffect(()=>{
        if(teams.length > 0){
            setIsLoading(false);
        }
        let menu = [];
        teams.map((_)=>{
            menu.push(false);
        })
        setShowMenu([...menu]);
    },[teams])

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

    const refreshPage = () => {
        getAllTeams();
    }

    const getAllTeams = () => {
        setIsLoading(true);
        http.getTeamsData(range).then(({data})=>{
            dispatch(addTeams(data.teams));
            setIsLoading(false);
        },err=>{
            setIsLoading(false);
        })
    }

    const createNewTeam = () => {
        props.history.push(CREATE_TEAM_ROUTE);
    }

    const onEditTeam = (e,team) => {
        e.stopPropagation();
        dispatch(selectTeam(team));
        props.history.push(EDIT_TEAM_ROUTE);
    }

    const onDeleteTeam = (e,team) => {
        e.stopPropagation();
        dispatch(deleteTeam(team));
        http.deleteTeam(team);
    }

    const goToTeamPage = (team) => {
        dispatch(selectTeam(team));
        props.history.push('/team/'+team._id);
    }

    const onMenuClicked = (e,i) => {
        e.stopPropagation();
        openMenu(e,i);
    }

    const openMenu = (event,i) => {
        event.preventDefault();
        let menu = [];
        showMenu.map((_)=>{
            menu.push(false);
        })
        if(!showMenu[i]){
            menu[i] = true;
        }
        setShowMenu([...menu]);
        document.addEventListener('click', (event)=>closeMenu(event));
      }
      
      const closeMenu = (event) => {
        
          let menu = [];
          showMenu.map((_)=>{
            menu.push(false);
          })
          setShowMenu([...menu]);
          document.removeEventListener('click', (event)=>closeMenu(event));
      }

    return isLoading?<Loading/>:(
        <>
        <div className="breadcrumbs">
            <Link to={HOME_ROUTE}>Home</Link>
            <span>/</span>
            <span>Teams</span>
        </div>
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
                        if(team.hasOwnProperty('values')){
                            const result = team.values.filter((val) => val.range.from === range.from && val.range.to === range.to)[0].result;
                            graph = <ReactECharts option={charts.getBarForNoOfPrs(result)} />;
                        }
                        return <div key={index} className="col-md-6">
                            <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer" onClick={()=>goToTeamPage(team)}>
                                <div className="team-name">
                                    {team.name}
                                </div>
                                <div className="team-menu">
                                    <div onClick={(e)=>onMenuClicked(e,index)} className="menu-btn">
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                    </div>
                                    {showMenu[index] && <div className="card menu">
                                            <div onClick={(e)=>{onEditTeam(e,team)}} className="edit green-hover">
                                                <img src={editGreen} width="15px" height="15px"/>
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={(e)=>{onDeleteTeam(e,team)}} className="delete red-hover"> 
                                                <img src={deleteRed} width="15px" height="15px"/>
                                                <span>Delete</span>
                                            </div>
                                        </div>}
                                </div>
                                <hr/>
                                <div className="card-body">
                                    {graph}
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