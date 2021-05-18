import { useEffect } from 'react';
import {Link} from 'react-router-dom';

import CircleIndicator from '../../common/circleIndicator';
import ChartCard from '../../common/chartCard/index';

import { calculateMetrics, calculatePrCycle } from '../../../utils/pr-calculations';
import { convertDate, convertTimeToDays } from '../../../utils/time-conversion';
import {prsLastWeek,prsLastDay} from '../../../config/chat-items';

import './style.css';

const Organization = ({repos,users}) => {
    let data = {
        users:users.length,
        repos:repos.length,
        prs:{
            total:0,
            open:0,
            closed:0,
            merged:0,
            cycle:0,
        },
        reverts:0,
        commits:0,
        resolved:0,
        reviews:0,
        reviewed:0,
        arr:[],
        arrToday:[],
        filteredArr:[],
    };

    repos.map(repo => {
        data.prs.total += repo.totalPr
        data.prs.open += repo.totalPrOpen
        data.prs.closed += repo.totalPrClosed
        data.prs.merged += repo.totalPrMerged
        data.arr = [...data.arr,...repo.prs];
    })

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    data.arrToday = data.arr.filter((pr)=> pr.updatedAt >= yesterday.toISOString());

    let result = calculatePrCycle(data.arr,{prCycle:true});
    data.prs.cycle = convertTimeToDays(result.timeTaken.avg);
    
    result = calculatePrCycle(data.arr);
    data.commits = result.commits.total;
    data.reviews = result.reviews.total;
    data.reverts = result.commits.reverts;
    data.resolved = result.count.closed+result.count.merged;

    let to = new Date();
    let from = new Date();
    from.setDate(to.getDate() - 6);

    data.filteredArr = data.arr.filter((pr) => pr.createdAt >= convertDate(from) && pr.closedAt !== null && pr.closedAt <= convertDate(to));

    data.filteredArr.map((d)=>{
        if(d.reviewThreads.length > 0 || d.reviews > 0){
            data.reviewed ++;
        }
    })

    const Indicators = () => {
        return <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
        <div className="card-body">
            <div className="row">
                <div className="counter collaborators-count">
                    <CircleIndicator
                        text="Users"
                        background="#41a4e5"
                        size="84px"
                        end={data.users}
                    />
                </div>
                <div className="counter repo-count">
                    <CircleIndicator
                        text="Repos"
                        background="#c68143"
                        size="84px"
                        end={data.repos}
                    />
                </div>
                <div className="counter totalPr-count">
                    <Link to={'pulls/'}>
                        <CircleIndicator
                            text="PR"
                            background="grey"
                            size="84px"
                            end={data.prs.total}
                        />
                    </Link>
                </div>
            </div>
            <br/>
            {/* <ReactECharts option={item.option(prs,range,teams)} /> */}
            <div className="row">
                <div className="counter totalPrOpen-count">
                    <CircleIndicator
                        text="Open"
                        background="#13ce95"
                        size="72px"
                        end={data.prs.open}
                    />
                </div>
                <div className="counter totalPrOpen-count">
                    <CircleIndicator
                        text="Closed"
                        background="#EF7070"
                        size="72px"
                        end={data.prs.closed}
                    />
                </div>
                <div className="counter totalPrOpen-count">
                    <CircleIndicator
                        text="Merged"
                        background="#6f42c1"
                        size="72px"
                        end={data.prs.merged}
                    />
                </div>
            </div>
        </div>
    </div>;
    }

    return <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">My Organization</h1>
    </div>
    <div className="home-body py-5 bg-alice-blue">
        <div className="container">
            <div className="flex-container row">
                <div className="col-md-4">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className="row">
                                <div className="pr-cycle-circle">
                                    {data.prs.cycle}
                                </div>
                                <div className="pr-cycle">
                                    PR Cycle
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className="row">
                                <div className="pr-cycle-circle">
                                    {data.resolved}
                                </div>
                                <div className="pr-cycle">
                                    Resolved
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className="row">
                                <div className="pr-cycle-circle">
                                    {result.count.merged}
                                </div>
                                <div className="pr-cycle">
                                    Prs Merged
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4" style={{display:'flex',flexDirection:'column'}}>
                    
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className="row">
                                <div className="pr-cycle-circle">
                                    {data.reviews}
                                </div>
                                <div className="pr-cycle">
                                    Review Comments
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className="row">
                                <div className="pr-cycle-circle">
                                    {data.reviewed}
                                </div>
                                <div className="pr-cycle">
                                    Prs Reviewed
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className="row">
                                <div className="pr-cycle-circle">
                                    {data.reverts}
                                </div>
                                <div className="pr-cycle">
                                    Commits reverted
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ChartCard
                    item={prsLastDay}
                    prs={data.arrToday}
                    range={[]}
                />
                <ChartCard
                    item={prsLastWeek}
                    prs={data.arr}
                    range={[]}
                />
                    
            </div>
        </div>
    </div>
    </>;
}

export default Organization;