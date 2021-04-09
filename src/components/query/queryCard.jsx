import Client from '../../utils/github-api';
import '../../App.css';
import { useEffect, useState } from 'react';


function QueryCard () {
  const [client,setClient] = useState(new Client());
  const [repos,setRepos] = useState([]);
  const [selectedRepo,setSelectedRepo] = useState('');
  const [prMode,setPrMode] = useState('created');
  const [prLastCount,setPrLastCount] = useState('');
  const [prLast,setPrLast] = useState('days');
  const [prState,setPrState] = useState('all');
  useEffect(()=>{
    async function init(){
      Client.init().then((res)=>{
        setClient(res);
        setRepos(res.getRepos());
      })
    }
    init();
  },[])

  useEffect(()=>{
    if(repos.length > 0){
      client.selectRepo(selectedRepo);
      setPrMode('created');
      setPrLastCount('');
      setPrLast('days');
      setPrState('all');
    }
  },[selectedRepo])

  useEffect(()=>{
    if(prLastCount.toString !== '' && prLastCount > 0){
      client.getPrs(prMode,prLastCount,prLast,prState).then(res => {
        const prArr = res;
        if(prArr){
          console.log('response',prArr[0]);
        }
      });
    }
  },[prMode,prLastCount,prLast,prState])
  
  const onRepoSelected = (event) => {
    setSelectedRepo(event.target.value);
  }
  const onPrModeChanged = (event) => {
    setPrMode(event.target.value);
  }
  const onPrLastCountChanged = (event) =>{
    setPrLastCount(event.target.value);
  }
  const onPrLastSelected = (event) => {
    setPrLast(event.target.value);
  }
  const onPrStateSelected = (event) => {
    setPrState(event.target.value);
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="card home-card">
          <div className="card-head">
            <div className="repositories-dropdown">
              <label>Repository: </label>
              <select 
                className="form-select" 
                value={selectedRepo}
                onChange={onRepoSelected}
                aria-label="Default select example">
                {repos.map((repo,i)=>{
                  return <option key={i} value={repo.owner+'/'+repo.name}>{repo.owner+'/'+repo.name}</option>
                })}
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="pr-dashboard">
              <label>Pull Requests</label>
                <div className="form-input">
                  <select
                    className="form-select" 
                    value={prMode}
                    onChange={onPrModeChanged}
                    aria-label="Default select example">
                      <option value="created">created</option>
                      <option value="updated">updated</option>
                      <option value="closed">closed</option>
                    </select>
                  <label> in Last</label>
                  <input type="number" id="lastdays" value={prLastCount} onChange={onPrLastCountChanged}/>
                  <select
                    className="form-select" 
                    value={prLast}
                    onChange={onPrLastSelected}
                    aria-label="Default select example">
                      <option value="days">days</option>
                      <option value="months">months</option>
                    </select>
                </div>
                <div className="form-input">
                  <label>State:</label>
                  <select
                    className="form-select" 
                    value={prState}
                    onChange={onPrStateSelected}
                    aria-label="Default select example">
                      <option value="all">all</option>
                      <option value="open">open</option>
                      <option value="closed">closed</option>
                    </select>
                </div>
            </div>
          </div>
        </div>        
      </header>
    </div>
  );
}

export default QueryCard;
