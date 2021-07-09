import { MONTHS } from "../config/constants";

const getDiffDays = (pr) => {
    const lastUpdated = new Date(pr.updated_at);
    const created = new Date(pr.createdAt);
    const today = getToday();
    // const diffDays = Math.floor(Math.abs(today - lastUpdated) / (1000 * 60 * 60 * 24));
    const diffDays = Math.floor(Math.abs(today - created) / (1000 * 60 * 60 * 24));
    return diffDays;     
}

const msToDHM = (milliseconds) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    return [days, hours, minutes, milliseconds];
}

const convertTime = (seconds) => {
    const [days,hours,minutes,milliseconds] = msToDHM(seconds*1000);
    return days+" days, "+hours+" hours and "+minutes+" minutes";
}

const convertTimeToDays = (seconds) => {
    const [days,hours,minutes,milliseconds] = msToDHM(seconds*1000);
    if(days > 0 || hours >0){
        return days+'.'+Math.ceil((hours*10)/24)+' day(s)';
    }else if(days === 0 && hours >0){
        return '0.'+Math.ceil((minutes*10)/60)+' hour(s)';
    }else{
        return '0.'+minutes+' min(s)';
    }
}

const getTimeDifference = (start,end)=>{
    const milliseconds = Math.abs(end - start);
    return msToDHM(milliseconds);
}

const getTimeDifferenceInSeconds = (start,end)=>{
    const milliseconds = Math.abs(end - start);
    return milliseconds/1000;
}

// data = {day,month,year}
const dateFormat = (date,reverse=1) => {
    if(reverse === -1){
        return date.day+"/"+date.month+"/"+date.year;
    }
    return date.year+"/"+date.month+"/"+date.day;
}

// Format -> YYYY-MM-DD
const convertDate = (newDate) => {
    let convertedDate = new Date(newDate);
    const year = convertedDate.getFullYear();
    let month = convertedDate.getMonth()+1;
    let date = convertedDate.getDate();
    if(month <= 9){
        month = '0'+month;
    }
    if(date <= 9){
        date = '0'+date;
    }
    convertedDate = year+'-'+month+'-'+date;
    return convertedDate;
}

const getNextDate = (date) => {
    let nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate()+1);
    return convertDate(nextDate);
}

const getPreviousDate = (date) => {
    let previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate()-1);
    return convertDate(previousDate);
}

const getTooltipData = (type,obj) => {
    let current = 'last 7 days';
    let previous = 'previous 7 days';

    if(type === 'quaters'){
        current = obj.year+' '+obj.quater;
        previous = obj.quater === 'Q1'? (obj.year - 1+' Q4'):obj.year+' Q'+(parseInt(obj.quater.split('')[1])-1);
    }else if (type === 'months'){
        current = obj.name+' ('+obj.year+')';
        previous = obj.month === 0 ? 'DEC ('+(obj.year-1)+')' :MONTHS[obj.month - 1]+ ' ('+obj.year+')';
    }else if(type === 'last'){
        current = 'last '+obj.days+' days';
        previous = 'previous '+obj.days+' days';
    }else if(type === 'custom7'){
        current = obj.days+' days';
        previous = obj.days+' days';
    }else if(type === 'custom15'){
        current = obj.days+' days';
        previous = obj.days+' days';
    }
    return {current,previous};
}

const getRangeFromDateObject = (val) => {
    let range = {
        from:convertDate(dateFormat(val[0])),
        to:getNextDate(dateFormat(val[1]))
    }
    return range;
}

const getPreviousRange = (range) => {
    let from = new Date(range.from);
    let to = new Date(range.to);

    let startDate = from.getDate();
    let month = from.getMonth()+1;
    let year = from.getFullYear();
    const diff = Math.floor(Math.abs(to - from) / (1000 * 60 * 60 * 24));
    if(diff > 60){
        let mul = 0;
        if(month < 3){
            mul = 1;
        }else if(month < 6){
            mul = 2
        }else if(month < 9){
            mul = 3;
        }else{
            mul = 4;
        }
        let prevYear = year;
        mul--;
        if(mul === 0){
            prevYear--;
            mul = 4;
        }
        let prevMonth = mul * 3;

        let prevFrom = convertDate('01-'+MONTHS[prevMonth - 3]+'-'+prevYear);
        let prevTo = convertDate(from);
        return {from:prevFrom,to:prevTo}
    }else if(diff > 20 && startDate === 1){
        let prevMonth = month - 1;
        let prevYear = year;
        
        if(month === 0){
            prevMonth = 11;
            prevYear--;
        }

        let prevFrom = convertDate('01-'+MONTHS[prevMonth-1]+'-'+prevYear);
        let prevTo = convertDate(from);

        return {from:prevFrom,to:prevTo}
    }else{
        to = convertDate(from);
        from.setDate(from.getDate() - diff);
        from = convertDate(from);
        return {from,to};
    }
}

const getToday = () => {
    let date = new Date();
    let currentOffset = date.getTimezoneOffset();
    let ISTOffset = 330;
    let istDate = new Date(date.getTime() + (ISTOffset + currentOffset)*60000)
    return istDate;
}

const getPreviousQuater = ({year,quater}) => {
    let key = '';
    if(quater === 'Q1'){
        key = (year-1)+" Q4";
    }else if(quater === 'Q2'){
        key = year+" Q1";
    }else if(quater === 'Q3'){
        key = year+" Q2";
    }else if(quater === 'Q4'){
        key = year+" Q3";
    }
    return key;
}

const getPreviousMonth = (name) => {
    const index = MONTHS.findIndex(month => month === name);
    if(index === 0){
        return MONTHS[11]
    }
    return MONTHS[index-1]
}

const getDataFromTimePeriod = (timeline,ranges) => {
    let key = 7;
    let previousKey = 7;
    if(timeline.key === "last"){
        key = timeline.value.days;
        const current = ranges.filter((data)=> data.name.toString() === key.toString() && !data.previous)[0];
        const previous = ranges.filter((data)=>data.name.toString() === key.toString() && data.previous)[0];
        return {current,previous};
    }else{
        if(timeline.key === "quaters"){
            key = timeline.value.year + " "+timeline.value.quater;
            previousKey = getPreviousQuater(timeline.value);
        }else if(timeline.key === "months"){
            key = timeline.value.name;
            previousKey = getPreviousMonth(key);
        }
        if(key !== 7){
            const current = ranges.filter((data)=>data.name.toString() === key.toString())[0];
            const previous = ranges.filter((data)=>data.name.toString() === previousKey.toString())[0];
            return {current,previous};
        }else{
            return {current:{},previous:{},message:"Non expected values provided"};
        }
    }

}

export {
    getDiffDays,
    msToDHM,
    convertTime,
    convertTimeToDays,
    getTimeDifference,
    getTimeDifferenceInSeconds,
    dateFormat,
    convertDate,
    getNextDate,
    getPreviousDate,
    getTooltipData,
    getRangeFromDateObject,
    getPreviousRange,
    getToday,
    getDataFromTimePeriod
}