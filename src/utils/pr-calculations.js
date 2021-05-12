import {convertDate,getNextDate,getPreviousDate} from './time-conversion';

const calculatePrsByDate = (prs,options={}) => {
    if(prs.length === 0){
        return {message:"No Prs available",count:0};
    }
    prs = filterPrsByDate(prs,options);
    let lastDate = new Date().toISOString();
    let endDate = new Date().toISOString();
    prs.map((pr)=>{
        if(pr.updatedAt < lastDate){
            lastDate = pr.updatedAt;
        }
        if(endDate < pr.updatedAt){
            endDate = pr.updatedAt;
        }
    })
    endDate = getNextDate(endDate);
    const startDate = convertDate(lastDate);
    let total = 0;
    let from = startDate;
    let to = getNextDate(startDate);
    let resultSet = [];

    while(total < prs.length && from <= endDate){
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
    arr = prs;
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
                avgDeletions:0
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
            avgDeletions:ParseFloat(files.avgDeletions)
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
    avgAdditions /= totalFiles;
    avgDeletions /= totalFiles;
    return [avg,avg/total,{value:max,pr:maxPr},{value:maxFileCount,file:fileWithMaxCount,total:files.length,avgAdditions,avgDeletions}];
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

const getTopFiveTeams = (teams,metric="count") => {
    let arr = [];
    teams.map((team)=>{ 
        arr.push({id:team._id,name:team.name,result:calculateMetrics(team.prs)});
    })
    arr = arr.sort((a,b)=>(a.result[metric].total < b.result[metric].total)?1:(a.result[metric].total > b.result[metric].total)?-1:0);
    let topArr = [];
    arr.map((team,i)=>{
        if(i<5){
            topArr.push(team);
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

    const arr = prs.filter((pr) => pr.createdAt >= convertDate(from) && pr.closedAt !== null && pr.closedAt <= convertDate(to));
    return calculateMetrics(arr);
}

const getQuery = (repo,options={}) => {
    let query = '';
    let type = 'pr';
    let state = 'all';

    if(options.hasOwnProperty('type')){
        type = options.type;
    }
    query += 'type:'+type;

    query += '+repo:'+repo.owner+'/'+repo.name;

    if(options.hasOwnProperty('state')){
        state = options.state;
    }
    if(state !== 'all'){
        query += '+state:'+state;
    }

    if(options.hasOwnProperty('created')){
        query += '+created:'+options.created.symbol+convertDate(options.created.date);
    }
    if(options.hasOwnProperty('updated')){
        query += '+updated:'+options.updated.symbol+convertDate(options.updated.date);
    }
    if(options.hasOwnProperty('closed')){
        query += '+closed:'+options.closed.symbol+convertDate(options.closed.date);
    }

    if(options.hasOwnProperty('_is')){
        options._is.map((item)=>{
            query += '+is:'+item;
        })
    }
    if(options.hasOwnProperty('_in')){
        options._in.map((item)=>{
            query += '+in:'+item;
        })
    }

    if(options.hasOwnProperty('text')){
        query += '+'+options.text;
    }

    return query;
}

function ParseFloat(str,val=2) {
    str = str.toString();
    str = str.slice(0, (str.indexOf(".")) + val + 1); 
    return Number(str);   
}



export {
    calculatePrsByDate,
    calculateMetrics,
    getTopFiveTeams,
    calculatePrCycle,
    getQuery
}