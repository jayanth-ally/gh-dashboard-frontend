import * as charts from '../utils/chart-conversion';

const defaultArr = [
    {
        name:'Count',
        option:(res,range)=>charts.getBarForNoOfPrs(res)
    },
    {
        name:'Commits',
        option:(res,range)=>charts.getStackedLineForPrs(res,'commits')
    },
    {
        name:'Reverts',
        option:(res,range)=>charts.getStackedLineForReverts(res)
    },
    {
        name:'Reviews',
        option:(res,range)=>charts.getStackedLineForPrs(res,'reviews')
    },
    {
        name:'Iterations',
        option:(res,range)=>charts.getStackedLineForPrs(res,'iterations'),
    },
    {
        name:'PR Cycle',
        option:(res)=>charts.getStackedLineForPrs(res,'prCycle'),
    },
    {
        name:'Files',
        option:(res,range)=>charts.getStackedLineForFiles(res),
    },
]
const multiArr = [
    {
        name:'Count - Total',
        key:'count',
        innerKey:'total',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'count','total',type),
    },
    {
        name:'Count - Open',
        key:'count',
        innerKey:'open',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'count','open',type),
    },
    {
        name:'Count - Closed',
        key:'count',
        innerKey:'closed',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'count','closed',type),
    },
    {
        name:'Count - Merged',
        key:'count',
        innerKey:'merged',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'count','merged',type),
    },
    {
        name:'Commits - Total',
        key:'commits',
        innerKey:'total',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','total',type),
    },
    {
        name:'Commits - Avg',
        key:'commits',
        innerKey:'avg',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','avg',type),
    },
    {
        name:'Commits - Max',
        key:'commits',
        innerKey:'max',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','max',type),
    },
    {
        name:'Reverts',
        key:'commits',
        innerKey:'reverts',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','reverts',type),
    },
    {
        name:'Reviews - Total',
        key:'reviews',
        innerKey:'total',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'reviews','total',type),
    },
    {
        name:'Reviews - Avg',
        key:'reviews',
        innerKey:'avg',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'reviews','avg',type),
    },
    {
        name:'Reviews - Max',
        key:'reviews',
        innerKey:'max',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'reviews','max',type),
    },
    {
        name:'Iterations - Total',
        key:'iterations',
        innerKey:'total',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'iterations','total',type),
    },
    {
        name:'Iterations - Avg',
        key:'iterations',
        innerKey:'avg',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'iterations','avg',type),
    },
    {
        name:'Iterations - Max',
        key:'iterations',
        innerKey:'max',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'iterations','max',type),
    },
    {
        name:'PR Cycle - Total',
        key:'prCycle',
        innerKey:'total',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'prCycle','total',type),
    },
    {
        name:'PR Cycle - Avg',
        key:'prCycle',
        innerKey:'avg',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'prCycle','avg',type),
    },
    {
        name:'PR Cycle - Max',
        key:'prCycle',
        innerKey:'max',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'prCycle','max',type),
    },
    {
        name:'File - Total lines added',
        key:'files',
        innerKey:'additions',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'files','additions',type),
    },
    {
        name:'File - Total lines deleted',
        key:'files',
        innerKey:'deletions',
        option:(res,range,type)=>charts.getStackedLinesForMultiplePrs(res,range,'files','deletions',type),
    },
]

const topTeamsArr = [
    {
        name:'Top 5 Teams (Total PRs)',
        key:'count',
        option:(teams,key)=>charts.getHorizontalStackedBarsForTeamsPRCount(teams),
    },
    {
        name:'Top 5 Teams (Commits)',
        key:'commits',
        option:(teams,key)=>charts.getHorizontalStackedBarsForTeams(teams,key),
    },
    {
        name:'Top 5 Teams (Review Comments)',
        key:'reviews',
        option:(teams,key)=>charts.getHorizontalStackedBarsForTeams(teams,key),
    },
    {
        name:'Top 5 Teams (PR Cycle)',
        key:'prCycle',
        option:(teams,key)=>charts.getHorizontalStackedBarsForTeamsPRCycle(teams,key),
    }
]

const prsCurrent = {
    option:(result)=>charts.getBarForNoOfPrs(result),
}

const prsLastDay = {
    option:(result)=>charts.getBarForNoOfPrs(result),
}

const prsPrevious = {
    option:(result)=>charts.getBarForNoOfPrs(result),
}

export {
    defaultArr,
    multiArr,
    topTeamsArr,
    prsLastDay,
    prsCurrent,
    prsPrevious,
}