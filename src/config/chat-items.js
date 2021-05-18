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
        name:'Comments',
        option:(res,range)=>charts.getStackedLineForPrs(res,'comments'),
    },
    {
        name:'PR Cycle',
        option:(res)=>charts.getStackedLineForPrs(res,'timeTaken'),
    },
    {
        name:'Files Changed',
        option:(res,range)=>charts.getStackedLineForPrs(res,'changedFiles'),
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
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'count','total',teams),
    },
    {
        name:'Count - Open',
        key:'count',
        innerKey:'open',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'count','open',teams),
    },
    {
        name:'Count - Closed',
        key:'count',
        innerKey:'closed',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'count','closed',teams),
    },
    {
        name:'Count - Merged',
        key:'count',
        innerKey:'merged',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'count','merged',teams),
    },
    {
        name:'Commits - Total',
        key:'commits',
        innerKey:'total',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','total',teams),
    },
    {
        name:'Commits - Avg',
        key:'commits',
        innerKey:'avg',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','avg',teams),
    },
    {
        name:'Commits - Max',
        key:'commits',
        innerKey:'max',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','max',teams),
    },
    {
        name:'Reverts',
        key:'commits',
        innerKey:'reverts',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'commits','reverts',teams),
    },
    {
        name:'Reviews - Total',
        key:'reviews',
        innerKey:'total',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'reviews','total',teams),
    },
    {
        name:'Reviews - Avg',
        key:'reviews',
        innerKey:'avg',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'reviews','avg',teams),
    },
    {
        name:'Reviews - Max',
        key:'reviews',
        innerKey:'max',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'reviews','max',teams),
    },
    {
        name:'Iterations - Total',
        key:'iterations',
        innerKey:'total',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'iterations','total',teams),
    },
    {
        name:'Iterations - Avg',
        key:'iterations',
        innerKey:'avg',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'iterations','avg',teams),
    },
    {
        name:'Iterations - Max',
        key:'iterations',
        innerKey:'max',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'iterations','max',teams),
    },
    {
        name:'Comments - Total',
        key:'comments',
        innerKey:'total',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'comments','total',teams),
    },
    {
        name:'Comments - Avg',
        key:'comments',
        innerKey:'avg',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'comments','avg',teams),
    },
    {
        name:'Comments - Max',
        key:'comments',
        innerKey:'max',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'comments','max',teams),
    },
    {
        name:'PR Cycle - Total',
        key:'timeTaken',
        innerKey:'total',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'timeTaken','total',teams),
    },
    {
        name:'PR Cycle - Avg',
        key:'timeTaken',
        innerKey:'avg',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'timeTaken','avg',teams),
    },
    {
        name:'PR Cycle - Max',
        key:'timeTaken',
        innerKey:'max',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'timeTaken','max',teams),
    },
    {
        name:'Files Changed - Total',
        key:'changedFiles',
        innerKey:'total',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'changedFiles','total',teams),
    },
    {
        name:'Files Changed - Avg',
        key:'changedFiles',
        innerKey:'avg',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'changedFiles','avg',teams),
    },
    {
        name:'Files Changed - Max',
        key:'changedFiles',
        innerKey:'max',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'changedFiles','max',teams),
    },
    {
        name:'File - Avg lines added',
        key:'files',
        innerKey:'avgAdditions',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'files','avgAdditions',teams),
    },
    {
        name:'File - Avg lines deleted',
        key:'files',
        innerKey:'avgvDeletions',
        option:(res,range,teams)=>charts.getStackedLinesForMultiplePrs(res,range,'files','avgDeletions',teams),
    },
]

const topTeamsArr = [
    {
        name:'Top 5 Teams (Total PR)',
        key:'count',
        option:(teams,key)=>charts.getHorizontalStackedBarsForTeamsPRCount(teams),
    },
    {
        name:'Top 5 Teams (Commits)',
        key:'commits',
        option:(teams,key)=>charts.getHorizontalStackedBarsForTeams(teams,key),
    }
]

const prsLastWeek = {
    name:'PR in last 7 days',
    option:(prs,range,teams)=>charts.getBarForNoOfPrs(prs),
}

const prsLastDay = {
    name:'PR in last 24 hours',
    option:(prs,range,teams)=>charts.getBarForNoOfPrs(prs),
}

export {
    defaultArr,
    multiArr,
    topTeamsArr,
    prsLastWeek,
    prsLastDay
}