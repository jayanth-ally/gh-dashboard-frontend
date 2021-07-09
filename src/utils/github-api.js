import * as http from './http';
import { getToday } from './time-conversion';
var github = require('octonode');

export default class Client{

    constructor(){
        // this.client = github.client(process.env.REACT_APP_GITHUB_TOKEN);
        this.repos = [];
        this.selectedRepo = '';
        this.totalPr = 0;
        this.prArr = [];
        this.query = {
            type:null,
            state:null,
            repo:null,
            created:null,
            updated:null,
            closed:null,
            _is:[],
            _in:[],
            text:'',
        }
    }
    static init = ()=>{
        return (async function(){
            let client = new Client();
            await client.build();
            return client;
        }());
    }
    build = async () => {
        let parent = this;
        this.repos = await new Promise((resolve,reject)=>{
            http.getRepos().then(({data}) => {
                let repo = data.repos[0];
                parent.selectRepo(repo.owner+'/'+repo.name);
                resolve(data.repos);               
            })
        });
    }
    selectRepo = (repo) => {
        this.selectedRepo = repo;
        console.log('selected repo',this.selectedRepo);
    }
    getRepos = () => {
        return this.repos;
    }

    getPrs = async (mode,count,last,state) => {
        let today = getToday();
        if(count){
            if(last === 'days'){
                today = new Date(today.setDate(today.getDate() - count));
            }else if(last === 'months'){
                today = new Date(today.setMonth(today.getMonth() - count))
            }else{
                today=null;
            }
            if(today){
                const year = today.getFullYear();
                let month = today.getMonth()+1;
                let date = today.getDate();
                if(month <= 9){
                    month = '0'+month;
                }
                if(date <= 9){
                    date = '0'+date;
                }
                today = year+'-'+month+'-'+date;
            }
            let query = {...this.query,type:'pr',state,[mode]:today,repo:this.selectedRepo}
            const q = this.getQuery(query);
            let result = {};
            let page = 1;
            do{
                result = await this.searchByQuery(q,page);
                this.total = result.total_count;
                this.prArr = this.prArr.concat(result.items);
                page++;
            }while(result.items.length !== 100)
            return [...this.prArr];
        }
    }

    searchByQuery =  async(q,page=1) => {
        // let ghsearch = this.client.search();
        console.log('query',q);
        return await new Promise((resolve,reject) => {
            // ghsearch.issuesAsync({
            //     q,
            //     page,
            //     per_page:100,
            //     sort:'created',
            //     order:'desc'
            // }).then((res)=>{
            //     resolve(res[0]);
            // })
        })
    }

    getQuery = ({type,state,repo,created,updated,closed,_is,_in,text}) => {
        let q = '';

        if(type){
            q += 'type:'+type;
        }
        if(state && state!=='all'){
            q += '+state:'+state;
        }
        
        q += '+repo:'+this.selectedRepo;

        if(created){
            q += '+created:>='+created;
        }else if(updated){
            q += '+updated:>='+updated;
        }else if(closed){
            q += '+closed:>='+closed;
        }

        if(_is.length > 0){
            _is.map((item)=>{
                q += '+is:'+item;
            })
        }
        if(_in.length > 0){
            _in.map((item)=>{
                q += '+in:'+item;
            })
        }

        if(text !== ''){
            q += '+'+text;
        }

        return q;
    }
}

