import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactECharts from 'echarts-for-react';
import {DateObject} from 'react-multi-date-picker';

import Loading from "../loading/loading";
import CircleIndicator from '../common/circleIndicator';

import * as http from '../../utils/http';
import {addRepos,addPrs,selectRepo} from '../../store/repos/actions';

import { 
    HOME_ROUTE,
    PR_ROUTE,
} from '../../config/routes';

import {calculatePrsByDate} from '../../utils/pr-calculations';
import { convertDate, convertTime, dateFormat } from "../../utils/time-conversion";
import * as charts from '../../utils/chart-conversion';

const PrDashboard = (props) => {
    const dispatch = useDispatch();
    const repos = useSelector(state => state.repos.all || []);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])

    useEffect(()=>{
        if(repos.length === 0){
            setIsLoading(true);
            http.getRepos().then(({data}) => {
                dispatch(addRepos(data.repos));     
                setIsLoading(false);
            },(err)=>{
                setIsLoading(false);
            })
        }
    },[dispatch])

    useEffect(()=>{
        if(repos.length > 0 && !repos[0].prs.hasOwnProperty('result')){
            setIsLoading(true);
            repos.map((repo)=>{
                const range = {
                    from: convertDate(dateFormat(new DateObject().subtract(6,'days'))),
                    to: convertDate(dateFormat(new DateObject().add(1,'days'))),
                }
                const r = {
                    id:repo.id,
                    owner:repo.owner,
                    name:repo.name
                };
                http.getPrsData(r,range).then(({data})=>{
                    dispatch(addPrs(r,data.prs));
                    setIsLoading(false);
                },(err)=>{
                    setIsLoading(false);
                }) 
            })    
        }
    },[repos]);

    const repoOnClick = (repo) => {
        dispatch(selectRepo(repo));
        props.history.push(PR_ROUTE+"/"+repo.owner+"/"+repo.name);
    }

    return isLoading?<Loading/>:(
        <>
        <div className="breadcrumbs">
            <Link to={HOME_ROUTE}>Home</Link>
            <span>/</span>
            <span>Pull Requests</span>
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">PR Dashboard (Last 7 days)</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary">Filter</button>
                </div>
            </div>
        </div>
        <div className="home-body py-5 bg-alice-blue">
            <div className="container">
                <div className="flex-container row">
                    {repos.map((repo)=>{
                        if(repo.prs.hasOwnProperty('result')){
                            return (<div className="col-md-4" key={repo.id}>
                            <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer" onClick={()=>repoOnClick(repo)}>
                                <div className="card-head">
                                    <h3 className="h3-text">{repo.owner+'/'+repo.name}</h3>
                                    <hr/>
                                </div>
                                <div className="card-body">
                                        <ReactECharts option={charts.getBarForNoOfPrs(repo.prs.result)} />
                                </div>
                            </div>
                        </div>);
                        }
                    })}
                </div>
            </div>
        </div>
        </>
    );
}

export default PrDashboard;