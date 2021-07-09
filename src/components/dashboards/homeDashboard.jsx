import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {DateObject} from 'react-multi-date-picker';

import Loading from "../loading/loading";

import Organization from './home/organization';
import Timeline from "../common/timeline/index";

import * as http from '../../utils/http';
import {convertDate,dateFormat, getNextDate, getTooltipData,getToday} from '../../utils/time-conversion';
import {addOrgData} from '../../store/org/actions';
import {addUsers,fetchingUsers} from '../../store/users/actions';
import {addTeams} from '../../store/teams/actions';
import TopTeams from "./home/topTeams";
import { getTopFiveTeams } from "../../utils/pr-calculations";
import { HOME_ROUTE } from "../../config/routes";
import {MONTHS,YEAR_SPLIT} from '../../config/constants';

const HomeDashboard = (props) => {

    const dispatch = useDispatch();
    const users = useSelector(state => state.users.all);
    const fetchingUsersData = useSelector(state => state.users.fetching);
    const teams = useSelector(state => state.teams.all);
    const orgData = useSelector(state => state.org.data);
    const [range,setRange] = useState({
        from:convertDate(dateFormat(new DateObject().set('date',getToday()).subtract(6,'days'))),
        to:convertDate(dateFormat(new DateObject().set('date',getToday()).add(1,'days')))
    })
    const [prevRange,setPrevRange] = useState({
        from:convertDate(dateFormat(new DateObject().set('date',getToday()).subtract(13,'days'))),
        to:convertDate(dateFormat(new DateObject().set('date',getToday()).subtract(6,'days')))
    })

    const [topFiveTeams,setTopFiveTeams] = useState([]);
    const [tooltip,setTooltip] = useState({current:'last 7 days',previous:'Previous 7 days'});
    const [selectedTimeline,setSelectedTimeline] = useState({key:'last',value:{days:7}})
    const [isLoading,setIsLoading] = useState(false);
    const [loadingData,setLoadingData] = useState({
        prs:false,
        users:false,
        teams:false,
        org:false,
    });
    
    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    const onTimelineChanged = (val,type,obj) => {
        setTooltip(getTooltipData(type,obj));
        setSelectedTimeline({key:type,value:obj})

        if(val.range.from !== range.from || val.range.to !== range.to){
            setRange({...val.range});
            setPrevRange({...val.prevRange});
        }
    }
    
    useEffect(()=>{
        loadData();
    },[dispatch])

    useEffect(()=>{
        if(orgData.hasOwnProperty('today')){
            setLoadingData({
                ...loadingData,
                org:false,
            })
        }
    },[orgData])

    useEffect(()=>{
        if(users.length > 0){
            setLoadingData({
                ...loadingData,
                users:false,
            })
        }
    },[users])

    useEffect(()=>{
        if(teams.length > 0){
            setLoadingData({
                ...loadingData,
                teams:false,
            })
        }
    },[teams])

    useEffect(()=>{
        if(!loadingData.users && !loadingData.teams && !loadingData.org){
            setIsLoading(false);
        }else{
            setIsLoading(true);
        }
    },[loadingData])

    const loadData = () => {

        if(!orgData.hasOwnProperty('today')){
            setLoadingData({
                ...loadingData,
                org:true
            })
            http.getOrgData(range,prevRange).then(({data})=>{
                dispatch(addOrgData(({...data})));
            })
        }

        if(teams.length === 0){
            setLoadingData({
                ...loadingData,
                teams:true,
            })
            http.getTeamsData(range,prevRange).then(({data})=>{
                dispatch(addTeams(data.teams));
            })
        }

        if(users.length === 0 && !fetchingUsersData){
            setLoadingData({
                ...loadingData,
                users:true,
            })
            dispatch(fetchingUsers(true));
            http.getUsers(range).then(({data}) => {
                dispatch(addUsers(data.users));    
            },(err)=>{
                setLoadingData({
                    ...loadingData,
                    users:false,
                })
            })
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <span>Home</span>
            </div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <img src="https://ally.io/wp-content/themes/sightbox/assets/images/logo.svg" alt="Ally.io" width="100px" height="30px" />
                <Timeline onValueChange={onTimelineChanged} selected={selectedTimeline}/>
            </div>
            
            {orgData.hasOwnProperty('today')? <Organization orgData={orgData} tooltipData={tooltip} timeline={selectedTimeline}/>: <Loading/> }   
            {teams.length > 0 ?   <TopTeams teamsData={teams} tooltipData={tooltip} range={range} timeline={selectedTimeline}/> : <Loading/>}
        </>
    );
}

export default HomeDashboard;