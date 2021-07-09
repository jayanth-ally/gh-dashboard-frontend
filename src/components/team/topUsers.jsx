import { useState } from 'react';

import TopChartCard from '../common/chartCard/topChartCard';
import Loading from '../loading/loading';

import {topUsersArr} from '../../config/chat-items';
import { getDataFromTimePeriod } from '../../utils/time-conversion';

const TopUsers = ({usersData,tooltipData,range,timeline}) => {
    let userArr = [];
    usersData.map((user,i)=>{
        const {current} = getDataFromTimePeriod(timeline,user.values);
        userArr.push({
            _id:user.id,
            name:user.login,
            range,
            result:current.result
        })
        
    })

    return <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Top Users ({tooltipData.current})</h1>
    </div>
    <div className="home-body py-5 bg-alice-blue">
        <div className="container">
            <div className="flex-container row">
                {topUsersArr.map((item,i)=>{
                    return <TopChartCard 
                        key={i}
                        item={item}
                        resultKey={item.key}
                        arr={userArr}
                        count={3}
                    />
                })}
            </div>
        </div>
    </div>
    </>;
}

export default TopUsers;