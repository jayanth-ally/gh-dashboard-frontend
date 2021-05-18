const getDiffDays = (pr) => {
    const lastUpdated = new Date(pr.updated_at);
    const created = new Date(pr.createdAt);
    const today = new Date();
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
    }else if(days == 0 && hours >0){
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
}