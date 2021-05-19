import React,{useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Popup from 'reactjs-popup';
import ReactECharts from 'echarts-for-react';

import {expand,compress} from '../../../assets/svg/index';

import 'reactjs-popup/dist/index.css';
import './style.css';
import { getTopFiveTeams } from '../../../utils/pr-calculations';

const ChartCardComponent = ({item,resultKey,expandOrCompress,expanded,teams=[]}) => {
    
    let history = useHistory();
    const [sortedTeams,setSortedTeams] = useState([]);

    useEffect(()=>{
        let teamArr = getTopFiveTeams(teams,resultKey);
        setSortedTeams([...teamArr]);
    },[])

    const onChartClickEvent = (params) => {
        const id = sortedTeams[params.dataIndex].id;
        history.push('/team/'+id);
    }

    const onEvents = {
        'click': onChartClickEvent
    }
    
    return <div className={expanded?"col-md-12":"col-md-6"}>
        <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer" style={{marginTop:expanded?'15px':'0'}}>
            <div className="card-head">
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',padding:'0 20px'}}>
                    <h3 className="h3-text">{item.name}</h3>
                    <span style={{width:'25px',height:'25px'}} onClick={expandOrCompress}><img src={expanded?compress:expand} alt="min-max" width="15px" height="15px" /></span>
                </div>
                <hr/>
            </div>
            <div className="card-body">
                <ReactECharts option={item.option(sortedTeams,resultKey)} onEvents={onEvents}/>
            </div>
        </div>
    </div>
}

const TopChartCard = ({item,resultKey="count",teams=[],expand=false}) => {
    const [isExpanded,setIsExpanded] = useState(false);
    const onExpandOrCompress = () => {
        setIsExpanded(!isExpanded);
    }
    return <React.Fragment>
        <ChartCardComponent
            item={item}
            resultKey={resultKey}
            teams={teams}
            expandOrCompress={onExpandOrCompress}
            expanded={false}
        />
        <Popup open={isExpanded} onClose={()=>setIsExpanded(false)}>
            <ChartCardComponent
                item={item}
                resultKey={resultKey}
                teams={teams}
                expandOrCompress={onExpandOrCompress}
                expanded={true}
            />
        </Popup>
    </React.Fragment>
}

export default TopChartCard;