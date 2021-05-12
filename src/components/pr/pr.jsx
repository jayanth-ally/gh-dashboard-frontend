import React,{ useState,useEffect, useRef, createRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import DatePicker, {DateObject} from "react-multi-date-picker";

import ChartCard from '../common/chartCard/index';
import Loading from '../loading/loading';

import * as http from '../../utils/http';
import {dateFormat} from '../../utils/time-conversion';
import {calculatePrsByDate} from '../../utils/pr-calculations';
import {defaultArr,multiArr} from '../../config/chat-items';
import * as charts from '../../utils/chart-conversion';

const PR = (props) => {
    const dispatch = useDispatch();
    const repo = useSelector(state => state.repos.selected || {});
    const [prs,setPrs] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [values, setValues] = useState([[new DateObject().subtract(6, "days"),new DateObject()]]);
    
    useEffect(()=>{
        console.log(values);
    },[values])
    useEffect(()=>{
        if(repo.hasOwnProperty('prs')){
            setPrs([repo.prs]);
        }
    },[repo])

    const onDateChanged = (val,i) => {
        let valArr = values;
        if(val.length === 1){
            const to = new DateObject(val[0]).add(6,"days");
            val.push(to);
        }
        valArr[i] = val;
        setValues([...valArr]);
        http.getPrsByDate(
            {
                id:repo.id,
                name:repo.name,
                owner:repo.owner
            },{
                from:dateFormat(val[0]),
                to:dateFormat(val[1])
            }).then(({data})=>{
                if(data.prs.length > 0){
                    let prArr = prs;
                    prArr[i] = data.prs;
                    setPrs([...prArr]);
                    console.log(prArr);
                }
            })
    }

    const addComparisions = () => {
        setValues([...values,values[0]]);
        setPrs([...prs,prs[0]]);
    }

    const removeComparison = (i) => {
        let valArr = values;
        valArr.splice(i,1);
        setValues([...valArr]);
        let prArr = prs;
        prArr.splice(i,1);
        setPrs([...prArr]);
    }

    const DefaultCharts = () => {
        return prs.length === 1 && prs[0].length > 0?(
            <div className="container">
                <div className="flex-container row">
                    {defaultArr.map((item,index)=>{
                        return <ChartCard key={index}
                            item={item}
                            prs={prs[0]}
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
                            prs={prs}
                            range={values}
                        />
                    })}
                </div>
            </div>
        ):<></>;
    }

    return isLoading?<Loading/>:(<>
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
                        return <div className="multi-date-picker" key={i}>
                                <DatePicker value={value} onChange={(val)=>onDateChanged(val,i)} type="button" range showOtherDays hideOnScroll>
                                    {i > 0 && <button className="btn btn-sm btn-outline-danger" onClick={()=>removeComparison(i)}>Delete</button>}
                                </DatePicker>
                        </div>
                    })}
                </div>
            </div>
            <DefaultCharts />
            <MultipleCharts/>
        </div>
    </>);
}

export default PR;