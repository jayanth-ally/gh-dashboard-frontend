import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

import HtmlTooltip from '../../common/htmlTooltip/index';
import CircleIndicator from '../../common/circleIndicator';
import ChartCard from '../../common/chartCard/index';
import {info} from '../../../assets/svg/index';

import * as http from '../../../utils/http';
import { calculateMetrics, calculatePrCycle, comparePrCycle } from '../../../utils/pr-calculations';
import { convertDate, convertTimeToDays } from '../../../utils/time-conversion';
import {prsCurrent,prsLastDay,prsPrevious} from '../../../config/chat-items';

import './style.css';
import DataCircle from '../../common/dataCircle';
import DataCircles from '../../common/dataCircle/dataCircles';

const Organization = ({orgData,tooltipData,range,prevRange}) => {
    const {today,org} = orgData;
    let current = {};
    let previous = {};
    org.map((obj)=>{
        if(obj.range.from === range.from && obj.range.to === range.to){
            current = obj.result;
        }
        if(obj.range.from === prevRange.from && obj.range.to === prevRange.to){
            previous = obj.result;
        }
    })
    return <>
    <div className="home-body py-5 bg-alice-blue">
        <DataCircles 
            current={current}
            previous={previous}
            tooltipData={tooltipData}
        />
        <div className="container">
            <div className="flex-container row">               
                <ChartCard
                    result={today[0]}
                    item={{...prsLastDay,name:' PRS in last 24hrs'}}
                />
                <ChartCard
                    result={current}
                    item={{...prsCurrent,name:'PRs in '+tooltipData.current}}
                />
                <ChartCard
                    result={previous}
                    item={{...prsPrevious,name:'PRs in '+tooltipData.previous}}
                />
                    
            </div>
        </div>
    </div>
    </>;
}

export default Organization;