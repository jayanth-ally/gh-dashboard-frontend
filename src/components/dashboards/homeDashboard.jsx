import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {Link} from 'react-router-dom';

import Loading from "../loading/loading";
import CircleIndicator from '../common/circleIndicator';

import * as http from '../../utils/http';
import {addRepos} from '../../store/repos/actions';

const HomeDashboard = (props) => {
    const dispatch = useDispatch();
    const repos = useSelector(state => state.repos.all);
    const [isLoading,setIsLoading] = useState(false);
    
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

    return isLoading?<Loading/>:(
        <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Repositories</h1>
        </div>
        <div className="home-body py-5 bg-alice-blue">
            <div className="container">
                <div className="flex-container row">
                    {repos.map((repo)=>{
                        return (<div className="col-md-4" key={repo.id}>
                                <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white">
                                    <div className="card-head">
                                        <h3 className="h3-text">{repo.owner+'/'+repo.name}</h3>
                                        <hr/>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="counter collaborators-count">
                                                <CircleIndicator
                                                    text="Users"
                                                    background="#41a4e5"
                                                    size="84px"
                                                    end={repo.totalCollaborators}
                                                />
                                            </div>
                                            <div className="counter totalPr-count">
                                                <Link to={'pulls/'+repo.owner+'/'+repo.name}>
                                                    <CircleIndicator
                                                        text="PR"
                                                        background="grey"
                                                        size="84px"
                                                        end={repo.totalPr}
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="row">
                                            <div className="counter totalPrOpen-count">
                                                <CircleIndicator
                                                    text="Open"
                                                    background="#13ce95"
                                                    size="72px"
                                                    end={repo.totalPrOpen}
                                                />
                                            </div>
                                            <div className="counter totalPrOpen-count">
                                                <CircleIndicator
                                                    text="Closed"
                                                    background="#EF7070"
                                                    size="72px"
                                                    end={repo.totalPrClosed}
                                                />
                                            </div>
                                            <div className="counter totalPrOpen-count">
                                                <CircleIndicator
                                                    text="Merged"
                                                    background="#6f42c1"
                                                    size="72px"
                                                    end={repo.totalPrMerged}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>);
                    })}
                </div>
            </div>
        </div>
        </>
    );
}

export default HomeDashboard;