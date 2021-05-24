import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

import HtmlTooltip from '../../common/htmlTooltip/index';
import CircleIndicator from '../../common/circleIndicator';
import ChartCard from '../../common/chartCard/index';
import {info} from '../../../assets/svg/index';

import * as http from '../../../utils/http';
import { calculateMetrics, calculatePrCycle, comparePrCycle } from '../../../utils/pr-calculations';
import { convertDate, convertTimeToDays } from '../../../utils/time-conversion';
import {prsLastWeek,prsLastDay,prsPreviousWeek} from '../../../config/chat-items';

import './style.css';

const Organization = ({repos,users}) => {
    
    let to = new Date();
    let from = new Date();
    from.setDate(to.getDate() - 6);

    let lastweekFrom = new Date();
    let lastweekTo = new Date();
    lastweekTo.setDate(from.getDate()-1);
    lastweekFrom.setDate(lastweekTo.getDate()-6);
    
    let data = {
        users:users.length,
        repos:repos.length,
        totalPrs:{
            total:0,
            open:0,
            closed:0,
            merged:0,
        },
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
        additions:0,
        deletions:0,
        reviews:0,
        reviewed:0,
        arr:[],
        arrToday:[],
    };

    let pastData = {
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
        additions:0,
        deletions:0,
        reviews:0,
        reviewed:0,
        arr:[],
    }

    repos.map(repo => {
        data.totalPrs.total += repo.totalPr
        data.totalPrs.open += repo.totalPrOpen
        data.totalPrs.closed += repo.totalPrClosed
        data.totalPrs.merged += repo.totalPrMerged
        data.arr = [...data.arr,...repo.prs];
        pastData.arr = [...pastData.arr,...repo.pastPrs];
    })

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    data.arrToday = data.arr.filter((pr)=> pr.updatedAt >= yesterday.toISOString());

    let result = calculateMetrics(data.arr);
    data.prs.total = result.count.total;
    data.prs.open = result.count.open;
    data.prs.closed = result.count.closed;
    data.prs.merged = result.count.merged;
    data.resolved = result.count.closed+result.count.merged;
    data.commits = result.commits.total;
    data.reviews = result.reviews.total;
    data.reverts = result.commits.reverts;
    data.additions = result.files.totalAdditions;
    data.deletions = result.files.totalDeletions;

    result = calculatePrCycle(data.arr,{prCycle:true});
    data.prs.cycle = convertTimeToDays(result.timeTaken.avg);

    data.arr.map((d)=>{
        if(d.reviewThreads.length > 0 || d.reviews > 0){
            data.reviewed ++;
        }
    })

    let pastPrs = pastData.arr;
    let pastResult = calculateMetrics(pastPrs);
    let pastDataObj = {
        prs:{
            total:pastResult.count.total,
            open:pastResult.count.open,
            closed:pastResult.count.closed,
            merged:pastResult.count.merged,
            cycle:0,
        },
        reverts:pastResult.commits.reverts,
        commits:pastResult.commits.total,
        resolved:pastResult.count.closed+pastResult.count.merged,
        additions:pastResult.files.totalAdditions,
        deletions:pastResult.files.totalDeletions,
        reviews:pastResult.reviews.total,
        reviewed:0,
    }

    pastResult = calculatePrCycle(pastData.arr,{from:convertDate(lastweekFrom),to:convertDate(lastweekTo),prCycle:true});
    pastDataObj.prs.cycle = convertTimeToDays(pastResult.timeTaken.avg);

    pastPrs.map((d)=>{
        if(d.reviewThreads.length > 0 || d.reviews > 0){
            pastDataObj.reviewed ++;
        }
    })
    pastData = pastDataObj;

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
                            end={data.totalPrs.total}
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
                        end={data.totalPrs.open}
                    />
                </div>
                <div className="counter totalPrOpen-count">
                    <CircleIndicator
                        text="Closed"
                        background="#EF7070"
                        size="72px"
                        end={data.totalPrs.closed}
                    />
                </div>
                <div className="counter totalPrOpen-count">
                    <CircleIndicator
                        text="Merged"
                        background="#6f42c1"
                        size="72px"
                        end={data.totalPrs.merged}
                    />
                </div>
            </div>
        </div>
    </div>;
    }

    return <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <img src="https://ally.io/wp-content/themes/sightbox/assets/images/logo.svg" alt="Ally.io" width="100px" height="30px" />
    </div>
    <div className="home-body py-5 bg-alice-blue">
        <div className="container">
            <div className="flex-container row">
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">                            
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Average no of time to close a PR
                                    <br/> (previous week / last 7 days)<br/>
                                    <br/> Time taken to close a PR 
                                    <br/> below 4hrs are not considered</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={comparePrCycle(pastDataObj.prs.cycle,data.prs.cycle)?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.prs.cycle}
                                    </div>
                                    <div className="new-data">
                                        {data.prs.cycle}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    PR Cycle
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Average PR resolved
                                    <br/> in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.resolved > data.resolved ? "row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.resolved}
                                    </div>
                                    <div className="new-data">
                                        {data.resolved}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    Resolved
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Average PR merged 
                                    <br/> in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.prs.merged > data.prs.merged?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.prs.merged}
                                    </div>
                                    <div className="new-data">
                                        {data.prs.merged}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    PRs Merged
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Average PR Review 
                                    <br/>comments in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.reviews > data.reviews?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.reviews}
                                    </div>
                                    <div className="new-data">
                                        {data.reviews}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    Review Comments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Total no of PR 
                                    <br/>reviewed in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.reviewed > data.reviewed?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.reviewed}
                                    </div>
                                    <div className="new-data">
                                        {data.reviewed}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    PRs Reviewed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Total reverts 
                                    <br/>in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.reverts < data.reverts?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.reverts}
                                    </div>
                                    <div className="new-data">
                                        {data.reverts}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    Commits reverted
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Total no of lines
                                    <br/>added in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.additions > data.additions?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.additions}
                                    </div>
                                    <div className="new-data">
                                        {data.additions}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    Additions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
                        <div className="info">
                            <HtmlTooltip
                                placement="top-end"
                                title={<p>
                                    Total no of lines
                                    <br/>deleted in last 7 days</p>}
                                arrow>
                                <img src={info} alt={"info"}/>
                            </HtmlTooltip>
                        </div>
                        <div className="card-body" style={{padding:'11px'}}>
                            <div className={pastDataObj.deletions < data.deletions?"row pr-cycle red":"row pr-cycle green"}>
                                <div className="pr-cycle-circle">
                                    <div className="old-data">
                                        {pastData.deletions}
                                    </div>
                                    <div className="new-data">
                                        {data.deletions}
                                    </div>
                                </div>
                                <div className="pr-cycle-title">
                                    Deletions
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
                <ChartCard
                    item={prsPreviousWeek}
                    prs={pastPrs}
                    range={[]}
                />
                    
            </div>
        </div>
    </div>
    </>;
}

export default Organization;