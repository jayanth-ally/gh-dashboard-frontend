import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import DatePicker, {DateObject} from "react-multi-date-picker";
import HtmlTooltip from '../common/htmlTooltip/index';

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';
import PRTimeline from './timeline';

import * as http from '../../utils/http';
import {convertDate, convertTimeToDays, dateFormat, getNextDate, getRangeFromDateObject,getPreviousRange,getTooltipData,getToday, getDataFromTimePeriod} from '../../utils/time-conversion';
import {calculatePrsByDate} from '../../utils/pr-calculations';
import {defaultArr,multiArr} from '../../config/chat-items';
import * as charts from '../../utils/chart-conversion';
import { Link } from "react-router-dom";
import { HOME_ROUTE, PR_ROUTE } from "../../config/routes";

import {info} from '../../assets/svg/index';
import './pr.css';

const PR = (props) => {
    const dispatch = useDispatch();
    const repo = useSelector(state => state.repos.selected || {});
    const org = useSelector(state => state.org.data.org || []);
    const [prs,setPrs] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [values, setValues] = useState([[new DateObject().set('date',getToday()).subtract(6, "days"),new DateObject().set('date',getToday())]]);
    const [selectedTimeline,setSelectedTimeline] = useState([{key:'last',value:{days:7}}])
    const [tooltip,setTooltip] = useState({current:'last 7 days',previous:'Previous 7 days'});
    
    useEffect(()=>{
        props.setNavKey(props.navKey);
    },[])


    useEffect(()=>{
        if(org.length > 0){
            getPrs(org[0].data[0],0,values[0]);
        }
    },[org])

    const getPrs = (pr,i,rng) => {
        let range1 = getRangeFromDateObject(rng);
        let prevRange1 = getPreviousRange(range1);
        if(!pr.hasOwnProperty('count')){
            setIsLoading(true);
            if(selectedTimeline === 'custom7' || selectedTimeline === 'custom15'){
                http.getPrsData(
                    {
                        id:repo.id,
                        name:repo.name,
                        owner:repo.owner
                    },range1).then(({data})=>{
                        if(data.prs.hasOwnProperty('result')){
                            let prArr = prs;
                            let d = {...data.prs.result,range:range1};
                            if(prs.length > 0){
                                prArr[i] = d;
                                setPrs([...prArr]);
                            }else{
                                setPrs([d])
                            }
                        }
                        setIsLoading(false);
                    },(err)=>{
                        setIsLoading(false);
                    })
            }else{
                // http.getUserById(usr.id).then(({data})=>{
                //     getUser(data.doc,i,rng);
                //     setIsLoading(false);
                // },err => setIsLoading(false))
            }
            return {};
        }else{
            const {current:prResult} = getDataFromTimePeriod(selectedTimeline[i],org);
            if(prResult){
                let prArr = prs;
                let d = prResult.data.filter((val) => val.repo.owner === repo.owner && val.repo.name === repo.name)[0];
                d = {...d,range:range1}
                if(prs.length > 0){
                    prArr[i] = d;
                    setPrs([...prArr])
                }else{
                    setPrs([d])
                }
            }else{
                console.log('invalid result');
                console.log(range1,prevRange1,pr);
            }
        }
    }

    const getPrsFromApi = (index,val) => {
        let from = val[0];
        let to = val[1];
        let range = {
            from: convertDate(dateFormat(from)),
            to: getNextDate(dateFormat(to))
        }
        let v = prs[index].range;
        if(range.from !== v.from || range.to !== v.to){
            setIsLoading(true);
            http.getPrsData(
                {
                    id:repo.id,
                    name:repo.name,
                    owner:repo.owner
                },range).then(({data})=>{
                    if(data.prs.hasOwnProperty('result')){
                        let prArr = prs;
                        let d = data.prs.result;
                        d = {...d,range}
                        if(prs.length > 0){
                            prArr[index] = d;
                            setPrs([...prArr]);
                        }else{
                            setPrs([d])
                        }
                    }
                    setIsLoading(false);
                },(err)=>{
                    setIsLoading(false);
                })
        }
    }

    const onTimelineChanged = (val,index,type,obj) => {
        setTooltip(getTooltipData(type,obj));

        let from = new DateObject({date:new Date(val.range.from)});
        let to = new DateObject({date:new Date(val.range.to)}).subtract(1,'days');

        let tl = selectedTimeline;
        let ranges = values;

        if(index === 0 &&  tl[0].key !== type){
            selectedTimeline.forEach((_,i)=>{
                tl[i] = {key:type,value:obj};
                ranges[i] = [from,to]
                if(type === 'custom7' || type === 'custom15'){
                    getPrsFromApi(i,[from,to]);
                }else{
                    const tm1 = prs[i];
                    getPrs(tm1,i,[from,to]);
                } 
            })
        }else{
            tl[index] = {key:type,value:obj};
            ranges[index] = [from,to];
            if(type === 'custom7' || type === 'custom15'){
                getPrsFromApi(index,[from,to]);
            }else{
                const tm1 = prs[index];
                getPrs(tm1,index,[from,to]);
            } 
        }
        setSelectedTimeline([...tl])
        setValues([...ranges])
    }

    const onDateChanged = (val,i) => {
        let valArr = values;
        if(val.length === 1){
            const to = new DateObject(val[0]).add(6,"days");
            val.push(to);
        }
        valArr[i] = val;
        setValues([...valArr]);
        setIsLoading(true);
        http.getPrsData(
            {
                id:repo.id,
                name:repo.name,
                owner:repo.owner
            },{
                from:dateFormat(val[0]),
                to: getNextDate(dateFormat(val[1]))
            }).then(({data})=>{
                if(data.prs.hasOwnProperty('result')){
                    let prArr = prs;
                    prArr[i] = data.prs;
                    setPrs([...prArr]);
                }
                setIsLoading(false);
            },(err)=>{
                setIsLoading(false);
            })
    }

    const addComparisions = () => {
        setValues([...values,values[0]]);
        setPrs([...prs,prs[0]]);
        setSelectedTimeline([...selectedTimeline,selectedTimeline[0]])
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let prArr = prs;
        prArr.splice(i,1);
        setPrs([...prArr]);
        let stl = selectedTimeline;
        stl.splice(i,1);
        setSelectedTimeline([...stl]);
    }

    const DefaultCharts = () => {
        return prs.length === 1 && prs[0].hasOwnProperty('count')?(
            <div className="container">
                <div className="flex-container row">
                    {defaultArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            result={prs[0]}
                            range={values}
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    const MultipleCharts = () => {
        return prs.length > 1?(
            <div className="container">
                <div className="flex-container row">
                {multiArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            result={prs}
                            range={values}
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    return isLoading?<Loading/>:(<>
        <div className="breadcrumbs">
            <Link to={HOME_ROUTE}>Home</Link>
            <span>/</span>
            <Link to={PR_ROUTE}>Pull requests</Link>
            <span>/</span>
            <span>{props.match.params.owner+"-"+props.match.params.name}</span>
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{props.match.params.owner+"/"+props.match.params.name}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={addComparisions}>Compare</button>
                </div>
            </div>
        </div>
        <div className="home-body px-2 py-3 bg-alice-blue">
            <div className="container">
                <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white flex-container row" style={{padding:'15px',justifyContent:'space-evenly'}}>
                    {values.map((value,i)=>{
                        if(i < prs.length){
                            return <div className='timeline-picker' key={i}>
                                    <PRTimeline onValueChange={onTimelineChanged} selected={selectedTimeline[i]} selectedZero={selectedTimeline[0]} index={i} val={value} removeComparison={removeComparison}/>
                                </div>
                        }
                    })}
                    <div className="info" style={{position:"absolute",top:"0px",right:"10px"}}>
                        <HtmlTooltip
                            placement="top-end"
                            title={<p>Range of all comparisions are equal</p>}
                            arrow>
                            <img src={info} alt={"info"}/>
                        </HtmlTooltip>
                    </div>
                </div>
            </div>
            <DefaultCharts />
            <MultipleCharts/>
        </div>
    </>);
}

export default PR;