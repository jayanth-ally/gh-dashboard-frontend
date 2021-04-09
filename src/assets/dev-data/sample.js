// Only for testing - delete on integration

const repos = {
    status:200,
    data:{
        total:2,
        repos:[
            {
                id:"sample_id_1",
                owner:"OKRCentral",
                name:"main",
                totalCollaborators:91,
                totalPr:7569,
                totalPrOpen:360,
                totalPrClosed:1166,
                totalPrMerged:6043
            },
            {
                id:"sample_id_2",
                owner:"OKRCentral",
                name:"okradmin",
                totalCollaborators:74,
                totalPr:109,
                totalPrOpen:11,
                totalPrClosed:27,
                totalPrMerged:71
            }
        ]
    }
}

export {
    repos
}