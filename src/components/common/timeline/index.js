import { useEffect, useState } from "react";
import {DateObject} from 'react-multi-date-picker';

import { convertDate, dateFormat, getNextDate, getToday } from "../../../utils/time-conversion";
import { MONTHS, YEAR_SPLIT } from "../../../config/constants";

const Timeline = ({onValueChange,selected}) => {
    let keys = ["quaters","months","last"];
    let lastweek = {
        from:convertDate(dateFormat(new DateObject().set('date',getToday()).subtract(6,'days'))),
        to:convertDate(dateFormat(new DateObject().set('date',getToday()).add(1,'days')))
    };
    const [range,setRange] = useState(lastweek)
    const [prevRange,setPrevRange] = useState({
        from:convertDate(dateFormat(new DateObject().set('date',getToday()).subtract(13,'days'))),
        to:convertDate(dateFormat(new DateObject().set('date',getToday()).subtract(6,'days')))
    })
    const [selectedTimeline,setSelectedTimeline] = useState('last');
    const [timeline,setTimeline] = useState({quaters:[],months:[],last:[
        {
            days:7,
            selected:true,
        },
        {
            days:15,
            selected:false,
        },
        {
            days:30,
            selected:false,
        }
    ]});

    useEffect(()=>{
        let obj = {
            days:7,
            selected:true
        }
        timeline[selectedTimeline].map((o)=>{
            if(o.selected){
                obj = o;
            }
        })
        onValueChange({range,prevRange},selectedTimeline,obj);
    },[range])

    useEffect(()=>{
        let today = getToday();
        let month = today.getMonth();
        let year = today.getFullYear();
        let quaters = [];
        let monthArr = [];
        if(month < 3){
            quaters.push({
                year:year,
                quater:"Q1",
                selected:false
            });
            quaters.push({
                year:year-1,
                quater:"Q4",
                selected:false
            });
            quaters.push({
                year:year-1,
                quater:"Q3",
                selected:false
            });
            quaters.push({
                year:year-1,
                quater:"Q2",
                selected:false
            });
        }else if(month < 6){
            quaters.push({
                year:year,
                quater:"Q2",
                selected:false
            });
            quaters.push({
                year:year,
                quater:"Q1",
                selected:false
            });
            quaters.push({
                year:year-1,
                quater:"Q4",
                selected:false
            });
            quaters.push({
                year:year-1,
                quater:"Q3",
                selected:false
            });
        }else if(month < 9){
            quaters.push({
                year:year,
                quater:"Q3",
                selected:false
            });
            quaters.push({
                year:year,
                quater:"Q2",
                selected:false
            });
            quaters.push({
                year:year,
                quater:"Q1",
                selected:false
            });
            quaters.push({
                year:year-1,
                quater:"Q4",
                selected:false
            });
        }else{
            quaters.push({
                year:year,
                quater:"Q4",
                selected:false
            });
            quaters.push({
                year:year,
                quater:"Q3",
                selected:false
            });
            quaters.push({
                year:year,
                quater:"Q2",
                selected:false
            });
            quaters.push({
                year:year,
                quater:"Q1",
                selected:false
            });
        }

        for(let i=0;i<4;i++,month--){
            if(month < 0){
                month = 11;
                year--;
            }
            monthArr.push({
                name:MONTHS[month],
                month,
                year,
                selected:false
            });
        }
        let last = [
            {
                days:7,
                selected:false,
            },
            {
                days:15,
                selected:false,
            },
            {
                days:30,
                selected:false,
            }
        ]
        let tl = {quaters,months:monthArr,last};
        tl[selected.key].map((t)=>{
            t.selected = false;
            if(selected.key === "quaters"){
                if(t.quater === selected.value.quater){
                    t.selected = true;
                }
            }else if(selected.key === "months"){
                if(t.name === selected.value.name){
                    t.selected = true;
                }
            }else{
                if(t.days === selected.value.days){
                    t.selected = true;
                }
            }
            return t;
        })
        setTimeline(tl);
    },[])

    useEffect(()=>{
        if(timeline.quaters.length > 0){
            getRange();
        }
    },[timeline])

    const getRange = () => {
        let from = range.from;
        let to = range.to;
        let prevFrom = prevRange.from;
        let prevTo = prevRange.to;
        if(selectedTimeline === "quaters"){
            timeline.quaters.map((t)=>{
                if(t.selected){
                    let mul = 1;
                    if(t.quater === "Q2"){
                        mul = 2;
                    }else if(t.quater === "Q3"){
                        mul = 3
                    }else if(t.quater === "Q4"){
                        mul = 4;
                    }
                    let month = (mul * 3);
                    let prevYear = t.year;
                    mul--;
                    if(t.quater === "Q1"){
                        prevYear--;
                        mul = 4;
                    }
                    let prevMonth = mul * 3;

                    from = convertDate('01-'+YEAR_SPLIT[t.quater][0]+'-'+t.year);
                    prevFrom = convertDate('01-'+MONTHS[prevMonth-3]+'-'+prevYear);

                    let lastDate = new Date(t.year,month,0);
                    let prevLastDate = new Date(prevYear,prevMonth,0);
                    prevTo = getNextDate(prevLastDate);
                    to = getNextDate(lastDate);
                }
            })
        }else if(selectedTimeline === "months"){
            timeline.months.map((t)=>{
                if(t.selected){
                    let prevMonth = t.month - 1;
                    let prevYear = t.year;
                    
                    if(t.month === 0){
                        prevMonth = 11;
                        prevYear--;
                    }

                    from = convertDate('01-'+t.name+'-'+t.year);
                    prevFrom = convertDate('01-'+MONTHS[prevMonth]+'-'+prevYear);

                    let lastDate = new Date(t.year,t.month + 1,0);
                    let prevLastDate = new Date(prevYear,prevMonth+1,0);
                    to = getNextDate(lastDate);
                    prevTo = getNextDate(prevLastDate);
                }
            })
        }else{
            timeline.last.map((t)=>{
                if(t.selected){
                    from = getToday();
                    prevFrom = getToday();
                    from.setDate(from.getDate() - t.days + 1);
                    prevFrom.setDate(prevFrom.getDate() - t.days - t.days + 1);
                    prevFrom = convertDate(prevFrom)
                    from = convertDate(from);
                    prevTo = from;
                    to = getNextDate(getToday());

                }
            })
        }
        if(range.from !== from || range.to !== to){
            setRange({from,to});
            setPrevRange({from:prevFrom,to:prevTo});
        }
    }

    const selectTimeline = (key,index) => {
        let data = timeline;
        keys.map((k)=>{
            data[k].map((t,i)=>{
                if(key === k && i === index){
                    t.selected = true;
                    return t; 
                }
                t.selected = false;
                return t;
            })
        })
        setTimeline({...data});
        setSelectedTimeline(key);
    }

    return <div className="btn-toolbar mb-2 mb-md-0">
        {keys.map((k)=>{
            return <div className="btn-group mr-2" key={k}>
                {k === "last" && <button className="btn btn-sm btn-outline-secondary" disabled>Last</button>}
                {timeline[k].map((t,i)=>{
                    let name = '';
                    if(k==="quaters"){
                        name = t.year+' '+t.quater;
                    }else if(k==='months'){
                        name = t.name;
                    }else{
                        name = t.days;
                    }
                    return <button className={t.selected?"btn btn-sm btn-secondary":"btn btn-sm btn-outline-secondary"} key={name} onClick={()=>selectTimeline(k,i)}>{name}</button>
                })}
                {k === "last" && <button className="btn btn-sm btn-outline-secondary" disabled>days</button>}
            </div>
        })}
        
    </div>
}

export default Timeline;