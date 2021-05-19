import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {DateObject} from 'react-multi-date-picker';

import Loading from "../loading/loading";

import Organization from './home/organization';

import * as http from '../../utils/http';
import {convertDate,dateFormat} from '../../utils/time-conversion';
import {addRepos,addPrs, addPastPrs} from '../../store/repos/actions';
import {addUsers} from '../../store/users/actions';
import {addTeams} from '../../store/teams/actions';
import TopTeams from "./home/topTeams";
import { getTopFiveTeams } from "../../utils/pr-calculations";

const HomeDashboard = (props) => {
    const dispatch = useDispatch();
    const repos = useSelector(state => state.repos.all);
    const users = useSelector(state => state.users.all);
    const teams = useSelector(state => state.teams.all);
    const [topFiveTeams,setTopFiveTeams] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [loadingData,setLoadingData] = useState({
        repo:false,
        prs:false,
        users:false,
        teams:false,
    });
    
    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    useEffect(()=>{
        loadData();
    },[dispatch])

    useEffect(()=>{
        if(teams.length>0){
            setTopFiveTeams(getTopFiveTeams(teams));
        }
    },[teams])

    useEffect(()=>{
        if(!loadingData.repos && !loadingData.prs && !loadingData.users && !loadingData.teams){
            setIsLoading(false);
        }else{
            setIsLoading(true);
        }
    },[loadingData])

    const loadData = () => {
        if(repos.length === 0){
            setLoadingData({
                ...loadingData,
                repos:true,
            })
            http.getRepos().then(({data}) => {
                dispatch(addRepos(data.repos)); 
                setLoadingData({
                    ...loadingData,
                    repos:false,
                })
                data.repos.map((repo,i)=>{
                    setLoadingData({
                        ...loadingData,
                        prs:true,
                    })
                    http.getPrsByDate(repo).then(({data}) => {
                        dispatch(addPrs(repo,data.prs));  
                        if(i === repos.length-1){
                            setLoadingData({
                                ...loadingData,
                                prs:false,
                            })
                        }
                    },err => {
                        if(i === repos.length-1){
                            setLoadingData({
                                ...loadingData,
                                prs:false,
                            })
                        }
                    })

                    let from = new Date();
                    let to = new Date();
                    to.setDate(from.getDate() - 7);
                    from.setDate(to.getDate() - 6);
                    http.getPrsByDate(repo,{from:convertDate(from),to:convertDate(to)}).then(({data}) => {
                        dispatch(addPastPrs(repo,data.prs));  
                        if(i === repos.length-1){
                            setLoadingData({
                                ...loadingData,
                                prs:false,
                            })
                        }
                    },err => {
                        if(i === repos.length-1){
                            setLoadingData({
                                ...loadingData,
                                prs:false,
                            })
                        }
                    })
                })          
            },(err)=>{
                setLoadingData({
                    ...loadingData,
                    repos:false,
                })
            })
        }
        if(users.length === 0){
            setLoadingData({
                ...loadingData,
                users:true,
            })
            http.getUsers().then(({data}) => {
                dispatch(addUsers(data.users));           
                getAllTeams(data.users);
                setLoadingData({
                    ...loadingData,
                    users:false,
                })
            },(err)=>{
                setLoadingData({
                    ...loadingData,
                    users:false,
                })
            })
        }
    }

    const getAllTeams = (userArr) => {
        setLoadingData({
            ...loadingData,
            teams:true,
        })
        http.getTeams().then(async ({data}) => {
            let allTeams = [];
            await Promise.all(data.teams.map( async (team) => {
                const _team =  await getAllPrsForTeam(team,userArr);
                allTeams = [...allTeams,{..._team}];
            }));
            dispatch(addTeams(allTeams));      
            setLoadingData({
                ...loadingData,
                teams:false,
            })
        },(err)=>{
            setLoadingData({
                ...loadingData,
                teams:false,
            })
        })
    }

    const getAllPrsForTeam = async (team,userArr) => {
        let prs = [];
        let data = [];
        team.users.map((user)=>{
            let i = userArr.findIndex(u => u.id === user.id);
            userArr[i].prs.map(pr => {
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
        return Object.assign({}, team, {prs});
    }

    return isLoading?<Loading/>:(
        <>
            <div className="breadcrumbs">
                <span>Home</span>
            </div>
            <Organization repos={repos} users={users}/>
            <TopTeams teams={teams}/>
        </>
    );
}

export default HomeDashboard;