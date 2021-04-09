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

const getTimeDifference = (start,end)=>{
    const milliseconds = Math.abs(end - start);
    return msToDHM(milliseconds);
}

const getTimeDifferenceInSeconds = (start,end)=>{
    const milliseconds = Math.abs(end - start);
    return milliseconds/1000;
}

export {
    getDiffDays,
    msToDHM,
    getTimeDifference,
    getTimeDifferenceInSeconds
}