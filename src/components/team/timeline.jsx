import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import DatePicker,{DateObject} from 'react-multi-date-picker';


import { convertDate, dateFormat, getNextDate,getPreviousRange } from "../../utils/time-conversion";
import { MONTHS, YEAR_SPLIT } from "../../config/constants";

const TeamTimeline = ({onValueChange,selected,tname,teams,index}) => {
    let keys = ["quaters","months","last"];
    let lastweek = {
        from:convertDate(dateFormat(new DateObject().subtract(6,'days'))),
        to:convertDate(dateFormat(new DateObject().add(1,'days')))
    };
    const [isExpanded,setIsExpanded] = useState(false);
    const onExpandOrCompress = () => {
        setIsExpanded(!isExpanded);
    }
    const [range,setRange] = useState(lastweek)
    const [prevRange,setPrevRange] = useState({
        from:convertDate(dateFormat(new DateObject().subtract(13,'days'))),
        to:convertDate(dateFormat(new DateObject().subtract(6,'days')))
    })

    const [teamId,setTeamId] = useState(tname._id);
    const [openCalender,setOpenCalender] = useState(false);
    const [value7,setValue7] = useState([]);
    const [value15,setValue15] = useState([]);
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

        if(selectedTimeline === 'custom7'){
            obj = {
                days:7
            }
        }else if(selectedTimeline === 'custom15'){
            obj = {
                days:15
            }
        }else{
            timeline[selectedTimeline].map((o)=>{
                if(o.selected){
                    obj = o;
                }
            })
        }
        onValueChange({range,prevRange},teamId,index,selectedTimeline,obj);
    },[range])

    useEffect(()=>{
        let today = new Date();
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
        }else if(month < 6){
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
        }else if(selectedTimeline === 'last'){
            timeline.last.map((t)=>{
                if(t.selected){
                    from = new Date();
                    prevFrom = new Date();
                    from.setDate(from.getDate() - t.days + 1);
                    prevFrom.setDate(prevFrom.getDate() - t.days - t.days + 1);
                    prevFrom = convertDate(prevFrom)
                    from = convertDate(from);
                    prevTo = from;
                    to = getNextDate(new Date());

                }
            })
        }else if(selectedTimeline === 'custom7'){
            from = convertDate(dateFormat(value7[0]));
            to = convertDate(dateFormat(value7[1]));

            let prev = getPreviousRange({from,to});
            prevFrom = prev.from;
            prevTo = prev.to;
        }else if(selectedTimeline === 'custom15'){
            from = convertDate(dateFormat(value15[0]));
            to = convertDate(dateFormat(value15[1]));

            let prev = getPreviousRange({from,to});
            prevFrom = prev.from;
            prevTo = prev.to;
        }

        if(range.from !== from || range.to !== to){
            setRange({from,to});
            setPrevRange({from:prevFrom,to:prevTo});
        }
    }


    useEffect(()=>{
        if(value7.length > 0){
            let data = timeline;
            keys.map((k)=>{
                data[k].map((t,i)=>{
                    t.selected = false;
                    return t;
                })
            })
            setSelectedTimeline('custom7');
            setTimeline({...data});
            setIsExpanded(false);
        }
    },[value7]);

    useEffect(()=>{
        if(value15.length > 0){
            let data = timeline;
            keys.map((k)=>{
                data[k].map((t,i)=>{
                    t.selected = false;
                    return t;
                })
            })
            setSelectedTimeline('custom15');
            setTimeline({...data});
            setIsExpanded(false);
        }
    },[value15]);

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
        setValue15([]);
        setValue7([]);
        setTimeline({...data});
        setSelectedTimeline(key);
    }

    const closeCalender = () => {
        setOpenCalender(false);
    }

    const onValue7Changed = (val) => {
        if(val.length === 1){
            const to = new DateObject(val[0]).add(6,"days");
            val.push(to);
        }
        setValue7(val);
    }

    const onValue15Changed = (val) => {
        if(val.length === 1){
            const to = new DateObject(val[0]).add(14,"days");
            val.push(to);
        }
        setValue15(val);
    }

    const onTeamChanged = (e) => {
        let team = teams.filter((t)=>t._id === e.target.value);
        setTeamId(team._id);
    }

    return <>
    <div className="dynamic-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer" style={{padding:'2px 5px',border:'2px solid #13ce95'}} onClick={()=>setIsExpanded(true)}>
        {range.from+' ~ '+range.to}    
    </div>
    <Popup open={isExpanded} onClose={()=>setIsExpanded(false)}>
        <div className='team-popup'>
            <div className='popup-close-btn red-hover' onClick={()=>setIsExpanded(false)}>X</div>
            {index === 0 && <div className='team-name'>{tname.name}</div>}
            {index > 0 && <select value={teamId} onChange={onTeamChanged}>
                    {teams.map((team)=>{
                        return <option key={team._id} value={team._id}>{team.name}</option>
                    })}
                </select>}
            <div className="row">
                <div className="btn-toolbar mb-2 mb-md-0 col-md-9" style={{display:'flex',flexDirection:'column'}}>
                    {keys.map((k)=>{
                        return <div className="btn-group mr-2" key={k} style={{margin:'15px'}}>
                            {k === "last" && <button className="btn btn-sm btn-outline-info" disabled>Last</button>}
                            {timeline[k].map((t,i)=>{
                                let name = '';
                                if(k==="quaters"){
                                    name = t.year+' '+t.quater;
                                }else if(k==='months'){
                                    name = t.name;
                                }else{
                                    name = t.days;
                                }
                                return <button className={t.selected?"btn btn-sm btn-info":"btn btn-sm btn-outline-info"} key={name} onClick={()=>selectTimeline(k,i)}>{name}</button>
                            })}
                            {k === "last" && <button className="btn btn-sm btn-outline-info" disabled>days</button>}
                        </div>
                    })}        
                </div>
                <div className='date-pickers col-md-3' style={{display:'flex',flexDirection:'column'}}>
                    <div className="7-days-btn" style={{margin:'5px'}}>
                        Custom select
                    </div>
                    <div className="7-days-btn" style={{margin:'5px'}}>
                        <div className="label" style={{width:'100%',marginBottom:'5px'}}>7 days</div>
                        <DatePicker value={value7} onChange={(val)=>onValue7Changed(val)}  type="button" range showOtherDays hideOnScroll placeholder="7 days"></DatePicker>
                    </div>
                    <div className="15-days-btn" style={{margin:'5px'}}>
                        <div className="label" style={{width:'100%',marginBottom:'5px'}}>15 days</div>
                        <DatePicker value={value15} onChange={(val)=>onValue15Changed(val)}  type="button" range showOtherDays hideOnScroll placeholder="15 days"></DatePicker>
                    </div>
                </div>
            </div>
        </div>
    </Popup>


    </>
}

export default TeamTimeline;