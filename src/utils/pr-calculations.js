const calculateMetrics = (prs,options={}) => {

    let from = '';
    let to = '';
    if(options.hasOwnProperty('lastdays')){
        to = new Date();
        from = new Date(to.getDate() - options.lastdays);        
    }else if(options.hasOwnProperty('from') && options.hasOwnProperty('to')){
        from = new Date(options.from);
        to = new Date(options.to);
    }else if(options.hasOwnProperty('from')){
        from = new Date(options.from);
        to = new Date();
    }else{
        // default show metrics for last 7 days
        to = new Date();
        from = new Date(to.getDate() - 7);
    }
    let metrics = {};

    prs.map((pr) => {
        
    })
}