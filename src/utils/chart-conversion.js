import { deleteTeam } from './http';
import { calculateMetrics, calculatePrCycle, calculatePrsByDate, getTopFiveTeams } from './pr-calculations';
import {convertDate, convertTime, convertTimeToDays, dateFormat} from './time-conversion';

const getBarForNoOfPrs = (resultObj) => {
    let result = resultObj;
    const key = "count";
    if(result === undefined){
        result = {
            count:{
                total:0,
                open:0,
                closed:0,
                merged:0
            }
        }
    }
    let data = [];
    let series = [{
        type: 'bar',
        name:'total',
        data:[]
    },
    {
        type: 'bar',
        name:'open',
        data:[]
    },
    {
        type: 'bar',
        name:'closed',
        data:[]
    },
    {
        type: 'bar',
        name:'merged',
        data:[]
    }];
    // [0] - total
    // [1] - open
    // [2] - closed
    // [3] - merged
    series[0].data.push(result[key].total || 0);
    series[1].data.push(result[key].open || 0);
    series[2].data.push(result[key].closed || 0);
    series[3].data.push(result[key].merged || 0);

    const options = {
        legend:{
            data:['total','open','closed','merged']
        },
        grid: { top: 50, right: 8, bottom: 30, left: 36 },
        xAxis : { 
          type: 'category',
          data:['prs'],       
        },
        yAxis : { 
          type: 'value',
        },
        series,
        tooltip: {
          trigger: 'axis',
        },
      };
      return options;
}

const getStackedLineForNoOfPrs = (prs) => {
    let {resultSet} = calculatePrsByDate(prs);
    const key = "count";
    let data = [];
    let series = [{
        type: 'line',
        name:'total',
        data:[]
    },
    {
        type: 'line',
        name:'open',
        data:[]
    },
    {
        type: 'line',
        name:'closed',
        data:[]
    },
    {
        type: 'line',
        name:'merged',
        data:[]
    }];
    // [0] - total
    // [1] - open
    // [2] - closed
    // [3] - merged
    resultSet.map(({date,result})=>{
        data.push(date);
        if(result.count.total > 0){
            series[0].data.push(result[key].total || 0);
            series[1].data.push(result[key].open || 0);
            series[2].data.push(result[key].closed || 0);
            series[3].data.push(result[key].merged || 0);
        }else{
            series[0].data.push(0);
            series[1].data.push(0);
            series[2].data.push(0);
            series[3].data.push(0);
        }
    })
    const options = {
        legend:{
            data:['total','open','closed','merged']
        },
        grid: { top: 50, right: 8, bottom: 30, left: 36 },
        xAxis : { 
          type: 'category',
          data,       
        },
        yAxis : { 
          type: 'value',
        },
        series,
        tooltip: {
          trigger: 'axis',
        },
      };
      return options;
}

// comments, commits, reviews, timetaken, fileschanged, iterations
const getStackedLineForPrs = ({resultSet},key) => {
    let data = [];
    let series = [{
        type: 'line',
        name:'total',
        data:[]
    },
    {
        type: 'line',
        name:'avg',
        data:[]
    },
    {
        type: 'line',
        name:'max',
        data:[]
    }];
    // [0] - total
    // [1] - avg
    // [2] - max
    let c=1;
    resultSet.map(({date,by,result})=>{
        data.push(by+' '+c);

        c++;
        if(result.count.total > 0){
            series[0].data.push(result[key].total || 0);
            series[1].data.push(result[key].avg || 0);
            series[2].data.push(result[key].max || 0);
        }else{
            series[0].data.push(0);
            series[1].data.push(0);
            series[2].data.push(0);
        }
    })
    let options = {
        legend:{
            data:['total','avg','max']
        },
        grid: { top: 50, right: 8, bottom: 30, left: 36 },
        xAxis : { 
          type: 'category',
          data,       
        },
        yAxis : { 
          type: 'value',
        },
        series,
        tooltip: {
          trigger: 'axis'
        },
      };
      if(key === 'prCycle'){
          options = {...options,tooltip:{
            trigger: 'axis',
            formatter:formatTimeTaken
          }}
      }
      return options;
}

const formatTimeTaken = (params,ticket,callback) => {

    let span = '';
    params.map((param)=>{
        const value = param.value;
        const seriesName = param.seriesName;
        const time = convertTime(value);
         span += `
            <div style="margin:0px 0 0;line-height:2">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                <span style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${seriesName}</span>
                <span style="float:right; font-size:14px; color:#666; font-weight:900; margin-left:10px">${time}</span>
            </div>
            `;
    })
    let html = `<div style="margin:0px 0 0;line-height:1">
        <div style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${params[0].name}</div>
        <div style="margin: 10px 0 0; line-height:1">
        ${span}
        </div>
    </div>`;
    return html;
}

const getStackedLineForFiles = ({resultSet}) => {
    // const {resultSet} = calculatePrsByDate(prs);
    const key = "files";
    let data = [];
    let series = [{
        type: 'line',
        name:'additions',
        data:[]
    },
    {
        type: 'line',
        name:'deletions',
        data:[]
    }];
    // [0] - additions
    // [1] - deletions
    let c=1;
    resultSet.map(({date,by,result})=>{
        data.push(by+' '+c);
        c++;
        if(result.count.total > 0){
            series[0].data.push(result[key].additions || 0);
            series[1].data.push(result[key].deletions || 0);
        }else{
            series[0].data.push(0);
            series[1].data.push(0);
        }
    })
    let options = {
        legend:{
            data:['additions','deletions']
        },
        grid: { top: 50, right: 8, bottom: 30, left: 36 },
        xAxis : { 
          type: 'category',
          data,       
        },
        yAxis : { 
          type: 'value',
        },
        series,
        tooltip: {
          trigger: 'axis'
        },
      };
      return options;
}

const getStackedLineForReverts = ({resultSet}) => {
    // const {resultSet} = calculatePrsByDate(prs);
    const key = "reverts";
    let data = [];
    let series = [{
        type: 'line',
        name:'reverts',
        data:[]
    }];
    // [0] - reverts
    let c=1;
    resultSet.map(({date,by,result})=>{
        data.push(by+' '+c);
        c++;
        if(result.count.total > 0){
            series[0].data.push(result.commits.reverts || 0);
        }else{
            series[0].data.push(0);
        }
    })
    let options = {
        legend:{
            data:['reverts']
        },
        grid: { top: 50, right: 8, bottom: 30, left: 36 },
        xAxis : { 
          type: 'category',
          data,       
        },
        yAxis : { 
          type: 'value',
        },
        series,
        tooltip: {
          trigger: 'axis'
        },
      };
      return options;
}

const getStackedLinesForMultiplePrs = (result,range,key='commits',innerKey='total',type="") => {
    let data = [];
    let days = [];
    let dates = [];
    let series = [];
    let resultSet = [];
    if(key === "count" && innerKey === "total"){
        // console.log(result);
    }
    range.map((value,i)=>{
        let rng = dateFormat(value[0])+" ~ "+dateFormat(value[1]); 
        if(type === "teams"){
            rng = result[i].name+' - '+rng;
        }else if(type === "users"){
            rng = result[i].login+' - '+rng;
        }
        data.push(rng);
        series.push({
            type:'bar',
            name:rng,
            data:[]
        })
    })
    let day = 1;
    result.map((item,index)=>{
        let res = item;
        if(type !== ""){
            res = item.data;
        }
        if(index===0){
            res.resultSet.map(({date,by,result})=>{
                days.push(by+' '+day);
                day++;
            })
        }
        dates.push([]);
        res.resultSet.map(({date,result})=>{
            dates[index].push(date);
            if(result[key][innerKey] > 0){
                series[index].data.push(result[key][innerKey] || 0)
            }else{
                series[index].data.push(0)
            }
        })
    });
    let options = {
        legend:{
            data,
        },
        grid: { top: 50, right: 8, bottom: 30, left: 36 },
        xAxis : { 
          type: 'category',
          data:days,       
        },
        yAxis : { 
          type: 'value',
        },
        series,
        tooltip: {
          trigger: 'axis',
          formatter:(params,ticket,callback)=>formatMultiple(params,dates)
        },
      };
      if(key === 'prCycle'){
        options = {...options,tooltip:{
          trigger: 'axis',
          formatter:(params,ticket,callback)=>formatMultipleTimeTaken(params,dates)
        }}
    }
      return options;
}

const formatMultiple = (params,dates) => {

    let span = '';
    const title = params[0].name;
    const index = parseInt(title.split(' ')[1])-1;
    params.map((param,i)=>{
        const value = param.value;
        const seriesName = param.seriesName;
         span += `
            <div style="margin:0px 0 0;line-height:2">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                <span style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${dates[i][index].from+'~'+dates[i][index].to}</span>
                <span style="float:right; font-size:14px; color:#666; font-weight:900; margin-left:10px">${value}</span>
            </div>
            `;
    })
    let html = `<div style="margin:0px 0 0;line-height:1">
        <div style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${title}</div>
        <div style="margin: 10px 0 0; line-height:1">
        ${span}
        </div>
    </div>`;
    return html;
}

const formatMultipleTimeTaken = (params,dates) => {

    let span = '';
    const title = params[0].name;
    const index = parseInt(title.split(' ')[1])-1;
    params.map((param,i)=>{
        const value = param.value;
        const seriesName = param.seriesName;
        const time = convertTime(value);
         span += `
            <div style="margin:0px 0 0;line-height:2">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                <span style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${dates[i][index].from+'~'+dates[i][index].to}</span>
                <span style="float:right; font-size:14px; color:#666; font-weight:900; margin-left:10px">${time}</span>
            </div>
            `;
    })
    let html = `<div style="margin:0px 0 0;line-height:1">
        <div style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${title}</div>
        <div style="margin: 10px 0 0; line-height:1">
        ${span}
        </div>
    </div>`;
    return html;
}

const getHorizontalStackedBarsForTeamsPRCount = (teams=[]) => {
    const key = 'count';
    if(teams.length === 0 ){
        return {};
    }

    let data = ['open','closed','merged'];

    let series = [];
    data.map((name)=>{
        series.push({
            type: 'bar',
            name,
            stack: 'total',
            label: {
                show: false
            },
            emphasis: {
                focus: 'series'
            },
            data:[]
        })
    })
    let teamArr = [];
    teams.map((team)=>{
        let val = team.name;
        if(val.length > 10){
            val = val.split('-')[0];
        }
        teamArr.push({id:team._id,value:val});
        let result = team.result;

        data.map((name,i)=>{
            series[i].data.push(result[key][name]);
        })
    })
    let options = {
        legend:{
            data,
        },
        grid: { top: 50, right: 20, bottom: 30, left: 70 },
        xAxis : { 
          type: 'value',
        },
        yAxis : { 
            type: 'category',
            data:teamArr, 
        },
        series,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            },
          formatter:(params,t,c)=>formatPRCountForTopTeams(params)
        },
      };
      return options;
}

const formatPRCountForTopTeams = (params) => {
    let span = '';
    let total = 0;
    params.map((param)=>{
        const value = param.value;
        const seriesName = param.seriesName;
        total += value;
         span += `
            <div style="margin:0px 0 0;line-height:2">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                <span style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${seriesName}</span>
                <span style="float:right; font-size:14px; color:#666; font-weight:900; margin-left:10px">${value}</span>
            </div>
            `;
    })
    let html = `<div style="margin:0px 0 0;line-height:1">
        <div style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${params[0].name+' (total: '+total+')'}</div>
        <div style="margin: 10px 0 0; line-height:1">
        ${span}
        </div>
    </div>`;
    return html;
}

const getHorizontalStackedBarsForTeamsPRCycle = (teams=[]) => {
    const key = 'prCycle';
    if(teams.length === 0 ){
        return {};
    }

    let data = ['PR Cycle'];

    let series = [];
    data.map((name)=>{
        series.push({
            type: 'bar',
            name,
            stack: 'total',
            label: {
                show: false
            },
            emphasis: {
                focus: 'series'
            },
            data:[]
        })
    })
    let teamArr = [];
    teams.map((team)=>{
        let val = team.name;
        if(val.length > 10){
            val = val.split('-')[0];
        }
        teamArr.push({id:team._id,value:team.name});
        let result = team.result;

        data.map((name,i)=>{
            series[i].data.push(result[key]['avg']);
        })
    })
    let options = {
        legend:{
            data,
        },
        grid: { top: 50, right: 20, bottom: 30, left: 70 },
        xAxis : { 
          type: 'value',
        },
        yAxis : { 
            type: 'category',
            data:teamArr,       
        },
        series,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            },
          formatter:(params,t,c)=>formatPRCountForTopTeamsPRCycle(params)
        },
      };
      return options;
}

const formatPRCountForTopTeamsPRCycle = (params) => {
    let span = '';
    params.map((param)=>{
        const value = param.value;
        const seriesName = param.seriesName;
         span += `
            <div style="margin:0px 0 0;line-height:2">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                <span style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${seriesName}</span>
                <span style="float:right; font-size:14px; color:#666; font-weight:900; margin-left:10px">${convertTimeToDays(value)}</span>
            </div>
            `;
    })
    let html = `<div style="margin:0px 0 0;line-height:1">
        <div style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${params[0].name}</div>
        <div style="margin: 10px 0 0; line-height:1">
        ${span}
        </div>
    </div>`;
    return html;
}

const getHorizontalStackedBarsForTeams = (teams=[],key="count") => {
    if(teams.length === 0 ){
        return {};
    }

    let data = Object.keys(teams[0].result[key]);
    data = data.filter((d)=>d!== 'maxPr' && d!== 'count');
    if(key === 'prCycle'){
        data = ['avg']
    }

    let series = [];
    data.map((name)=>{
        series.push({
            type: 'bar',
            name,
            data:[]
        })
    })
    let teamArr = [];
    teams.map((team)=>{
        teamArr.push(team.name);
        let result = team.result;

        data.map((name,i)=>{
            if(key === 'prCycle'){
                series[i].data.push((result[key][name]/(60*60)));
            }else{
                series[i].data.push(result[key][name]);
            }
        })
    })
    let options = {
        legend:{
            data,
        },
        grid: { top: 50, right: 20, bottom: 30, left: 50 },
        xAxis : { 
            type: 'category',
            data:teamArr,  
        },
        yAxis : { 
            type:'value' 
        },
        series,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
      };
      if(key === 'prCycle'){
        options = {...options,tooltip:{
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            },
          formatter:(params,t,c)=>formatTimeTakenForTopTeams(params)
        }}
    }
      return options;
}

const formatTimeTakenForTopTeams = (params) => {

    let span = '';
    params.map((param)=>{
        const value = param.value;
        const seriesName = param.seriesName;
        const time = convertTime(value*60*60);
         span += `
            <div style="margin:0px 0 0;line-height:2">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                <span style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${seriesName}</span>
                <span style="float:right; font-size:14px; color:#666; font-weight:900; margin-left:10px">${time}</span>
            </div>
            `;
    })
    let html = `<div style="margin:0px 0 0;line-height:1">
        <div style="font-size:14px; color:#666; font-weight:400; margin-left:2px">${params[0].name}</div>
        <div style="margin: 10px 0 0; line-height:1">
        ${span}
        </div>
    </div>`;
    return html;
}

export {
    getBarForNoOfPrs,
    getStackedLineForNoOfPrs,
    getStackedLineForPrs,
    getStackedLineForFiles,
    getStackedLineForReverts,

    getStackedLinesForMultiplePrs,
    getHorizontalStackedBarsForTeamsPRCount,
    getHorizontalStackedBarsForTeamsPRCycle,
    getHorizontalStackedBarsForTeams,
}