import {convertDate,convertTimeToDays,getNextDate,getPreviousDate} from './time-conversion';
import { MIN_PR_CYCLE_TIME } from '../config/constants';

const calculatePrsByDate = (prs,options={}) => {
    let resultSet = [];
    if(prs.length === 0){
        // return {message:"No Prs available",count:0,resultSet};
    }
    // prs = filterPrsByDate(prs,options);
    let lastDate = new Date().toISOString();
    let endDate = new Date().toISOString();
    if(options.hasOwnProperty('from') && options.hasOwnProperty('to')){
        lastDate = new Date(options.from).toISOString();
        endDate = new Date(options.to).toISOString();
    }else if(options.hasOwnProperty('from')){
        lastDate = new Date(options.from).toISOString();
        endDate = new Date().toISOString();
    }else{
        prs.map((pr)=>{
            if(pr.updatedAt < lastDate){
                lastDate = pr.updatedAt;
            }
            if(endDate < pr.updatedAt){
                endDate = pr.updatedAt;
            }
        })
    }
    endDate = getNextDate(endDate);
    const startDate = convertDate(lastDate);
    let total = 0;
    let from = startDate;
    let to = getNextDate(startDate);

    while(total <= prs.length && from < endDate){
        let arr = prs.filter((pr)=>(pr.updatedAt >= from && pr.updatedAt <= to));
        total += arr.length;
        let obj = {
            date:from,
            result:calculateMetrics(arr,options)
        }
        resultSet.push(obj);
        from = to;
        to = getNextDate(to);
    }
    return {count:prs.length,resultSet};
}

const filterPrsByDate = (prs,options) => {
    if(options === {}){
        return prs;
    }
    let from = '';
    let to = '';
    if(options.hasOwnProperty('lastdays')){
        to = new Date();
        from = new Date();       
        from.setDate(to.getDate() - options.lastdays);
    }else if(options.hasOwnProperty('from') && options.hasOwnProperty('to')){
        from = new Date(options.from);
        to = new Date(options.to);
    }else if(options.hasOwnProperty('from')){
        from = new Date(options.from);
        to = new Date();
    }else{
        // default show metrics for last 7 days
        to = new Date();
        from = new Date();
        from.setDate(to.getDate() - 7);
        // For testing purpose
        // from.setDate(to.getDate() - 30);
    }
    from = convertDate(from);
    to = getNextDate(to);
    let arr = prs.filter(pr => pr.updatedAt >= from && pr.updatedAt <= to);
    return arr;
}

const calculateMetrics = (prs,options={}) => {
    if(prs.length === 0){
        return {
            repo:'',
            count:{
                total:0,
                open:0,
                closed:0,
                merged:0,
            },
            commits:{
                total:0,
                avg:0,
                max:0,
                maxPr:{},
                reverts:0,
            },
            reviews:{
                total:0,
                avg:0,
                max:0,
                maxPr:{},
                count:0,
            },
            iterations:{
                total:0,
                avg:0,
                max:0
            },
            comments:{
                total:0,
                avg:0,
                max:0
            },
            timeTaken:{
                total:0,
                avg:0,
                max:0,
                maxPr:{},
            },
            changedFiles:{
                total:0,
                avg:0,
                max:0,
                maxPr:{}
            },
            files:{
                total:0,
                max:0,
                maxFile:{},
                avgAdditions:0,
                totalAdditions:0,
                avgDeletions:0,
                totalDeletions:0
            }
        };
    }
    const [totalTimeTaken,avgTimeTaken, maxTimeTaken] = calculatePrTimeTaken(prs,options);
    const [totalCommits,avgCommits, maxCommits,reverts] = calculatePrCommits(prs);
    const [totalReviews,avgReviews, maxReviews,totalPrWithReview,iterations] = calculatePrReviews(prs);
    const [totalComments,avgComments, maxComments] = calculatePrComments(prs);
    const [totalChangedFiles,avgChangedFiles, maxChangedFiles,files] = calculatePrFiles(prs);
    let result = {
        repo:prs[0].repo,
        count:{
            total:prs.length,
            open:getPrCount(prs,"OPEN"),
            closed:getPrCount(prs,"CLOSED"),
            merged:getPrCount(prs,"MERGED"),
        },
        commits:{
            total:totalCommits,
            avg:ParseFloat(avgCommits),
            max:maxCommits.value,
            maxPr:maxCommits.pr,
            reverts,
        },
        reviews:{
            total:totalReviews,
            avg:ParseFloat(avgReviews),
            max:maxReviews.value,
            maxPr:maxReviews.pr,
            count:totalPrWithReview,
        },
        iterations:iterations,
        comments:{
            total:totalComments,
            avg:ParseFloat(avgComments),
            max:maxComments
        },
        timeTaken:{
            total:totalTimeTaken,
            avg:ParseFloat(avgTimeTaken),
            max:maxTimeTaken.value,
            maxPr:maxTimeTaken.pr,
        },
        changedFiles:{
            total:totalChangedFiles,
            avg:ParseFloat(avgChangedFiles),
            max:maxChangedFiles.value,
            maxPr:maxChangedFiles.pr
        },
        files:{
            total:files.total,
            max:files.value,
            maxFile:files.file,
            avgAdditions:ParseFloat(files.avgAdditions),
            totalAdditions:files.totalAdditions,
            avgDeletions:ParseFloat(files.avgDeletions),
            totalDeletions:files.totalDeletions
        }
    };
    return result;
}

const getPrCount = (prs,state) => {
    let prArr = [];
    prs.map((pr)=>{
        if(pr.state.toLowerCase() === state.toLowerCase()){
            prArr.push(pr);
        }
    })
    return prArr.length;
}

const calculatePrComments = (prs) => {
    let avg = 0;
    let max = 0;
    let maxPr = {};
    let total = 0;
    prs.map((pr)=>{
        const len = pr.comments;
        avg+=len;
        total++;
        if(len > max){
            max = len;
            maxPr = {id:pr.id,number:pr.number,repo:pr.repo};
        }
    })
    return [avg,avg/total,{value:max,pr:maxPr}];
}

const calculatePrFiles = (prs) => {
    let avg = 0;
    let max = 0;
    let maxPr = {};
    let total = 0;
    let files = [];
    prs.map((pr)=>{
        const len = pr.changedFiles;
        avg+=len;
        total++;
        if(len > max){
            max = len;
            maxPr = {id:pr.id,number:pr.number,repo:pr.repo};
        }
        pr.files.map((file)=>{
            const index = files.findIndex((f)=>f.path === file.path);
            if(index !== -1){
                files[index].count++;
            }else{
                files.push({...file,count:1});
            }
        })
    })
    let totalFiles = files.length;
    let avgAdditions = 0;
    let avgDeletions = 0;
    let maxFileCount = 0;
    let fileWithMaxCount = {};
    files.map((file)=>{
        avgAdditions += file.additions;
        avgDeletions += file.deletions;
        if(file.count > maxFileCount){
            maxFileCount = file.count;
            fileWithMaxCount = file;
        }
    })
    return [avg,avg/total,{value:max,pr:maxPr},{value:maxFileCount,file:fileWithMaxCount,total:files.length,avgAdditions:avgAdditions/totalFiles,totalAdditions:avgAdditions,avgDeletions:avgDeletions/totalFiles,totalDeletions:avgDeletions}];
}

const calculatePrCommits = (prs) => {
    let avg = 0;
    let max = 0;
    let maxPr = {};
    let total = 0;
    let reverts = 0;
    prs.map((pr)=>{
        const len = pr.commits.length;
        avg+=len;
        total++;
        if(len > max){
            max = len;
            maxPr = {id:pr.id,number:pr.number,repo:pr.repo};
        }
        pr.commits.map(({message})=>{
            if(message.substring(0,8).includes("Revert \"")){
                    reverts++;
            }
        })
    })
    return [avg,avg/total,{value:max,pr:maxPr},reverts];
}

const calculatePrReviews = (prs) => {
    let avg = 0;
    let max = 0;
    let maxPr = {};
    let avgIteration = 0;
    let maxIteration = 0;
    let maxIterationPr = {};
    let total = 0;
    let iterations = [];
    prs.map((pr,i)=>{
        iterations.push(1);
        const len = pr.reviewThreads.length;
        if(len > 0){
            let arr = [];
            pr.commits.map(({createdAt})=>{
                arr.push({type:"commit",createdAt});
            })
            pr.reviewThreads.map((review)=>{
                if(review.comments.length > 0){
                    arr.push({type:"review",createdAt:review.comments[0].createdAt})
                }
            })
            let sortedArr = arr.sort((a,b)=>(a.createdAt > b.createdAt)?1:(a.createdAt < b.createdAt)?-1:0);
            let type = "commit";
            let iteration = 0;
            sortedArr.map((item)=>{
                if(type !== item.type){
                    if(type === "review"){
                        iteration++;
                    }
                    type = item.type;
                }
            })
            if(sortedArr[sortedArr.length-1].type === "commit"){
                iteration++;
            }
            avg+=len;
            avgIteration += iteration;
            if(len > max){
                max = len;
                maxPr = {id:pr.id,number:pr.number,repo:pr.repo};
            }
            if(iteration > maxIteration){
                maxIteration = iteration;
                maxIterationPr = {id:pr.id,number:pr.number,repo:pr.repo,arr:sortedArr};
            }
            total++;
            
        }
    })
    if(total===0){
        total=1;
    }
    return [avg,avg/total,{value:max,pr:maxPr},total,{total:avgIteration,avg:ParseFloat(avgIteration/total),max:maxIteration,maxPr:maxIterationPr}];
}

const calculatePrTimeTaken = (prs,options={}) => {
    let avg = 0;
    let max = 0;
    let maxPr = {};
    let total = 0;
    prs.map((pr)=>{
        if(pr.timeTaken > 0){
            if(!pr.isDraft || (options.hasOwnProperty('allowDraft') && options.allowDraft)){
                avg+=pr.timeTaken;
                total++;
                if(pr.timeTaken > max){
                    max = pr.timeTaken;
                    maxPr = pr;
                }
            }
        }
    })
    return [avg,avg/total,{value:max,pr:maxPr}];
}

const getTopThreeUsers = (users,metric="count") => {
    let arr = [...users];
    let innerKey = "total";
    if(metric === "prCycle"){
        innerKey = "avg";
    }
    arr = arr.sort((a,b)=>(a.result[metric][innerKey] < b.result[metric][innerKey])?1:(a.result[metric][innerKey] > b.result[metric][innerKey])?-1:0);
    let topArr = [];
    if(metric === "prCycle"){
        arr = arr.filter(a => a.result[metric][innerKey] >= MIN_PR_CYCLE_TIME);
    }
    let len = arr.length;
    arr.map((user,i)=>{
        if(metric === "prCycle"){
            if(i>len - 4){
                topArr.push(user);
            }
        }else{
            if(i<3){
                topArr.push(user);
            }
        }
    })
    return topArr;
}

const getTopFiveTeams = (teams,metric="count") => {
    let arr = [...teams];
    let innerKey = "total";
    if(metric === "prCycle"){
        innerKey = "avg";
    }
    arr = arr.sort((a,b)=>(a.result[metric][innerKey] < b.result[metric][innerKey])?1:(a.result[metric][innerKey] > b.result[metric][innerKey])?-1:0);
    let topArr = [];
    if(metric === "prCycle"){
        arr = arr.filter(a => a.result[metric][innerKey] >= MIN_PR_CYCLE_TIME);
    }
    let len = arr.length;
    arr.map((team,i)=>{
        if(metric === "prCycle"){
            if(i>len - 6){
                topArr.push(team);
            }
        }else{
            if(i<5){
                topArr.push(team);
            }
        }
    })
    return topArr;
}

const calculatePrCycle = (prs,options={}) => {
    let from = '';
    let to = '';
    if(options.hasOwnProperty('lastdays')){
        to = new Date();
        from = new Date();       
        from.setDate(to.getDate() - options.lastdays);
    }else if(options.hasOwnProperty('from') && options.hasOwnProperty('to')){
        from = new Date(options.from);
        to = new Date(options.to);
    }else if(options.hasOwnProperty('from')){
        from = new Date(options.from);
        to = new Date();
    }else{
        // default show metrics for last 7 days
        to = new Date();
        from = new Date();
        from.setDate(to.getDate() - 6);
    }

    let timeTaken = 0;
    if(options.hasOwnProperty('prCycle') && options.prCycle){
        timeTaken = MIN_PR_CYCLE_TIME;
    }

    const arr = prs.filter((pr) => pr.updatedAt >= convertDate(from) && pr.closedAt !== null && pr.closedAt <= convertDate(to) && pr.timeTaken > timeTaken);
    return calculateMetrics(arr);
}

const comparePrCycle = (pastData,data) => {
    if((pastData.includes('day') && data.includes('day')) || (pastData.includes('hour') && data.includes('hour')) || pastData.includes('min') && data.includes('min')){
        let p = parseFloat(pastData.split(' ')[0]);
        let d = parseFloat(data.split(' ')[0]);
        if(p < d){
            return true;
        }else{
            return false;
        }
    }else if(pastData.includes('day')){
        return true;
    }else if(data.includes('day')){
        return false;
    }else if(pastData.includes('hour')){
        return true;
    }else{
        return false;
    }
}

function ParseFloat(str,val=2) {
    // str = str.toString();
    // str = str.slice(0, (str.indexOf(".")) + val + 1); 
    str = str.toFixed(val);
    return Number(str);   
}



export {
    calculatePrsByDate,
    calculateMetrics,
    getTopThreeUsers,
    getTopFiveTeams,
    calculatePrCycle,
    calculatePrTimeTaken,
    comparePrCycle,

    getPrCount,
}