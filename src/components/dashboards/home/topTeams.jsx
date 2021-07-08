import { useState } from 'react';

import TopChartCard from '../../common/chartCard/topChartCard';
import Loading from '../../loading/loading';

import {topTeamsArr} from '../../../config/chat-items';
import { getDataFromTimePeriod } from '../../../utils/time-conversion';

const TopTeams = ({teamsData,tooltipData,range,timeline}) => {
    let teamArr = [];
    teamsData.map((team,i)=>{
        const {current} = getDataFromTimePeriod(timeline,team.values);
        teamArr.push({
            _id:team._id,
            name:team.name,
            range,
            result:current.result
        })
        
    })

    return <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Top Teams ({tooltipData.current})</h1>
    </div>
    <div className="home-body py-5 bg-alice-blue">
        <div className="container">
            <div className="flex-container row">
                {topTeamsArr.map((item,i)=>{
                    return <TopChartCard 
                        key={i}
                        item={item}
                        resultKey={item.key}
                        arr={teamArr}
                    />
                })}
            </div>
        </div>
    </div>
    </>;
}

export default TopTeams;