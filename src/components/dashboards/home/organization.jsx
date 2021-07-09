import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

import HtmlTooltip from '../../common/htmlTooltip/index';
import CircleIndicator from '../../common/circleIndicator';
import ChartCard from '../../common/chartCard/index';
import {info} from '../../../assets/svg/index';

import * as http from '../../../utils/http';
import { calculateMetrics, calculatePrCycle, comparePrCycle } from '../../../utils/pr-calculations';
import { convertDate, convertTimeToDays, getDataFromTimePeriod } from '../../../utils/time-conversion';
import {prsCurrent,prsLastDay,prsPrevious} from '../../../config/chat-items';

import './style.css';
import DataCircle from '../../common/dataCircle';
import DataCircles from '../../common/dataCircle/dataCircles';

const Organization = ({orgData,tooltipData,timeline}) => {
    const {today,org} = orgData;
    const {current:currentObject,previous:previousObject} = getDataFromTimePeriod(timeline,org);
    const current = currentObject.result;
    const previous = previousObject.result;
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
                    item={{...prsLastDay,name:' PRs in last 24hrs'}}
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