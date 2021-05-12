import { useState } from 'react';

import TopChartCard from '../../common/chartCard/topChartCard';

import {topTeamsArr} from '../../../config/chat-items';

const TopTeams = ({teams}) => {
    const [resultKey,setResultKey] = useState('count');
    return <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Top Teams (last 7 days)</h1>
    </div>
    <div className="home-body py-5 bg-alice-blue">
        <div className="container">
            <div className="flex-container row">
                {topTeamsArr.map((item,i)=>{
                    return <TopChartCard 
                        key={i}
                        item={item}
                        resultKey={item.key}
                        teams={teams}
                    />
                })}
            </div>
        </div>
    </div>
    </>;
}

export default TopTeams;